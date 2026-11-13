import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Open Graph fields every page shares. Next.js replaces nested metadata
 * objects instead of merging them, so each page spreads this in.
 */
export const baseOpenGraph = {
  type: "website",
  siteName: site.name,
  locale: "en_US",
} as const;

type PageMetadataInput = {
  /** Page title; the root layout's template adds " · Muhammad Umair". */
  title: string;
  description: string;
  /** Path of the page, used for the canonical URL and og:url. */
  path: string;
};

/**
 * Title, description, canonical URL and Open Graph tags for one page.
 * The canonical URL is set per page on purpose: set in the root layout, every
 * page would inherit "/" and tell search engines it's a copy of the homepage.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title: `${title} · ${site.name}`, description, url: path },
  };
}
