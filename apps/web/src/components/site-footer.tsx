import Link from "next/link";
import { profile } from "@portfolio/content";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="page-gutter flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          {profile.openToWork && (
            <p className="flex items-center gap-2 text-small font-medium">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Open to full-time roles
            </p>
          )}
          <p className="font-mono text-label uppercase text-muted">
            {profile.location} · UTC+5
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-small">
          <li>
            <Link href="/contact" className="font-medium underline underline-offset-4 transition-colors hover:text-accent">
              Get in touch
            </Link>
          </li>
          {profile.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="/api"
              className="font-mono text-label uppercase text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
            >
              API
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
