export type RenderIconOptions = {
    width: number;
    height: number;
    /** CSS color or null for transparent */
    background?: string | null;
    /** 0–0.45 — shrinks logo inside canvas (maskable / safe zone) */
    padding?: number;
};

function loadImage(source: Blob | HTMLImageElement): Promise<HTMLImageElement> {
    if (source instanceof HTMLImageElement) {
        return Promise.resolve(source);
    }

    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(source);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Impossible de lire l’image source.'));
        };
        img.src = url;
    });
}

/**
 * Draw source into a square canvas with cover (crop center) or contain+pad.
 * Uses high-quality smoothing for downscales.
 */
export async function renderIconPng(
    source: Blob | HTMLImageElement,
    options: RenderIconOptions,
): Promise<Blob> {
    const img = await loadImage(source);
    const { width, height, background = null, padding = 0 } = options;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas non disponible.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }

    const pad = Math.min(0.45, Math.max(0, padding));
    const innerW = width * (1 - pad * 2);
    const innerH = height * (1 - pad * 2);
    const innerX = (width - innerW) / 2;
    const innerY = (height - innerH) / 2;

    const srcRatio = img.naturalWidth / img.naturalHeight;
    const dstRatio = innerW / innerH;

    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;

    // cover crop
    if (srcRatio > dstRatio) {
        sw = img.naturalHeight * dstRatio;
        sx = (img.naturalWidth - sw) / 2;
    } else {
        sh = img.naturalWidth / dstRatio;
        sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, innerX, innerY, innerW, innerH);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Échec du rendu PNG.'));
                }
            },
            'image/png',
            1,
        );
    });
}
