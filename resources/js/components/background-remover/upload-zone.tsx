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
                'group relative flex min-h-[20rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-white px-6 py-14 text-center shadow-[0_24px_80px_-40px_rgba(37,99,235,0.45)] transition-colors duration-200 sm:min-h-[24rem]',
                dragging
                    ? 'border-[var(--ie-accent)] bg-[var(--ie-accent-soft)]'
                    : 'border-slate-200 hover:border-[var(--ie-accent)]/70',
                disabled && 'pointer-events-none opacity-60',
            )}
        >
            <span className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--ie-accent-soft)] text-[var(--ie-accent)] transition-colors duration-200 group-hover:bg-[var(--ie-accent)]/15">
                <ImagePlus className="size-7" aria-hidden />
            </span>

            <span className="relative text-xl font-semibold text-[var(--ie-fg)] sm:text-2xl">
                Dépose une image ici
            </span>
            <p className="relative mt-2 max-w-sm text-sm text-[var(--ie-muted)]">
                PNG, JPG ou WebP — le fond est retiré automatiquement.
            </p>

            <span className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--ie-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_var(--ie-accent)] transition-colors duration-200 group-hover:bg-[var(--ie-accent-strong)]">
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
