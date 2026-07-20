import { Check } from 'lucide-react';
import { PLATFORM_LIST, type PlatformId } from '@/lib/icon-generator/specs';
import { cn } from '@/lib/utils';

type Props = {
    selected: PlatformId[];
    onChange: (ids: PlatformId[]) => void;
};

export function PlatformPicker({ selected, onChange }: Props) {
    const toggle = (id: PlatformId) => {
        if (selected.includes(id)) {
            if (selected.length === 1) {
                return;
            }

            onChange(selected.filter((item) => item !== id));

            return;
        }

        onChange([...selected, id]);
    };

    return (
        <fieldset>
            <legend className="tools-label mb-3">Plateforme / techno</legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PLATFORM_LIST.map((platform) => {
                    const active = selected.includes(platform.id);

                    return (
                        <button
                            key={platform.id}
                            type="button"
                            onClick={() => toggle(platform.id)}
                            className={cn(
                                'relative cursor-pointer rounded-2xl border p-4 text-left transition-colors duration-200',
                                active
                                    ? 'border-aristech-accent bg-aristech-accent/10 shadow-sm'
                                    : 'border-aristech-border bg-aristech-surface hover:border-aristech-accent/40',
                            )}
                        >
                            {active ? (
                                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-aristech-accent text-white">
                                    <Check className="size-3" aria-hidden />
                                </span>
                            ) : null}
                            <span className="font-heading text-sm font-bold text-aristech-heading">
                                {platform.label}
                            </span>
                            <span className="mt-1 block text-xs text-aristech-muted">
                                {platform.description}
                            </span>
                            <span className="mt-3 block text-[11px] font-medium text-aristech-accent">
                                {platform.icons.length} fichiers image
                            </span>
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}
