import { profile } from "@portfolio/content";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = `${profile.name}, ${profile.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: `${profile.title} — React · Next.js · React Native · Node`,
    title: profile.name,
    description: profile.headline,
  });
}
