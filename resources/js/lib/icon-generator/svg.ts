/** Build a scalable favicon.svg by embedding a square PNG (RealFaviconGenerator style). */

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Lecture data URL impossible.'));
            }
        };
        reader.onerror = () => reject(new Error('Lecture data URL impossible.'));
        reader.readAsDataURL(blob);
    });
}

/**
 * Creates an SVG favicon: vector wrapper + embedded PNG so modern browsers
 * get a resolution-independent tab icon (`favicon.svg`).
 */
export async function buildFaviconSvg(
    pngBlob: Blob,
    size = 32,
): Promise<Blob> {
    const dataUrl = await blobToDataUrl(pngBlob);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <image href="${dataUrl}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;

    return new Blob([svg], { type: 'image/svg+xml' });
}
