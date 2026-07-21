import { Head } from '@inertiajs/react';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IconPreviewGrid } from '@/components/icon-generator/icon-preview-grid';
import { IconUploadZone } from '@/components/icon-generator/icon-upload-zone';
import { PlatformPicker } from '@/components/icon-generator/platform-picker';
import {
    downloadIconPack,
    generateIconPack,
    revokeGeneratedPreviews,
    type GenerationResult,
} from '@/lib/icon-generator/package';
import {
    PLATFORM_SPECS,
    type GenerateOptions,
    type PlatformId,
} from '@/lib/icon-generator/specs';
import { buildHtmlHead } from '@/lib/icon-generator/snippets';

type PackState = {
    result: GenerationResult;
};

export default function IconGenerator() {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [platforms, setPlatforms] = useState<PlatformId[]>(['web']);
    const [appName, setAppName] = useState('Mon App');
    const [themeColor, setThemeColor] = useState('#16a34a');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [busy, setBusy] = useState(false);
    const [percent, setPercent] = useState(0);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [packs, setPacks] = useState<PackState[]>([]);
    const [activeSnippet, setActiveSnippet] = useState<PlatformId>('web');

    useEffect(() => {
        return () => {
            if (sourceUrl) {
                URL.revokeObjectURL(sourceUrl);
            }
        };
    }, [sourceUrl]);

    useEffect(() => {
        return () => {
            for (const pack of packs) {
                revokeGeneratedPreviews(pack.result.icons);
            }
        };
    }, [packs]);

    const reset = () => {
        if (sourceUrl) {
            URL.revokeObjectURL(sourceUrl);
        }

        for (const pack of packs) {
            revokeGeneratedPreviews(pack.result.icons);
        }

        setSourceFile(null);
        setSourceUrl(null);
        setPacks([]);
        setError(null);
        setStatus(null);
        setPercent(0);
        setBusy(false);
    };

    const handleFile = (file: File) => {
        if (sourceUrl) {
            URL.revokeObjectURL(sourceUrl);
        }

        for (const pack of packs) {
            revokeGeneratedPreviews(pack.result.icons);
        }

        setSourceFile(file);
        setSourceUrl(URL.createObjectURL(file));
        setPacks([]);
        setError(null);
    };

    const options: GenerateOptions = {
        appName: appName.trim() || 'App',
        themeColor,
        backgroundColor,
    };

    const handleGenerate = async () => {
        if (!sourceFile || platforms.length === 0 || busy) {
            return;
        }

        setBusy(true);
        setError(null);
        setPercent(0);

        for (const pack of packs) {
            revokeGeneratedPreviews(pack.result.icons);
        }

        setPacks([]);

        try {
            const next: PackState[] = [];

            for (let i = 0; i < platforms.length; i++) {
                const platformId = platforms[i];
                const base = (i / platforms.length) * 100;

                const result = await generateIconPack(
                    sourceFile,
                    platformId,
                    options,
                    (p, message) => {
                        setPercent(Math.round(base + p / platforms.length));
                        setStatus(
                            `${PLATFORM_SPECS[platformId].label} — ${message}`,
                        );
                    },
                );

                next.push({ result });
            }

            setPacks(next);
            setActiveSnippet(platforms[0]);
            setStatus(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Échec de la génération des icônes.',
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Head title="Générateur d’icônes" />

            <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                <section className="ie-animate-rise mx-auto max-w-3xl pt-8 text-center sm:pt-12">
                    <p className="tools-label mb-3">Comme RealFaviconGenerator</p>
                    <h1 className="text-3xl font-bold sm:text-5xl sm:leading-[1.1]">
                        Générateur d’icônes
                        <span className="mt-1 block text-aristech-accent">
                            multi-plateformes
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-base text-aristech-muted sm:text-lg">
                        Une image source → toutes les tailles, noms et fichiers
                        de config selon la techno (Web, React, Next, Flutter,
                        Android, iOS, PWA…).
                    </p>
                </section>

                <section className="ie-animate-rise-delay mx-auto mt-10 max-w-4xl space-y-8">
                    <IconUploadZone onFile={handleFile} disabled={busy} />

                    {sourceUrl ? (
                        <div className="tools-card flex flex-wrap items-center gap-4 p-4">
                            <img
                                src={sourceUrl}
                                alt="Source"
                                className="size-16 rounded-xl border border-aristech-border bg-white object-contain"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-aristech-heading">
                                    {sourceFile?.name}
                                </p>
                                <p className="text-xs text-aristech-muted">
                                    Source prête — choisis les plateformes puis
                                    génère.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="tools-cta-secondary"
                                disabled={busy}
                                onClick={reset}
                            >
                                <RefreshCw className="size-4" aria-hidden />
                                Changer
                            </button>
                        </div>
                    ) : null}

                    <PlatformPicker
                        selected={platforms}
                        onChange={setPlatforms}
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block space-y-1.5">
                            <span className="text-xs font-semibold text-aristech-heading">
                                Nom de l’app
                            </span>
                            <input
                                type="text"
                                value={appName}
                                onChange={(event) =>
                                    setAppName(event.target.value)
                                }
                                className="h-11 w-full rounded-xl border border-aristech-border bg-aristech-surface px-3 text-sm text-aristech-heading outline-none focus:ring-2 focus:ring-aristech-accent"
                            />
                        </label>
                        <label className="block space-y-1.5">
                            <span className="text-xs font-semibold text-aristech-heading">
                                Theme color
                            </span>
                            <input
                                type="color"
                                value={themeColor}
                                onChange={(event) =>
                                    setThemeColor(event.target.value)
                                }
                                className="h-11 w-full cursor-pointer rounded-xl border border-aristech-border bg-aristech-surface px-2"
                            />
                        </label>
                        <label className="block space-y-1.5">
                            <span className="text-xs font-semibold text-aristech-heading">
                                Fond (Apple / maskable)
                            </span>
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(event) =>
                                    setBackgroundColor(event.target.value)
                                }
                                className="h-11 w-full cursor-pointer rounded-xl border border-aristech-border bg-aristech-surface px-2"
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            className="tools-cta-primary h-12 px-7 text-base"
                            disabled={
                                !sourceFile || busy || platforms.length === 0
                            }
                            onClick={() => void handleGenerate()}
                        >
                            {busy ? (
                                <Loader2
                                    className="size-4 animate-spin"
                                    aria-hidden
                                />
                            ) : (
                                <Download className="size-4" aria-hidden />
                            )}
                            {busy
                                ? `Génération… ${percent}%`
                                : 'Générer les packs'}
                        </button>
                        {status ? (
                            <p
                                className="text-sm text-aristech-muted"
                                role="status"
                            >
                                {status}
                            </p>
                        ) : null}
                    </div>

                    {error ? (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                        >
                            {error}
                        </p>
                    ) : null}

                    {packs.length > 0 ? (
                        <div className="space-y-10">
                            <div className="flex flex-wrap gap-3">
                                {packs.map(({ result }) => (
                                    <button
                                        key={result.platformId}
                                        type="button"
                                        className="tools-cta-primary"
                                        onClick={() =>
                                            downloadIconPack(
                                                result.zipBlob,
                                                result.platformId,
                                                options.appName,
                                            )
                                        }
                                    >
                                        <Download
                                            className="size-4"
                                            aria-hidden
                                        />
                                        ZIP{' '}
                                        {
                                            PLATFORM_SPECS[result.platformId]
                                                .label
                                        }
                                    </button>
                                ))}
                            </div>

                            {packs.map(({ result }) => (
                                <IconPreviewGrid
                                    key={result.platformId}
                                    platformId={result.platformId}
                                    icons={result.icons}
                                />
                            ))}

                            <section className="tools-card space-y-3 p-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-heading text-lg font-bold">
                                        Snippet d’intégration
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {platforms.map((id) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() =>
                                                    setActiveSnippet(id)
                                                }
                                                className={
                                                    activeSnippet === id
                                                        ? 'rounded-lg bg-aristech-accent px-2.5 py-1 text-xs font-semibold text-white'
                                                        : 'cursor-pointer rounded-lg bg-aristech-surface-elevated px-2.5 py-1 text-xs font-medium text-aristech-muted hover:text-aristech-heading'
                                                }
                                            >
                                                {PLATFORM_SPECS[id].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-left text-xs leading-relaxed text-emerald-100">
                                    {buildHtmlHead(activeSnippet)}
                                </pre>
                                <p className="text-xs text-aristech-muted">
                                    Normes :{' '}
                                    <code className="rounded bg-aristech-surface-elevated px-1">
                                        favicon.svg
                                    </code>
                                    , favicon 16/32 +{' '}
                                    <code className="rounded bg-aristech-surface-elevated px-1">
                                        favicon.ico
                                    </code>
                                    , Apple Touch 180×180, Android/PWA 192 &amp;
                                    512, mipmap Android, AppIcon iOS. Inspiré de{' '}
                                    <a
                                        href="https://realfavicongenerator.net/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-aristech-accent underline-offset-2 hover:underline"
                                    >
                                        RealFaviconGenerator
                                    </a>
                                    .
                                </p>
                            </section>
                        </div>
                    ) : null}
                </section>
            </div>
        </>
    );
}
