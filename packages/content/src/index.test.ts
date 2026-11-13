import { describe, expect, it } from "vitest";
import { experience, getProject, projectDevices, projects } from "./index";

describe("content", () => {
  it("has unique project slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("sorts projects by order", () => {
    const orders = projects.map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("only links experience to projects that exist", () => {
    for (const job of experience) {
      for (const slug of job.projects) {
        expect(getProject(slug), `${job.title} → ${slug}`).toBeDefined();
      }
    }
  });
});

describe("projectDevices", () => {
  const base = projects[0]!;
  it("puts TV first, then phone, then browser", () => {
    expect(projectDevices({ ...base, platforms: ["web", "android", "android-tv"] })).toEqual(["tv", "phone", "browser"]);
  });
  it("falls back to browser for API-only projects", () => {
    expect(projectDevices({ ...base, platforms: ["api"] })).toEqual(["browser"]);
  });
});
