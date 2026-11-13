"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = [
  // Work lives on the homepage index; case studies are under /work/*.
  { href: "/#work", label: "Work", activePrefix: "/work" },
  { href: "/about", label: "About", activePrefix: "/about" },
] as const;

const linkClass =
  "rounded-full px-2 py-1.5 text-small sm:px-3 text-muted transition-colors hover:text-fg aria-[current=page]:text-fg aria-[current=page]:bg-surface";

type LinksProps = {
  /** /resume.pdf when the file exists, otherwise the About page's experience section. */
  resumeHref: string;
};

export function NavLinks(props: LinksProps) {
  const pathname = usePathname();
  return <Links pathname={pathname} {...props} />;
}

/** Same links without active state, used as the Suspense fallback. */
export function NavLinksStatic(props: LinksProps) {
  return <Links pathname={null} {...props} />;
}

function Links({ pathname, resumeHref }: LinksProps & { pathname: string | null }) {
  return (
    <>
      {navItems.map((item) => {
        const active = pathname?.startsWith(item.activePrefix) ?? false;
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={linkClass}>
            {item.label}
          </Link>
        );
      })}
      {resumeHref.endsWith(".pdf") ? (
        // Plain <a>: a static file, not a route.
        <a href={resumeHref} className={linkClass}>
          Résumé
        </a>
      ) : (
        <Link href={resumeHref} className={linkClass}>
          Résumé
        </Link>
      )}
    </>
  );
}
