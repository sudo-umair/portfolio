import {
  education,
  experience,
  platformLabels,
  profile,
  projects,
  skillAreaLabels,
  type Project,
  type SkillArea,
} from "@portfolio/content";
import { siteUrl } from "./site";

/** Bump when a response shape changes in a breaking way. */
export const API_VERSION = "1";

const absolute = (path: string) => new URL(path, siteUrl).toString();

/** Public, read-only data: CORS open, cacheable by browsers and CDNs. */
export function jsonResponse(data: unknown, init: { status?: number } = {}) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "X-API-Version": API_VERSION,
    },
  });
}

export function projectSummary(project: Project) {
  return {
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    summary: project.summary,
    role: project.role,
    platforms: project.platforms.map((p) => platformLabels[p]),
    stack: project.stack,
    url: absolute(`/work/${project.slug}`),
    api: absolute(`/api/projects/${project.slug}`),
  };
}

export function projectDetail(project: Project) {
  return {
    ...projectSummary(project),
    client: project.client ?? null,
    highlights: project.highlights,
    architecture: project.architecture ?? null,
    decisions: project.decisions,
    links: project.links,
  };
}

export function projectList() {
  return { data: projects.map(projectSummary), count: projects.length };
}

/** Résumé in the JSON Resume schema (https://jsonresume.org/schema), so existing themes and tools can read it. */
export function jsonResume() {
  const [city = profile.location] = profile.location.split(",");

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: profile.name,
      label: profile.title,
      summary: profile.bio,
      url: siteUrl.toString(),
      location: { city: city.trim(), countryCode: profile.countryCode },
      profiles: profile.links.map((link) => ({
        network: link.label,
        username: new URL(link.href).pathname.split("/").filter(Boolean).at(-1) ?? "",
        url: link.href,
      })),
    },
    work: experience.map((job) => ({
      name: job.org,
      position: job.title,
      location: job.location,
      startDate: job.start,
      ...(job.end ? { endDate: job.end } : {}),
      highlights: job.highlights,
    })),
    education: education.map((school) => ({
      institution: school.institution,
      area: school.area,
      studyType: school.studyType,
      startDate: school.start,
      ...(school.end ? { endDate: school.end } : {}),
    })),
    skills: Object.entries(profile.skills).map(([area, keywords]) => ({
      name: skillAreaLabels[area as SkillArea],
      keywords,
    })),
    projects: projects.map((project) => ({
      name: project.name,
      description: project.summary,
      highlights: project.highlights,
      keywords: project.stack,
      roles: [project.role],
      url: absolute(`/work/${project.slug}`),
    })),
    meta: {
      canonical: absolute("/api/resume.json"),
      version: `v${API_VERSION}`,
    },
  };
}
