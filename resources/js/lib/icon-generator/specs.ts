/**
 * Normes d’icônes (réf. RealFaviconGenerator / Apple / Android / Flutter).
 * Toutes les dimensions sont en pixels. Nommage = conventions officielles.
 */

export type IconFormat = 'png' | 'ico' | 'svg' | 'json' | 'xml' | 'webmanifest' | 'txt';

export type IconAssetSpec = {
    /** Chemin relatif dans le ZIP */
    path: string;
    width: number;
    height: number;
    format: 'png' | 'ico' | 'svg';
    /** Remplir le fond (ex. Apple Touch opaque) */
    background?: string | null;
    /** Padding ratio 0–0.5 (safe zone Android adaptive / iOS) */
    padding?: number;
    label: string;
};

export type TextAssetSpec = {
    path: string;
    format: Exclude<IconFormat, 'png' | 'ico' | 'svg'>;
    /** Clé pour générer le contenu dynamiquement */
    kind: 'html' | 'webmanifest' | 'browserconfig' | 'contents-json' | 'readme' | 'pubspec-hint';
};

export type PlatformId =
    | 'web'
    | 'react'
    | 'nextjs'
    | 'vue'
    | 'flutter'
    | 'android'
    | 'ios'
    | 'pwa';

export type PlatformSpec = {
    id: PlatformId;
    label: string;
    description: string;
    icons: IconAssetSpec[];
    texts: TextAssetSpec[];
};

const webIcons: IconAssetSpec[] = [
    {
        path: 'favicon.svg',
        width: 32,
        height: 32,
        format: 'svg',
        label: 'Favicon SVG',
    },
    {
        path: 'favicon-16x16.png',
        width: 16,
        height: 16,
        format: 'png',
        label: 'Favicon 16',
    },
    {
        path: 'favicon-32x32.png',
        width: 32,
        height: 32,
        format: 'png',
        label: 'Favicon 32',
    },
    {
        path: 'favicon.ico',
        width: 32,
        height: 32,
        format: 'ico',
        label: 'favicon.ico (16+32)',
    },
    {
        path: 'apple-touch-icon.png',
        width: 180,
        height: 180,
        format: 'png',
        background: '#ffffff',
        label: 'Apple Touch Icon',
    },
    {
        path: 'android-chrome-192x192.png',
        width: 192,
        height: 192,
        format: 'png',
        label: 'Android Chrome 192',
    },
    {
        path: 'android-chrome-512x512.png',
        width: 512,
        height: 512,
        format: 'png',
        label: 'Android Chrome 512',
    },
];

const androidMipmap: IconAssetSpec[] = [
    {
        path: 'res/mipmap-mdpi/ic_launcher.png',
        width: 48,
        height: 48,
        format: 'png',
        label: 'mdpi 48',
    },
    {
        path: 'res/mipmap-hdpi/ic_launcher.png',
        width: 72,
        height: 72,
        format: 'png',
        label: 'hdpi 72',
    },
    {
        path: 'res/mipmap-xhdpi/ic_launcher.png',
        width: 96,
        height: 96,
        format: 'png',
        label: 'xhdpi 96',
    },
    {
        path: 'res/mipmap-xxhdpi/ic_launcher.png',
        width: 144,
        height: 144,
        format: 'png',
        label: 'xxhdpi 144',
    },
    {
        path: 'res/mipmap-xxxhdpi/ic_launcher.png',
        width: 192,
        height: 192,
        format: 'png',
        label: 'xxxhdpi 192',
    },
    {
        path: 'res/mipmap-xxxhdpi/ic_launcher_playstore.png',
        width: 512,
        height: 512,
        format: 'png',
        label: 'Play Store 512',
    },
];

