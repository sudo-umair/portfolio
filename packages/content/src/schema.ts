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

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  /** One line shown in the homepage index. */
  tagline: z.string(),
  /** Short paragraph for previews, OG images and the API. */
  summary: z.string(),
  /** Decides the case-study variant: device frames vs. architecture diagram. */
  variant: z.enum(["mobile", "web"]),
  platforms: z.array(platformSchema).min(1),
  client: z.string().optional(),
  role: z.string(),
  stack: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  links: z.array(linkSchema).default([]),
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
