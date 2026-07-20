import { Head } from '@inertiajs/react';
import { Download, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BeforeAfter } from '@/components/background-remover/before-after';
import { DownloadOptions } from '@/components/background-remover/download-options';
import { UploadZone } from '@/components/background-remover/upload-zone';
import { ImageScanOverlay } from '@/components/image-scan-overlay';
import { loadImageFromBlob } from '@/lib/image-download';
import { removeImageBackground } from '@/lib/remove-image-background';

type Stage = 'idle' | 'processing' | 'done';

export default function BackgroundRemover() {
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

            <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
                <section className="ie-animate-rise mx-auto max-w-3xl pt-8 text-center sm:pt-12">
                    <p className="tools-label mb-3">Background remover</p>
                    <h1 className="text-3xl font-bold sm:text-5xl sm:leading-[1.1]">
                        Retirer l’arrière-plan
                        <span className="mt-1 block text-aristech-accent">
                            d’une image
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-base text-aristech-muted sm:text-lg">
                        Upload → fond transparent PNG en quelques secondes.
                        Traitement dans ton navigateur, rien n’est envoyé.
                    </p>
                </section>

                <section className="ie-animate-rise-delay mx-auto mt-8 max-w-3xl space-y-5 sm:mt-10">
                    {stage === 'idle' && !sourceUrl ? (
                        <UploadZone onFile={(file) => void handleFile(file)} />
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
                                <button
                                    type="button"
                                    className="tools-cta-primary h-12 px-7 text-base"
                                    onClick={() => {
                                        document
                                            .getElementById('download-section')
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            });
                                    }}
                                >
                                    <Download className="size-4" aria-hidden />
                                    Télécharger
                                </button>
                            ) : null}

                            <button
                                type="button"
                                disabled={stage === 'processing'}
                                onClick={reset}
                                className="tools-cta-secondary h-12"
                            >
                                <RefreshCw className="size-4" aria-hidden />
                                Nouvelle image
                            </button>
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
                        <div key={item.title} className="tools-card p-5">
                            <h2 className="tools-label">{item.title}</h2>
                            <p className="mt-2 text-sm text-aristech-muted">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}
