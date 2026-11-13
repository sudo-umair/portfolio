import { z } from "zod";
import { experienceData, profileData, projectsData } from "./data";
import { experienceSchema, profileSchema, projectSchema } from "./schema";

export * from "./schema";

// Parsing at import time means invalid content fails the build, not the page.
export const profile = profileSchema.parse(profileData);

export const projects = z
  .array(projectSchema)
  .parse(projectsData)
  .toSorted((a, b) => a.order - b.order);

export const experience = z.array(experienceSchema).parse(experienceData);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const platformLabels = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  "android-tv": "Android TV",
  api: "API",
} as const satisfies Record<z.infer<typeof projectSchema>["platforms"][number], string>;
