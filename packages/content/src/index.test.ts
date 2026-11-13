import { describe, expect, it } from "vitest";
import { experience, getProject, projects } from "./index";

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
