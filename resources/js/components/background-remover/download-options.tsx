import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DOWNLOAD_PRESETS,
    downloadBlob,
    getScaledDimensions,
    renderPngAtSize,
    slugifyBasename,
    type DownloadPreset,
} from '@/lib/image-download';
import { cn } from '@/lib/utils';

type DownloadOptionsProps = {
    resultBlob: Blob;
    sourceName: string;
    naturalWidth: number;
    naturalHeight: number;
};

export function DownloadOptions({
    resultBlob,
    sourceName,
    naturalWidth,
    naturalHeight,
}: DownloadOptionsProps) {
    const [busyId, setBusyId] = useState<string | null>(null);

    const handleDownload = async (preset: DownloadPreset) => {
        setBusyId(preset.id);

        try {
            const { blob, width, height } = await renderPngAtSize(
                resultBlob,
                preset.maxEdge,
            );
            const base = slugifyBasename(sourceName);
            const filename = `${base}-sans-fond-${width}x${height}.png`;
            downloadBlob(blob, filename);
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="ie-animate-rise-delay-2 space-y-4">
            <div>
                <h2 className="ie-display text-xl tracking-[0.04em] text-[var(--ie-fg)]">
                    Télécharger
                </h2>
                <p className="mt-1 text-sm text-[var(--ie-muted)]">
                    PNG transparent, plusieurs tailles — aucun fichier n’est
                    stocké côté serveur.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {DOWNLOAD_PRESETS.map((preset) => {
                    const size = getScaledDimensions(
                        naturalWidth,
                        naturalHeight,
                        preset.maxEdge,
                    );
                    const busy = busyId === preset.id;

                    return (
                        <button
                            key={preset.id}
                            type="button"
                            disabled={busyId !== null}
                            onClick={() => void handleDownload(preset)}
                            className={cn(
                                'group flex cursor-pointer flex-col items-start rounded-xl border border-[var(--ie-line)] bg-[var(--ie-paper)]/90 p-4 text-left transition-colors duration-200',
                                'hover:border-[var(--ie-accent)]/50 hover:bg-white',
                                'focus-visible:ring-2 focus-visible:ring-[var(--ie-accent)] focus-visible:outline-none',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                            )}
                        >
                            <span className="ie-display text-lg tracking-[0.04em] text-[var(--ie-fg)]">
                                {preset.label}
                            </span>
                            <span className="mt-0.5 text-xs text-[var(--ie-muted)]">
                                {preset.description}
                            </span>
                            <span className="mt-3 text-sm font-medium tabular-nums text-[var(--ie-fg)]">
                                {size.width} × {size.height}
                            </span>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ie-accent-strong)] transition-opacity duration-200 group-hover:opacity-90">
                                {busy ? (
                                    <Loader2
                                        className="size-3.5 animate-spin"
                                        aria-hidden
                                    />
                                ) : (
                                    <Download
                                        className="size-3.5"
                                        aria-hidden
                                    />
                                )}
                                PNG
                            </span>
                        </button>
                    );
                })}
            </div>

            <Button
                type="button"
                disabled={busyId !== null}
                onClick={() => void handleDownload(DOWNLOAD_PRESETS[0])}
                className="h-11 cursor-pointer rounded-xl bg-[var(--ie-accent)] px-6 font-semibold text-white hover:bg-[var(--ie-accent-strong)]"
            >
                {busyId === 'original' ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                    <Download className="size-4" aria-hidden />
                )}
                Télécharger HD
            </Button>
        </section>
    );
}
