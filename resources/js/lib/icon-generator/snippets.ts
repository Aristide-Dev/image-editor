import type { GenerateOptions, PlatformId, PlatformSpec } from './specs';

export function buildWebManifest(options: GenerateOptions, maskable = false): string {
    const icons = maskable
        ? [
              {
                  src: '/icons/icon-192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
              },
              {
                  src: '/icons/icon-512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any',
              },
              {
                  src: '/icons/maskable-192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'maskable',
              },
              {
                  src: '/icons/maskable-512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
              },
          ]
        : [
              {
                  src: '/android-chrome-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
              },
              {
                  src: '/android-chrome-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
              },
          ];

    return `${JSON.stringify(
        {
            name: options.appName,
            short_name: options.appName.slice(0, 12),
            icons,
            theme_color: options.themeColor,
            background_color: options.backgroundColor,
            display: 'standalone',
        },
        null,
        2,
    )}\n`;
}

export function buildHtmlHead(platform: PlatformId): string {
    if (platform === 'pwa') {
        return `<!-- Coller dans <head> -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#16a34a">
`;
    }

    if (platform === 'nextjs') {
        return `<!-- Next.js App Router :
  - app/icon.svg, app/icon.png, app/favicon.ico, app/apple-icon.png → auto
  - public/favicon.svg en secours -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
`;
    }

    const base = '/';

    return `<!-- Coller dans <head> (chemins depuis ${base}) -->
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="32x32" href="${base}favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${base}favicon-16x16.png">
<link rel="shortcut icon" href="${base}favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="${base}apple-touch-icon.png">
<link rel="manifest" href="${base}site.webmanifest">
<meta name="msapplication-TileColor" content="#16a34a">
<meta name="theme-color" content="#16a34a">
`;
}

export function buildBrowserConfig(themeColor: string): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/android-chrome-192x192.png"/>
      <TileColor>${themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`;
}

export function buildIosContentsJson(): string {
    return `${JSON.stringify(
        {
            images: [
                {
                    size: '20x20',
                    idiom: 'iphone',
                    filename: 'icon-20@2x.png',
                    scale: '2x',
                },
                {
                    size: '20x20',
                    idiom: 'iphone',
                    filename: 'icon-20@3x.png',
                    scale: '3x',
                },
                {
                    size: '29x29',
                    idiom: 'iphone',
                    filename: 'icon-29@2x.png',
                    scale: '2x',
                },
                {
                    size: '29x29',
                    idiom: 'iphone',
                    filename: 'icon-29@3x.png',
                    scale: '3x',
                },
                {
                    size: '40x40',
                    idiom: 'iphone',
                    filename: 'icon-40@2x.png',
                    scale: '2x',
                },
                {
                    size: '40x40',
                    idiom: 'iphone',
                    filename: 'icon-40@3x.png',
                    scale: '3x',
                },
                {
                    size: '60x60',
                    idiom: 'iphone',
                    filename: 'icon-60@2x.png',
                    scale: '2x',
                },
                {
                    size: '60x60',
                    idiom: 'iphone',
                    filename: 'icon-60@3x.png',
                    scale: '3x',
                },
                {
                    size: '20x20',
                    idiom: 'ipad',
                    filename: 'icon-20.png',
                    scale: '1x',
                },
                {
                    size: '20x20',
                    idiom: 'ipad',
                    filename: 'icon-20@2x.png',
                    scale: '2x',
                },
                {
                    size: '29x29',
                    idiom: 'ipad',
                    filename: 'icon-29.png',
                    scale: '1x',
                },
                {
                    size: '29x29',
                    idiom: 'ipad',
                    filename: 'icon-29@2x.png',
                    scale: '2x',
                },
                {
                    size: '40x40',
                    idiom: 'ipad',
                    filename: 'icon-40.png',
                    scale: '1x',
                },
                {
                    size: '40x40',
                    idiom: 'ipad',
                    filename: 'icon-40@2x.png',
                    scale: '2x',
                },
                {
                    size: '76x76',
                    idiom: 'ipad',
                    filename: 'icon-76.png',
                    scale: '1x',
                },
                {
                    size: '76x76',
                    idiom: 'ipad',
                    filename: 'icon-76@2x.png',
                    scale: '2x',
                },
                {
                    size: '83.5x83.5',
                    idiom: 'ipad',
                    filename: 'icon-83.5@2x.png',
                    scale: '2x',
                },
                {
                    size: '1024x1024',
                    idiom: 'ios-marketing',
                    filename: 'icon-1024.png',
                    scale: '1x',
                },
            ],
            info: { version: 1, author: 'Cutout' },
        },
        null,
        2,
    )}\n`;
}

export function buildFlutterYaml(): string {
    return `# Option A : utiliser les PNG générés tels quels.
# Option B : flutter_launcher_icons (pub.dev)
# flutter_launcher_icons:
#   android: true
#   ios: true
#   image_path: "assets/icon/icon.png"
#   web:
#     generate: true
#     image_path: "assets/icon/icon.png"
#
# Puis: dart run flutter_launcher_icons
`;
}

export function buildReadme(platform: PlatformSpec, options: GenerateOptions): string {
    return `Cutout — pack d’icônes pour ${platform.label}
App: ${options.appName}

Basé sur les conventions RealFaviconGenerator / Apple / Android / Flutter.

Installation
------------
1. Extrais ce ZIP à la racine de ton projet (ou copie les dossiers indiqués).
2. Suis html-head.html / README pour brancher les balises.
3. Vérifie sur https://realfavicongenerator.net/favicon_checker

Fichiers générés: ${platform.icons.length} images + fichiers de config.
Tout a été produit localement dans ton navigateur.
`;
}

export function buildTextAsset(
    kind: string,
    platform: PlatformSpec,
    options: GenerateOptions,
): string {
    switch (kind) {
        case 'html':
            return buildHtmlHead(platform.id);
        case 'webmanifest':
            return buildWebManifest(options, platform.id === 'pwa');
        case 'browserconfig':
            return buildBrowserConfig(options.themeColor);
        case 'contents-json':
            return buildIosContentsJson();
        case 'pubspec-hint':
            return buildFlutterYaml();
        case 'readme':
            return buildReadme(platform, options);
        default:
            return '';
    }
}
