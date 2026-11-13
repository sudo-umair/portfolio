import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page-gutter flex flex-1 flex-col justify-center gap-6 py-24">
      <p className="font-mono text-label uppercase text-muted">Error 404</p>
      <h1 className="font-wide text-h1 font-extrabold uppercase">Page not found</h1>
      <p className="max-w-[40ch] text-muted">This page doesn&apos;t exist, or it moved. The work is all on the homepage.</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-small font-semibold text-accent-fg transition-opacity hover:opacity-90"
        >
          See the work
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-fg px-5 py-3 text-small font-semibold transition-colors hover:bg-fg hover:text-bg"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
