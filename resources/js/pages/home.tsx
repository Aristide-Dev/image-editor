import { Head } from '@inertiajs/react';
import { Download, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BeforeAfter } from '@/components/background-remover/before-after';
import { DownloadOptions } from '@/components/background-remover/download-options';
import { UploadZone } from '@/components/background-remover/upload-zone';
import { ImageScanOverlay } from '@/components/image-scan-overlay';
import { Button } from '@/components/ui/button';
import { loadImageFromBlob } from '@/lib/image-download';
import { removeImageBackground } from '@/lib/remove-image-background';

type Stage = 'idle' | 'processing' | 'done';

export default function Home() {
    const [stage, setStage] = useState<Stage>('idle');
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [percent, setPercent] = useState(0);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const runIdRef = useRef(0);

    useEffect(() => {
        return () => {
            if (sourceUrl) {
                URL.revokeObjectURL(sourceUrl);
            }
            if (resultUrl) {
                URL.revokeObjectURL(resultUrl);
            }
        };
    }, [sourceUrl, resultUrl]);

    const reset = () => {
        runIdRef.current += 1;

        if (sourceUrl) {
            URL.revokeObjectURL(sourceUrl);
        }
        if (resultUrl) {
            URL.revokeObjectURL(resultUrl);
        }

        setStage('idle');
        setSourceFile(null);
        setSourceUrl(null);
        setResultBlob(null);
        setResultUrl(null);
        setDimensions({ width: 0, height: 0 });
        setPercent(0);
        setStatus(null);
        setError(null);
    };

    const processFile = async (file: File, previewUrl: string) => {
        const runId = ++runIdRef.current;

        setStage('processing');
        setError(null);
        setPercent(0);
        setStatus('Démarrage…');
        setResultBlob(null);

        if (resultUrl) {
            URL.revokeObjectURL(resultUrl);
            setResultUrl(null);
        }

        try {
            const out = await removeImageBackground(
                file,
                ({ percent: p, message }) => {
                    if (runId !== runIdRef.current) {
                        return;
                    }

                    setPercent(p);
                    setStatus(message);
                },
            );

            if (runId !== runIdRef.current) {
                return;
            }

            const url = URL.createObjectURL(out);
            setResultBlob(out);
            setResultUrl(url);
            setStage('done');
            setStatus(null);

            const img = await loadImageFromBlob(out);
            setDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        } catch (err) {
            if (runId !== runIdRef.current) {
                return;
            }

            setStage('idle');
            setError(
                err instanceof Error
                    ? err.message
                    : 'Échec du retrait de l’arrière-plan.',
            );
            setStatus(null);
            URL.revokeObjectURL(previewUrl);
            setSourceFile(null);
            setSourceUrl(null);
        }
    };

    const handleFile = async (file: File) => {
        if (sourceUrl) {
            URL.revokeObjectURL(sourceUrl);
        }
        if (resultUrl) {
            URL.revokeObjectURL(resultUrl);
        }

        const url = URL.createObjectURL(file);
        setSourceFile(file);
        setSourceUrl(url);
        setResultBlob(null);
        setResultUrl(null);
        setError(null);

        try {
            const img = await loadImageFromBlob(file);
            setDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        } catch {
            setDimensions({ width: 0, height: 0 });
        }

        await processFile(file, url);
    };

    return (
        <>
            <Head title="Retirer l’arrière-plan" />

            <div
                data-image-editor
                className="relative min-h-screen overflow-x-hidden"
            >
                <div className="ie-atmosphere" aria-hidden />

                <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
                    <a
                        href="/"
                        className="ie-display flex items-baseline gap-2 text-2xl tracking-[0.06em] text-[var(--ie-fg)] transition-opacity duration-200 hover:opacity-80"
                    >
                        Cutout
                        <span className="text-xs font-medium tracking-[0.18em] text-[var(--ie-muted)] uppercase">
                            ARIS
                        </span>
                    </a>
                    <p className="text-xs tracking-[0.08em] text-[var(--ie-muted)] uppercase">
                        100 % automatique · gratuit
                    </p>
                </header>

                <main className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
                    <section className="ie-animate-rise mx-auto max-w-3xl pt-6 text-center sm:pt-10">
                        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ie-fg)] sm:text-5xl sm:leading-[1.1]">
                            Retirer l’arrière-plan
                            <span className="block text-[var(--ie-accent)]">
                                d’une image
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ie-muted)] sm:text-lg">
                            En un clic, fond transparent PNG — traitement dans
                            ton navigateur, rien n’est envoyé ni sauvegardé.
                        </p>
                    </section>

                    <section className="ie-animate-rise-delay mx-auto mt-8 max-w-3xl space-y-5 sm:mt-10">
                        {stage === 'idle' && !sourceUrl ? (
                            <UploadZone
                                onFile={(file) => void handleFile(file)}
                            />
                        ) : sourceUrl ? (
                            <BeforeAfter
                                beforeUrl={sourceUrl}
                                afterUrl={resultUrl}
                                processing={stage === 'processing'}
                            >
                                <ImageScanOverlay
                                    active={stage === 'processing'}
                                    percent={percent}
                                    message={status}
                                />
                            </BeforeAfter>
                        ) : null}

                        {error ? (
                            <p
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800"
                            >
                                {error}
                            </p>
                        ) : null}

                        {stage !== 'idle' ? (
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {stage === 'done' && resultBlob ? (
                                    <Button
                                        type="button"
                                        className="h-12 cursor-pointer rounded-xl bg-[var(--ie-accent)] px-7 text-base font-semibold text-white shadow-[0_10px_30px_-12px_var(--ie-accent)] hover:bg-[var(--ie-accent-strong)]"
                                        onClick={() => {
                                            document
                                                .getElementById(
                                                    'download-section',
                                                )
                                                ?.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start',
                                                });
                                        }}
                                    >
                                        <Download
                                            className="size-4"
                                            aria-hidden
                                        />
                                        Télécharger
                                    </Button>
                                ) : null}

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={stage === 'processing'}
                                    onClick={reset}
                                    className="h-12 cursor-pointer rounded-xl border-[var(--ie-line)] bg-white px-5 text-[var(--ie-fg)] hover:bg-slate-50"
                                >
                                    <RefreshCw
                                        className="size-4"
                                        aria-hidden
                                    />
                                    Nouvelle image
                                </Button>
                            </div>
                        ) : null}

                        {stage === 'done' && resultBlob && sourceFile ? (
                            <div id="download-section">
                                <DownloadOptions
                                    resultBlob={resultBlob}
                                    sourceName={sourceFile.name}
                                    naturalWidth={dimensions.width}
                                    naturalHeight={dimensions.height}
                                />
                            </div>
                        ) : null}
                    </section>

                    <section className="ie-animate-rise-delay-2 mx-auto mt-16 grid max-w-3xl gap-6 text-center sm:grid-cols-3 sm:text-left">
                        {[
                            {
                                title: 'Automatique',
                                text: 'Upload → fond retiré en quelques secondes.',
                            },
                            {
                                title: 'Local',
                                text: 'Le fichier ne quitte jamais ton appareil.',
                            },
                            {
                                title: 'Multi-tailles',
                                text: 'Exporte en PNG transparent à la résolution voulue.',
                            },
                        ].map((item) => (
                            <div key={item.title}>
                                <h2 className="text-sm font-semibold tracking-[0.08em] text-[var(--ie-fg)] uppercase">
                                    {item.title}
                                </h2>
                                <p className="mt-2 text-sm text-[var(--ie-muted)]">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="relative z-10 border-t border-[var(--ie-line)]/80 px-5 py-6 text-center text-xs text-[var(--ie-muted)] sm:px-8">
                    Cutout · comme remove.bg, mais 100 % dans le navigateur
                </footer>
            </div>
        </>
    );
}
