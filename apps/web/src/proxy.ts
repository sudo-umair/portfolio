import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@portfolio/content";

const knownSlugs = new Set(projects.map((project) => project.slug));

/**
 * Real 404 status for unknown case studies.
 *
 * With Cache Components the /work/[slug] fallback shell starts streaming
 * (status 200) before the page can call notFound(), so the first request
 * for an unknown slug would be a soft 404. Checking the static slug list
 * here, before rendering, lets the not-found page go out with a 404.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && knownSlugs.has(slug)) return NextResponse.next();

  // An unmatched path renders app/not-found.tsx before streaming, so it keeps
  // the 404 status. The browser URL stays the same.
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: "/work/:slug",
};
