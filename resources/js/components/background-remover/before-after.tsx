import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BeforeAfterProps = {
    beforeUrl: string;
    afterUrl: string | null;
    processing?: boolean;
    className?: string;
    children?: ReactNode;
};

export function BeforeAfter({
    beforeUrl,
    afterUrl,
    processing,
    className,
    children,
}: BeforeAfterProps) {
    const labelId = useId();
    const trackRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(50);
    const [dragging, setDragging] = useState(false);

    const updateFromClientX = useCallback((clientX: number) => {
        const track = trackRef.current;

        if (!track) {
            return;
        }

        const rect = track.getBoundingClientRect();
        const next = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.max(2, Math.min(98, next)));
    }, []);

    useEffect(() => {
        if (!dragging) {
            return;
        }

        const onMove = (event: PointerEvent) => {
            updateFromClientX(event.clientX);
        };
        const onUp = () => setDragging(false);

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [dragging, updateFromClientX]);

    const showCompare = Boolean(afterUrl) && !processing;

    return (
        <div
            ref={trackRef}
            className={cn(
                'relative overflow-hidden rounded-2xl border border-aristech-border bg-aristech-surface shadow-md shadow-slate-900/5',
                className,
            )}
        >
            <div className="ie-checker absolute inset-0" />

            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                <img
                    src={beforeUrl}
                    alt="Avant — image originale"
                    className="absolute inset-0 z-[1] size-full object-contain p-3 sm:p-5"
                    draggable={false}
                />

                {showCompare ? (
                    <>
                        <div
                            className="absolute inset-0 z-[2] overflow-hidden"
                            style={{
                                clipPath: `inset(0 ${100 - position}% 0 0)`,
                            }}
                        >
                            <div className="ie-checker absolute inset-0" />
                            <img
                                src={afterUrl!}
                                alt="Après — fond retiré"
                                className="absolute inset-0 size-full object-contain p-3 sm:p-5"
                                draggable={false}
                            />
                        </div>

                        <div
                            className="absolute inset-y-0 z-[3] w-px bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.15)]"
                            style={{ left: `${position}%` }}
                            aria-hidden
                        >
                            <button
                                type="button"
                                aria-labelledby={labelId}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(position)}
                                role="slider"
                                className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-aristech-border bg-white text-aristech-heading shadow-md transition-colors duration-200 hover:border-aristech-accent"
                                onPointerDown={(event) => {
                                    event.preventDefault();
                                    setDragging(true);
                                    updateFromClientX(event.clientX);
                                }}
                            >
                                <span className="sr-only" id={labelId}>
                                    Comparer avant et après
                                </span>
                                <span
                                    className="flex gap-0.5 text-[10px] font-bold tracking-tight"
                                    aria-hidden
                                >
                                    ‹ ›
                                </span>
                            </button>
                        </div>

                        <span className="absolute top-3 left-3 z-[4] rounded-md bg-slate-900/75 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
                            Avant
                        </span>
                        <span className="absolute top-3 right-3 z-[4] rounded-md bg-aristech-accent px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase shadow-sm">
                            Après
                        </span>
                    </>
                ) : (
                    <span className="absolute top-3 left-3 z-[4] rounded-md bg-slate-900/75 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
                        Original
                    </span>
                )}

                {children}
            </div>
        </div>
    );
}
