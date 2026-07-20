import { ImagePlus, Upload } from 'lucide-react';
import { useId, useRef, useState, type DragEvent } from 'react';
import { cn } from '@/lib/utils';

const ACCEPTED = 'image/png,image/jpeg,image/webp,image/jpg';

type UploadZoneProps = {
    onFile: (file: File) => void;
    disabled?: boolean;
};

export function UploadZone({ onFile, disabled }: UploadZoneProps) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
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
                'group relative flex min-h-[20rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-14 text-center shadow-md shadow-slate-900/5 transition-colors duration-200 sm:min-h-[24rem]',
                dragging
                    ? 'border-aristech-accent bg-aristech-accent/5'
                    : 'border-aristech-border bg-aristech-surface hover:border-aristech-accent/60',
                disabled && 'pointer-events-none opacity-60',
            )}
        >
            <span className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-aristech-accent/10 text-aristech-accent transition-colors duration-200 group-hover:bg-aristech-accent/15">
                <ImagePlus className="size-7" aria-hidden />
            </span>

            <span className="relative font-heading text-xl font-bold text-aristech-heading sm:text-2xl">
                Dépose une image ici
            </span>
            <p className="relative mt-2 max-w-sm text-sm text-aristech-muted">
                PNG, JPG ou WebP — le fond est retiré automatiquement.
            </p>

            <span className="tools-cta-primary relative mt-7">
                <Upload className="size-4" aria-hidden />
                Upload Image
            </span>

            <input
                ref={inputRef}
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
