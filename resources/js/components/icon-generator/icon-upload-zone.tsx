import { ImagePlus, Upload } from 'lucide-react';
import { useId, useState, type DragEvent } from 'react';
import { cn } from '@/lib/utils';

const ACCEPTED = 'image/png,image/jpeg,image/webp,image/jpg';

type Props = {
    onFile: (file: File) => void;
    disabled?: boolean;
};

export function IconUploadZone({ onFile, disabled }: Props) {
    const inputId = useId();
    const [dragging, setDragging] = useState(false);

    const acceptFile = (file: File | undefined) => {
        if (!file || disabled) {
            return;
        }

        if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
            return;
        }

        onFile(file);
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);
        acceptFile(event.dataTransfer.files?.[0]);
    };

    return (
        <label
            htmlFor={inputId}
            onDragEnter={(event) => {
                event.preventDefault();
                if (!disabled) {
                    setDragging(true);
                }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
                'group flex min-h-[14rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200',
                dragging
                    ? 'border-aristech-accent bg-aristech-accent/5'
                    : 'border-aristech-border bg-aristech-surface hover:border-aristech-accent/60',
                disabled && 'pointer-events-none opacity-60',
            )}
        >
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-aristech-accent/10 text-aristech-accent">
                <ImagePlus className="size-6" aria-hidden />
            </span>
            <span className="font-heading text-lg font-bold text-aristech-heading">
                Dépose ton logo / icône source
            </span>
            <p className="mt-2 max-w-md text-sm text-aristech-muted">
                Idéalement un PNG carré ≥ 512×512 (1024×1024 recommandé). Le fond
                peut être transparent.
            </p>
            <span className="tools-cta-primary mt-5">
                <Upload className="size-4" aria-hidden />
                Choisir une image
            </span>
            <input
                id={inputId}
                type="file"
                accept={ACCEPTED}
                className="sr-only"
                disabled={disabled}
                onChange={(event) => {
                    acceptFile(event.target.files?.[0]);
                    event.target.value = '';
                }}
            />
        </label>
    );
}
