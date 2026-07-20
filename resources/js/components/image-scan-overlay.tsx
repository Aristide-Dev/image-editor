import { cn } from '@/lib/utils';

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function ImageScanOverlay({
    active,
    percent,
    message,
    className,
}: {
    active: boolean;
    percent: number;
    message?: string | null;
    className?: string;
}) {
    if (!active) {
        return null;
    }

    const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
    const dashOffset =
        RING_CIRCUMFERENCE - (safePercent / 100) * RING_CIRCUMFERENCE;

    return (
        <div
            className={cn(
                'pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]',
                className,
            )}
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safePercent}
            aria-label={`Retrait de l’arrière-plan : ${safePercent}%`}
        >
            <div className="absolute inset-0 bg-slate-950/45" />
            <div className="bg-remove-scan-vignette absolute inset-0" />
            <div className="bg-remove-scan-grid absolute inset-0 opacity-[0.14]" />

            <div className="bg-remove-scan-corner absolute top-2 left-2 size-5 border-t border-l border-emerald-300/80" />
            <div className="bg-remove-scan-corner absolute top-2 right-2 size-5 border-t border-r border-emerald-300/80" />
            <div className="bg-remove-scan-corner absolute bottom-2 left-2 size-5 border-b border-l border-emerald-300/80" />
            <div className="bg-remove-scan-corner absolute right-2 bottom-2 size-5 border-r border-b border-emerald-300/80" />

            <div className="bg-remove-scan-mover absolute inset-x-0 top-0">
                <div className="bg-remove-scan-beam absolute inset-x-0 h-28 -translate-y-1/2" />
                <div className="bg-remove-scan-line absolute inset-x-0 top-0 h-px" />
                <div className="bg-remove-scan-line-core absolute inset-x-[8%] top-0 h-[2px]" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-3">
                <div className="relative flex min-h-[7.5rem] min-w-[7.5rem] flex-col items-center justify-center rounded-full border border-white/15 bg-slate-950/75 px-4 py-3 text-center text-slate-50 shadow-[0_8px_32px_rgba(2,6,23,0.45)] backdrop-blur-md">
                    <svg
                        className="absolute inset-0 size-full -rotate-90 p-2"
                        viewBox="0 0 80 80"
                        aria-hidden="true"
                    >
                        <circle
                            cx={40}
                            cy={40}
                            r={RING_RADIUS}
                            fill="none"
                            stroke="rgba(148,163,184,0.25)"
                            strokeWidth={3}
                        />
                        <circle
                            cx={40}
                            cy={40}
                            r={RING_RADIUS}
                            fill="none"
                            stroke="rgb(74,222,128)"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeDasharray={RING_CIRCUMFERENCE}
                            strokeDashoffset={dashOffset}
                            className="transition-[stroke-dashoffset] duration-300 ease-out"
                        />
                    </svg>

                    <span className="relative z-10 text-2xl font-semibold tracking-tight text-slate-50 tabular-nums">
                        {safePercent}
                        <span className="text-sm font-medium text-emerald-300/90">
                            %
                        </span>
                    </span>

                    <span className="relative z-10 mt-0.5 max-w-[6.5rem] truncate text-[10px] font-medium tracking-[0.14em] text-slate-300/90 uppercase">
                        {message?.trim() || 'Analyse'}
                    </span>
                </div>
            </div>

            <div className="absolute inset-x-4 bottom-3">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400/90 to-lime-300 transition-[width] duration-300 ease-out"
                        style={{ width: `${safePercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
