import { z } from "zod";
import { educationData, experienceData, profileData, projectsData } from "./data";
import { educationSchema, experienceSchema, profileSchema, projectSchema, type Device, type Project } from "./schema";

export * from "./schema";

// Parsing at import time means invalid content fails the build, not the page.
export const profile = profileSchema.parse(profileData);

export const projects = z
  .array(projectSchema)
  .parse(projectsData)
  .toSorted((a, b) => a.order - b.order);

export const experience = z.array(experienceSchema).parse(experienceData);

export const education = z.array(educationSchema).parse(educationData);

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

/** Device frames a project needs, most distinctive first (TV, then phone, then browser). */
export function projectDevices(project: Project): Device[] {
  const { platforms } = project;
  const devices: Device[] = [];
  if (platforms.includes("android-tv")) devices.push("tv");
  if (platforms.includes("ios") || platforms.includes("android")) devices.push("phone");
  if (platforms.includes("web")) devices.push("browser");
  return devices.length > 0 ? devices : ["browser"];
}
