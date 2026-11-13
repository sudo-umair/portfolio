import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Suspense } from "react";
import { profile } from "@portfolio/content";
import { CommandPaletteTrigger } from "./command-palette/trigger";
import { NavLinks, NavLinksStatic } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

// Checked at build time: drop a PDF into public/ and the link switches to it.
const resumeHref = existsSync(path.join(process.cwd(), "public", "resume.pdf")) ? "/resume.pdf" : "/about#experience";

export function SiteHeader() {
  const [first = "", ...rest] = profile.name.split(" ");

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="page-gutter flex h-14 items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="shrink-0 whitespace-nowrap font-semiwide text-small font-bold uppercase tracking-wide" aria-label={`${profile.name}, home`}>
          {/* Full name from sm up, short form on narrow phones. */}
          <span className="hidden sm:inline">{profile.name}</span>
          <span className="sm:hidden">
            {first.charAt(0)}. {rest.join(" ")}
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
          {/* usePathname can suspend on routes with unknown params under Cache Components. */}
          <Suspense fallback={<NavLinksStatic resumeHref={resumeHref} />}>
            <NavLinks resumeHref={resumeHref} />
          </Suspense>
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-line sm:block" />
          <CommandPaletteTrigger />
          {/* Below 360px there's no room; the palette has the same theme actions. */}
          <div className="max-[359px]:hidden">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
