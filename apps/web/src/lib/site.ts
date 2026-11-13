import { profile } from "@portfolio/content";

/**
 * Placeholder domain until the real one is bought.
 * Override with NEXT_PUBLIC_SITE_URL in Vercel (or .env.local).
 */
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://umair.example.dev");

export const site = {
  name: profile.name,
  title: `${profile.name} · ${profile.title}`,
  description: `${profile.title} with ${profile.yearsExperience}+ years shipping web, mobile and Android TV apps in React, Next.js, React Native and Node.${profile.openToWork ? " Open to full-time roles." : ""}`,
  url: siteUrl,
} as const;
