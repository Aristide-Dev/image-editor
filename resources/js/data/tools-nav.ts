import { AppWindow, Eraser, type LucideIcon } from 'lucide-react';

export type ToolNavItem = {
    id: string;
    href: string;
    label: string;
    description: string;
    icon: LucideIcon;
    available: boolean;
};

export const TOOLS_NAV: ToolNavItem[] = [
    {
        id: 'background-remover',
        href: '/',
        label: 'Background remover',
        description: 'Retirer le fond d’une image',
        icon: Eraser,
        available: true,
    },
    {
        id: 'icon-generator',
        href: '/outils/icon-generator',
        label: 'Générateur d’icônes',
        description: 'Icônes pour site ou app',
        icon: AppWindow,
        available: true,
    },
];
