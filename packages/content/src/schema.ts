import { z } from "zod";

export const platformSchema = z.enum(["web", "ios", "android", "android-tv", "api"]);

export const skillAreaSchema = z.enum([
  "languages",
  "frontend",
  "mobile",
  "backend",
  "databases",
  "cloud",
  "ui",
  "testing",
  "devops",
]);

export const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
});

/**
 * System diagram as left-to-right tiers (clients → services → data →
 * third parties). Simple on purpose: it renders as columns, not a graph.
 */
export const architectureSchema = z.object({
  summary: z.string(),
  tiers: z
    .array(
      z.object({
        label: z.string(),
        nodes: z.array(z.object({ name: z.string(), detail: z.string() })).min(1),
      }),
    )
    .min(2),
});

/** An engineering decision told as problem → solution. */
export const decisionSchema = z.object({
  title: z.string(),
  problem: z.string(),
  solution: z.string(),
});

/** Screenshot or recording shown in a device frame. Files live in apps/web/public. */
export const mediaSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string(),
  device: z.enum(["phone", "tv", "browser"]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  /** One line shown in the homepage index. */
  tagline: z.string(),
  /** Short paragraph for previews, OG images and the API. */
  summary: z.string(),
  /** Also decides which device frames a case study uses. */
  platforms: z.array(platformSchema).min(1),
  client: z.string().optional(),
  role: z.string(),
  stack: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  links: z.array(linkSchema).default([]),
  architecture: architectureSchema.optional(),
  decisions: z.array(decisionSchema).default([]),
  media: z.array(mediaSchema).default([]),
  featured: z.boolean().default(false),
  /** Lower comes first. */
  order: z.number().int(),
});

export const experienceSchema = z.object({
  title: z.string(),
  org: z.string(),
  location: z.string(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  /** Omitted means "present". */
  end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  highlights: z.array(z.string()).min(1),
  projects: z.array(z.string()).default([]),
});

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  headline: z.string(),
  bio: z.string(),
  location: z.string(),
  timezone: z.string(),
  yearsExperience: z.number().int().positive(),
  openToWork: z.boolean(),
  links: z.array(linkSchema),
  skills: z.record(skillAreaSchema, z.array(z.string())),
});

export type Platform = z.infer<typeof platformSchema>;
export type SkillArea = z.infer<typeof skillAreaSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Architecture = z.infer<typeof architectureSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Device = Media["device"];