/** iOS AppIcon.appiconset — tailles courantes Xcode */
const iosIcons: IconAssetSpec[] = [
    {
        path: 'AppIcon.appiconset/icon-20.png',
        width: 20,
        height: 20,
        format: 'png',
        label: '20pt',
    },
    {
        path: 'AppIcon.appiconset/icon-20@2x.png',
        width: 40,
        height: 40,
        format: 'png',
        label: '20pt @2x',
    },
    {
        path: 'AppIcon.appiconset/icon-20@3x.png',
        width: 60,
        height: 60,
        format: 'png',
        label: '20pt @3x',
    },
    {
        path: 'AppIcon.appiconset/icon-29.png',
        width: 29,
        height: 29,
        format: 'png',
        label: '29pt',
    },
    {
        path: 'AppIcon.appiconset/icon-29@2x.png',
        width: 58,
        height: 58,
        format: 'png',
        label: '29pt @2x',
    },
    {
        path: 'AppIcon.appiconset/icon-29@3x.png',
        width: 87,
        height: 87,
        format: 'png',
        label: '29pt @3x',
    },
    {
        path: 'AppIcon.appiconset/icon-40.png',
        width: 40,
        height: 40,
        format: 'png',
        label: '40pt',
    },
    {
        path: 'AppIcon.appiconset/icon-40@2x.png',
        width: 80,
        height: 80,
        format: 'png',
        label: '40pt @2x',
    },
    {
        path: 'AppIcon.appiconset/icon-40@3x.png',
        width: 120,
        height: 120,
        format: 'png',
        label: '40pt @3x',
    },
    {
        path: 'AppIcon.appiconset/icon-60@2x.png',
        width: 120,
        height: 120,
        format: 'png',
        label: '60pt @2x',
    },
    {
        path: 'AppIcon.appiconset/icon-60@3x.png',
        width: 180,
        height: 180,
        format: 'png',
        label: '60pt @3x',
    },
    {
        path: 'AppIcon.appiconset/icon-76.png',
        width: 76,
        height: 76,
        format: 'png',
        label: '76pt iPad',
    },
    {
        path: 'AppIcon.appiconset/icon-76@2x.png',
        width: 152,
        height: 152,
        format: 'png',
        label: '76pt @2x',
    },
    {
        path: 'AppIcon.appiconset/icon-83.5@2x.png',
        width: 167,
        height: 167,
        format: 'png',
        label: '83.5pt @2x',
    },
    {
        path: 'AppIcon.appiconset/icon-1024.png',
        width: 1024,
        height: 1024,
        format: 'png',
        background: '#ffffff',
        label: 'App Store 1024',
    },
];

const flutterIcons: IconAssetSpec[] = [
    {
        path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
        width: 48,
        height: 48,
        format: 'png',
        label: 'Android mdpi',
    },
    {
        path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
        width: 72,
        height: 72,
        format: 'png',
        label: 'Android hdpi',
    },
    {
        path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
        width: 96,
        height: 96,
        format: 'png',
        label: 'Android xhdpi',
    },
    {
        path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
        width: 144,
        height: 144,
        format: 'png',
        label: 'Android xxhdpi',
    },
    {
        path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
        width: 192,
        height: 192,
        format: 'png',
        label: 'Android xxxhdpi',
    },
    {
        path: 'ios/Runner/Assets.xcassets/AppIcon.appiconset/icon-1024.png',
        width: 1024,
        height: 1024,
        format: 'png',
        background: '#ffffff',
        label: 'iOS 1024',
    },
    {
        path: 'ios/Runner/Assets.xcassets/AppIcon.appiconset/icon-180.png',
        width: 180,
        height: 180,
        format: 'png',
        label: 'iOS 180',
    },
    {
        path: 'ios/Runner/Assets.xcassets/AppIcon.appiconset/icon-120.png',
        width: 120,
        height: 120,
        format: 'png',
        label: 'iOS 120',
    },
    {
        path: 'web/favicon.svg',
        width: 32,
        height: 32,
        format: 'svg',
        label: 'Web favicon SVG',
    },
    {
        path: 'web/favicon.png',
        width: 32,
        height: 32,
        format: 'png',
        label: 'Web favicon',
    },
    {
        path: 'web/icons/Icon-192.png',
        width: 192,
        height: 192,
        format: 'png',
        label: 'Web PWA 192',
    },
    {
        path: 'web/icons/Icon-512.png',
        width: 512,
        height: 512,
        format: 'png',
        label: 'Web PWA 512',
    },
];

function withPublicPrefix(icons: IconAssetSpec[], prefix: string): IconAssetSpec[] {
    return icons.map((icon) => ({
        ...icon,
        path: `${prefix}${icon.path}`,
    }));
}

