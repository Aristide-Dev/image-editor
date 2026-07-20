import type { GeneratedIcon } from '@/lib/icon-generator/package';
import { PLATFORM_SPECS, type PlatformId } from '@/lib/icon-generator/specs';

type Props = {
    platformId: PlatformId;
    icons: GeneratedIcon[];
};

export function IconPreviewGrid({ platformId, icons }: Props) {
    const platform = PLATFORM_SPECS[platformId];

    return (
        <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <h3 className="font-heading text-lg font-bold text-aristech-heading">
                        {platform.label}
                    </h3>
                    <p className="text-xs text-aristech-muted">
                        Aperçu des PNG générés (noms officiels)
                    </p>
                </div>
                <span className="text-xs font-medium text-aristech-muted">
                    {icons.length} aperçus
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {icons.map((icon) => (
                    <figure
                        key={icon.path}
                        className="tools-card flex flex-col overflow-hidden"
                    >
                        <div className="ie-checker flex aspect-square items-center justify-center p-3">
                            <img
                                src={icon.previewUrl}
                                alt={icon.label}
                                className="max-h-full max-w-full object-contain"
                                style={{
                                    width: Math.min(96, icon.width),
                                    height: Math.min(96, icon.height),
                                    imageRendering:
                                        icon.width <= 32 ? 'pixelated' : 'auto',
                                }}
                            />
                        </div>
                        <figcaption className="border-t border-aristech-border/70 px-2.5 py-2">
                            <span className="block truncate text-[11px] font-semibold text-aristech-heading">
                                {icon.label}
                            </span>
                            <span className="block truncate font-mono text-[10px] text-aristech-muted">
                                {icon.width}×{icon.height} · {icon.path.split('/').pop()}
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}
