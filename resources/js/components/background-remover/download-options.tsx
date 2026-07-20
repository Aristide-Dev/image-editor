import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
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
                <h2 className="text-xl font-bold">Télécharger</h2>
                <p className="mt-1 text-sm text-aristech-muted">
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
                                'group flex cursor-pointer flex-col items-start rounded-xl border border-aristech-border bg-aristech-surface p-4 text-left transition-colors duration-200',
                                'hover:border-aristech-accent/50 hover:bg-white',
                                'focus-visible:ring-2 focus-visible:ring-aristech-accent focus-visible:outline-none',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                            )}
                        >
                            <span className="font-heading text-lg font-bold text-aristech-heading">
                                {preset.label}
                            </span>
                            <span className="mt-0.5 text-xs text-aristech-muted">
                                {preset.description}
                            </span>
                            <span className="mt-3 text-sm font-medium tabular-nums text-aristech-heading">
                                {size.width} × {size.height}
                            </span>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-aristech-accent transition-opacity duration-200 group-hover:opacity-90">
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

            <button
                type="button"
                disabled={busyId !== null}
                onClick={() => void handleDownload(DOWNLOAD_PRESETS[0])}
                className="tools-cta-primary"
            >
                {busyId === 'original' ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                    <Download className="size-4" aria-hidden />
                )}
                Télécharger HD
            </button>
        </section>
    );
}
