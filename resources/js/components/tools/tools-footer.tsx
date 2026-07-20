export function ToolsFooter() {
    return (
        <footer className="mt-auto border-t border-aristech-border/80 bg-aristech-surface-elevated/60">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-aristech-muted sm:flex-row sm:px-6 sm:text-left lg:px-8">
                <p>
                    <span className="font-heading font-semibold text-aristech-heading">
                        Cutout
                    </span>{' '}
                    · outils image ArisTech · traitement local
                </p>
                <p>Aucune base de données · aucun upload serveur</p>
            </div>
        </footer>
    );
}