export const PLATFORM_SPECS: Record<PlatformId, PlatformSpec> = {
    web: {
        id: 'web',
        label: 'Web (HTML)',
        description: 'Favicons + Apple Touch + Chrome, HTML à coller dans <head>',
        icons: webIcons,
        texts: [
            { path: 'site.webmanifest', format: 'webmanifest', kind: 'webmanifest' },
            { path: 'browserconfig.xml', format: 'xml', kind: 'browserconfig' },
            { path: 'html-head.html', format: 'txt', kind: 'html' },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
    react: {
        id: 'react',
        label: 'React (Vite / CRA)',
        description: 'Fichiers dans public/ + balises pour index.html',
        icons: withPublicPrefix(webIcons, 'public/'),
        texts: [
            {
                path: 'public/site.webmanifest',
                format: 'webmanifest',
                kind: 'webmanifest',
            },
            { path: 'html-head.html', format: 'txt', kind: 'html' },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
    nextjs: {
        id: 'nextjs',
        label: 'Next.js',
        description: 'Convention app/ (icon.png, apple-icon.png) + favicon.ico',
        icons: [
            {
                path: 'app/icon.svg',
                width: 32,
                height: 32,
                format: 'svg',
                label: 'app/icon.svg',
            },
            {
                path: 'app/favicon.ico',
                width: 32,
                height: 32,
                format: 'ico',
                label: 'app/favicon.ico',
            },
            {
                path: 'app/icon.png',
                width: 32,
                height: 32,
                format: 'png',
                label: 'app/icon.png',
            },
            {
                path: 'app/apple-icon.png',
                width: 180,
                height: 180,
                format: 'png',
                background: '#ffffff',
                label: 'app/apple-icon.png',
            },
            {
                path: 'public/favicon.svg',
                width: 32,
                height: 32,
                format: 'svg',
                label: 'public/favicon.svg',
            },
            {
                path: 'public/android-chrome-192x192.png',
                width: 192,
                height: 192,
                format: 'png',
                label: 'PWA 192',
            },
            {
                path: 'public/android-chrome-512x512.png',
                width: 512,
                height: 512,
                format: 'png',
                label: 'PWA 512',
            },
        ],
        texts: [
            {
                path: 'public/site.webmanifest',
                format: 'webmanifest',
                kind: 'webmanifest',
            },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
    vue: {
        id: 'vue',
        label: 'Vue / Nuxt',
        description: 'public/ + index.html / nuxt.config',
        icons: withPublicPrefix(webIcons, 'public/'),
        texts: [
            {
                path: 'public/site.webmanifest',
                format: 'webmanifest',
                kind: 'webmanifest',
            },
            { path: 'html-head.html', format: 'txt', kind: 'html' },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
    pwa: {
        id: 'pwa',
        label: 'PWA',
        description: 'Maskable + standard 192/512 + manifest',
        icons: [
            {
                path: 'favicon.svg',
                width: 32,
                height: 32,
                format: 'svg',
                label: 'Favicon SVG',
            },
            {
                path: 'icons/icon-192.png',
                width: 192,
                height: 192,
                format: 'png',
                label: '192 any',
            },
            {
                path: 'icons/icon-512.png',
                width: 512,
                height: 512,
                format: 'png',
                label: '512 any',
            },
            {
                path: 'icons/maskable-192.png',
                width: 192,
                height: 192,
                format: 'png',
                padding: 0.1,
                background: '#ffffff',
                label: '192 maskable',
            },
            {
                path: 'icons/maskable-512.png',
                width: 512,
                height: 512,
                format: 'png',
                padding: 0.1,
                background: '#ffffff',
                label: '512 maskable',
            },
            {
                path: 'favicon.ico',
                width: 32,
                height: 32,
                format: 'ico',
                label: 'favicon.ico',
            },
        ],
        texts: [
            { path: 'site.webmanifest', format: 'webmanifest', kind: 'webmanifest' },
            { path: 'html-head.html', format: 'txt', kind: 'html' },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
    android: {
        id: 'android',
        label: 'Android',
        description: 'mipmap mdpi→xxxhdpi + icône Play Store 512',
        icons: androidMipmap,
        texts: [{ path: 'README.txt', format: 'txt', kind: 'readme' }],
    },
    ios: {
        id: 'ios',
        label: 'iOS (Xcode)',
        description: 'AppIcon.appiconset + Contents.json',
        icons: iosIcons,
        texts: [
            {
                path: 'AppIcon.appiconset/Contents.json',
                format: 'json',
                kind: 'contents-json',
            },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
    flutter: {
        id: 'flutter',
        label: 'Flutter',
        description: 'Chemins Android + iOS + web (flutter_launcher_icons)',
        icons: flutterIcons,
        texts: [
            { path: 'flutter_launcher_icons.yaml', format: 'txt', kind: 'pubspec-hint' },
            { path: 'README.txt', format: 'txt', kind: 'readme' },
        ],
    },
};

export const PLATFORM_LIST = Object.values(PLATFORM_SPECS);

export type GenerateOptions = {
    appName: string;
    themeColor: string;
    backgroundColor: string;
};
