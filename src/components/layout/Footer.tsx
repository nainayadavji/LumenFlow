/**
 * App footer with helpful Testnet resources.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:text-left">
        <p>Built on the Stellar Testnet · For learning purposes only.</p>
        <nav className="flex items-center gap-4">
          <a
            href="https://friendbot.stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brand-300"
          >
            Friendbot
          </a>
          <a
            href="https://developers.stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brand-300"
          >
            Docs
          </a>
          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brand-300"
          >
            Explorer
          </a>
        </nav>
      </div>
    </footer>
  );
}
