import type { Metadata } from "next";
import { site } from "@/lib/site";

// Next replaces nested metadata objects instead of merging them.
export const baseOpenGraph = {
  type: "website",
  siteName: site.name,
  locale: "en_US",
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

// Canonical is per page: in the root layout every page would inherit "/".
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title: `${title} · ${site.name}`, description, url: path },
  };
}
