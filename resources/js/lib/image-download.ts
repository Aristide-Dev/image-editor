export type DownloadPreset = {
    id: string;
    label: string;
    description: string;
    /** Max edge length in px; null = original size */
    maxEdge: number | null;
};

export const DOWNLOAD_PRESETS: DownloadPreset[] = [
    {
        id: 'original',
        label: 'Original',
        description: 'Taille native',
        maxEdge: null,
    },
    {
        id: 'xl',
        label: 'XL',
        description: '1920 px',
        maxEdge: 1920,
    },
    {
        id: 'lg',
        label: 'Large',
        description: '1280 px',
        maxEdge: 1280,
    },
    {
        id: 'md',
        label: 'Moyen',
        description: '800 px',
        maxEdge: 800,
    },
    {
        id: 'sm',
        label: 'Petit',
        description: '400 px',
        maxEdge: 400,
    },
];

export type ImageDimensions = {
    width: number;
    height: number;
};

export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Impossible de lire l’image.'));
        };
        img.src = url;
    });
}

export function getScaledDimensions(
    width: number,
    height: number,
    maxEdge: number | null,
): ImageDimensions {
    if (!maxEdge || Math.max(width, height) <= maxEdge) {
        return { width, height };
    }

    const scale = maxEdge / Math.max(width, height);

    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}

export async function renderPngAtSize(
    source: Blob,
    maxEdge: number | null,
): Promise<{ blob: Blob; width: number; height: number }> {
    const img = await loadImageFromBlob(source);
    const { width, height } = getScaledDimensions(
        img.naturalWidth,
        img.naturalHeight,
        maxEdge,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas non disponible.');
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(new Error('Échec de l’export PNG.'));
                }
            },
            'image/png',
            1,
        );
    });

    return { blob, width, height };
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

export function slugifyBasename(name: string): string {
    const base = name.replace(/\.[^.]+$/, '') || 'image';

    return (
        base
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase() || 'image'
    );
}
