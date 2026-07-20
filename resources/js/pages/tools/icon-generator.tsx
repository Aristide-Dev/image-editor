import { Head, Link } from '@inertiajs/react';
import { AppWindow, ArrowRight, Sparkles } from 'lucide-react';

export default function IconGenerator() {
    return (
        <>
            <Head title="Générateur d’icônes" />

            <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
                <section className="ie-animate-rise mx-auto max-w-3xl pt-8 text-center sm:pt-12">
                    <p className="tools-label mb-3">Prochaine feature</p>
                    <h1 className="text-3xl font-bold sm:text-5xl sm:leading-[1.1]">
                        Générateur d’icônes
                        <span className="mt-1 block text-aristech-accent">
                            site & app
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-base text-aristech-muted sm:text-lg">
                        Crée bientôt un set d’icônes cohérent (favicon, PWA,
                        stores) à partir d’un logo ou d’un brief.
                    </p>
                </section>

                <section className="ie-animate-rise-delay mx-auto mt-10 max-w-2xl">
                    <div className="tools-card relative overflow-hidden p-8 text-center sm:p-12">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-40"
                            aria-hidden
                        >
                            <div className="tools-blob top-0 left-1/2 size-64 -translate-x-1/2 bg-aristech-accent/40" />
                        </div>

                        <span className="relative mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-aristech-border bg-white text-aristech-accent shadow-sm">
                            <AppWindow className="size-7" aria-hidden />
                        </span>

                        <h2 className="relative text-xl font-bold sm:text-2xl">
                            En préparation
                        </h2>
                        <p className="relative mx-auto mt-3 max-w-md text-sm text-aristech-muted sm:text-base">
                            Cette page est déjà branchée au layout Cutout. La
                            génération d’icônes arrivera ici — même shell, même
                            marque ArisTech.
                        </p>

                        <ul className="relative mx-auto mt-8 grid max-w-md gap-3 text-left text-sm text-aristech-text sm:grid-cols-2">
                            {[
                                'Favicon multi-tailles',
                                'Icônes PWA / Android',
                                'App Store / Play Store',
                                'Exports PNG & SVG',
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2 rounded-xl border border-aristech-border/70 bg-white/70 px-3 py-2"
                                >
                                    <Sparkles
                                        className="size-3.5 shrink-0 text-aristech-accent"
                                        aria-hidden
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/"
                            className="tools-cta-primary relative mt-8"
                        >
                            Essayer le background remover
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
