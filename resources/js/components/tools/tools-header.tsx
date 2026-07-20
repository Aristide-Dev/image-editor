import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TOOLS_NAV } from '@/data/tools-nav';
import { cn } from '@/lib/utils';

export function ToolsHeader() {
    const { url } = usePage();
    const pathname = url.split('?')[0] ?? '/';
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300',
                scrolled
                    ? 'border-b border-aristech-border bg-aristech-surface/85 shadow-md shadow-slate-900/5 backdrop-blur-xl'
                    : 'border-b border-transparent bg-transparent',
            )}
        >
            <nav
                className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
                aria-label="Navigation des outils"
            >
                <Link
                    href="/"
                    className="group flex shrink-0 cursor-pointer items-center gap-2 focus-visible:ring-2 focus-visible:ring-aristech-accent focus-visible:outline-none"
                >
                    <span className="font-heading text-xl font-bold tracking-tight text-aristech-heading transition-transform duration-300 group-hover:scale-[1.02] sm:text-2xl">
                        Cutout
                    </span>
                    <span className="rounded-md bg-aristech-accent/10 px-1.5 py-0.5 font-heading text-[10px] font-semibold tracking-widest text-aristech-accent uppercase">
                        ArisTech
                    </span>
                </Link>

                <ul className="hidden items-center gap-1 md:flex">
                    {TOOLS_NAV.map((tool) => {
                        const active = isActive(tool.href);
                        const Icon = tool.icon;

                        return (
                            <li key={tool.id}>
                                <Link
                                    href={tool.href}
                                    className={cn(
                                        'group relative inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                                        active
                                            ? 'bg-aristech-accent/10 text-aristech-heading'
                                            : 'text-aristech-muted hover:bg-aristech-surface hover:text-aristech-heading',
                                    )}
                                >
                                    <Icon className="size-4" aria-hidden />
                                    {tool.label}
                                    {active ? (
                                        <span
                                            className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-aristech-accent"
                                            aria-hidden
                                        />
                                    ) : null}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-aristech-border bg-aristech-surface p-2 text-aristech-heading transition-colors duration-200 hover:border-aristech-accent/40 md:hidden"
                    aria-expanded={mobileOpen}
                    aria-controls="tools-mobile-nav"
                    onClick={() => setMobileOpen((open) => !open)}
                >
                    <span className="sr-only">Menu</span>
                    {mobileOpen ? (
                        <X className="size-5" aria-hidden />
                    ) : (
                        <Menu className="size-5" aria-hidden />
                    )}
                </button>
            </nav>

            {mobileOpen ? (
                <div
                    id="tools-mobile-nav"
                    className="border-t border-aristech-border bg-aristech-surface/95 px-4 py-3 backdrop-blur-xl md:hidden"
                >
                    <ul className="space-y-1">
                        {TOOLS_NAV.map((tool) => {
                            const active = isActive(tool.href);
                            const Icon = tool.icon;

                            return (
                                <li key={tool.id}>
                                    <Link
                                        href={tool.href}
                                        className={cn(
                                            'flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-200',
                                            active
                                                ? 'bg-aristech-accent/10 text-aristech-heading'
                                                : 'text-aristech-muted hover:bg-aristech-bg hover:text-aristech-heading',
                                        )}
                                    >
                                        <Icon
                                            className="mt-0.5 size-4 shrink-0"
                                            aria-hidden
                                        />
                                        <span>
                                            <span className="block text-sm font-semibold">
                                                {tool.label}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-aristech-muted">
                                                {tool.description}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}
        </header>
    );
}
