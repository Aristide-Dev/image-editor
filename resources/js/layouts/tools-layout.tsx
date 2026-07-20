import { useEffect, type ReactNode } from 'react';
import { ToolsFooter } from '@/components/tools/tools-footer';
import { ToolsHeader } from '@/components/tools/tools-header';

export default function ToolsLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        document.documentElement.lang = 'fr';
        document.documentElement.classList.add('tools-page');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        document.documentElement.style.backgroundColor = '#dce3ec';

        return () => {
            document.documentElement.classList.remove('tools-page');
            document.documentElement.style.colorScheme = '';
            document.documentElement.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className="tools-site relative flex min-h-screen flex-col overflow-x-hidden">
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
            >
                <div className="tools-grid-bg absolute inset-0 opacity-70" />
                <div className="tools-blob -top-24 left-1/4 size-[28rem] bg-aristech-accent/30" />
                <div className="tools-blob top-40 right-0 size-[22rem] bg-sky-400/25" />
            </div>

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-aristech-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                Aller au contenu
            </a>

            <ToolsHeader />

            <main id="main-content" className="relative z-10 flex-1">
                {children}
            </main>

            <ToolsFooter />
        </div>
    );
}
