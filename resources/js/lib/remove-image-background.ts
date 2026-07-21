export type BackgroundRemovalProgress = {
    percent: number;
    message: string;
};

type ProgressCallback = (progress: BackgroundRemovalProgress) => void;

/**
 * Remove image background in the browser (ONNX model via @imgly/background-removal).
 * First run downloads the model; subsequent calls reuse the cache.
 * Nothing is uploaded to a server.
 *
 * Do NOT import('onnxruntime-web') with @vite-ignore — that leaves a bare
 * module specifier that browsers cannot resolve in production. Imgly loads
 * ORT + WASM itself via its CDN publicPath.
 */
export async function removeImageBackground(
    source: string | Blob | File,
    onProgress?: ProgressCallback,
): Promise<File> {
    const report = (percent: number, message: string) => {
        onProgress?.({
            percent: Math.max(0, Math.min(100, Math.round(percent))),
            message,
        });
    };

    report(2, 'Chargement de l’image…');
    const imageBlob = await resolveBlob(source);

    report(8, 'Chargement du modèle…');

    const { removeBackground } = await import('@imgly/background-removal');

    const blob = await removeBackground(imageBlob, {
        // Avoid Vite spawning broken worker/WASM resolution in prod & dev.
        proxyToWorker: false,
        model: 'isnet_fp16',
        progress: (key, current, total) => {
            if (total > 0 && current < total) {
                const ratio = current / total;
                report(8 + ratio * 72, `Préparation ${key}…`);

                return;
            }

            report(88, 'Retrait de l’arrière-plan…');
        },
    });

    report(96, 'Finalisation…');

    const png =
        blob.type === 'image/png'
            ? blob
            : new Blob([blob], { type: 'image/png' });

    report(100, 'Terminé');

    return new File([png], 'image-sans-fond.png', { type: 'image/png' });
}

async function resolveBlob(source: string | Blob | File): Promise<Blob> {
    if (source instanceof Blob) {
        return source;
    }

    const response = await fetch(source);

    if (!response.ok) {
        throw new Error(
            'Impossible de charger l’image pour le retrait de fond.',
        );
    }

    return response.blob();
}
