import JSZip from 'jszip';
import { downloadBlob } from '@/lib/image-download';
import { buildFaviconIco } from './ico';
import { renderIconPng } from './render';
import { buildTextAsset } from './snippets';
import {
    PLATFORM_SPECS,
    type GenerateOptions,
    type IconAssetSpec,
    type PlatformId,
} from './specs';
import { buildFaviconSvg } from './svg';
export type GeneratedIcon = {
    path: string;
    label: string;
    width: number;
    height: number;
    blob: Blob;
    previewUrl: string;
};

export type GenerationResult = {
    platformId: PlatformId;
    icons: GeneratedIcon[];
    zipBlob: Blob;
};

async function renderAsset(
    source: HTMLImageElement,
    spec: IconAssetSpec,
): Promise<Blob> {
    if (spec.format === 'ico') {
        const png16 = await renderIconPng(source, {
            width: 16,
            height: 16,
            background: null,
        });
        const png32 = await renderIconPng(source, {
            width: 32,
            height: 32,
            background: null,
        });

        return buildFaviconIco([png16, png32]);
    }

    if (spec.format === 'svg') {
        const png = await renderIconPng(source, {
            width: 512,
            height: 512,
            background: spec.background !== undefined ? spec.background : null,
            padding: spec.padding ?? 0,
        });

        return buildFaviconSvg(png, 32);
    }

    return renderIconPng(source, {
        width: spec.width,
        height: spec.height,
        background: spec.background !== undefined ? spec.background : null,
        padding: spec.padding ?? 0,
    });
}

export async function generateIconPack(
    sourceFile: Blob,
    platformId: PlatformId,
    options: GenerateOptions,
    onProgress?: (percent: number, message: string) => void,
): Promise<GenerationResult> {
    const platform = PLATFORM_SPECS[platformId];
    const report = (percent: number, message: string) => {
        onProgress?.(Math.round(percent), message);
    };

    report(5, 'Chargement de l’image…');

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(sourceFile);
        const image = new Image();
        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Image invalide.'));
        };
        image.src = url;
    });

    const zip = new JSZip();
    const icons: GeneratedIcon[] = [];
    const total = platform.icons.length + platform.texts.length;
    let done = 0;

    for (const spec of platform.icons) {
        report(
            8 + (done / Math.max(1, total)) * 80,
            `Génération ${spec.label}…`,
        );

        const blob = await renderAsset(img, spec);
        zip.file(spec.path, blob);

        if (spec.format === 'png' || spec.format === 'svg') {
            icons.push({
                path: spec.path,
                label: spec.label,
                width: spec.width,
                height: spec.height,
                blob,
                previewUrl: URL.createObjectURL(blob),
            });
        }

        done += 1;
    }

    for (const text of platform.texts) {
        report(
            8 + (done / Math.max(1, total)) * 80,
            `Fichier ${text.path}…`,
        );
        const content = buildTextAsset(text.kind, platform, options);
        zip.file(text.path, content);
        done += 1;
    }

    report(92, 'Compression ZIP…');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    report(100, 'Terminé');

    return { platformId, icons, zipBlob };
}

export function downloadIconPack(
    zipBlob: Blob,
    platformId: PlatformId,
    appName: string,
): void {
    const safe = appName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'app';
    downloadBlob(zipBlob, `${safe}-icons-${platformId}.zip`);
}

export function revokeGeneratedPreviews(icons: GeneratedIcon[]): void {
    for (const icon of icons) {
        URL.revokeObjectURL(icon.previewUrl);
    }
}
