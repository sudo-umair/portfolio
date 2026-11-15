import { describe, expect, it } from "vitest";
import { experience, projects } from "@portfolio/content";
import { jsonResponse, jsonResume, projectDetail, projectList } from "./api";

const YEAR_MONTH = /^\d{4}-\d{2}$/;

describe("projectList", () => {
  it("lists every project with absolute page and API URLs", () => {
    const { data, count } = projectList();
    expect(count).toBe(projects.length);
    for (const item of data) {
      expect(item.url).toMatch(new RegExp(`^https?://[^/]+/work/${item.slug}$`));
      expect(item.api).toMatch(new RegExp(`/api/projects/${item.slug}$`));
    }
  });

  it("uses readable platform labels", () => {
    expect(projectList().data.flatMap((p) => p.platforms)).not.toContain("android-tv");
  });
});

describe("projectDetail", () => {
  it("uses null rather than undefined for optional fields, so they survive JSON", () => {
    const withoutClient = { ...projects[0]!, client: undefined };
    const detail = projectDetail(withoutClient);
    expect(detail.client).toBeNull();
    expect(JSON.parse(JSON.stringify(detail))).toHaveProperty("client", null);
  });
});

describe("jsonResume", () => {
  const resume = jsonResume();

  it("has the JSON Resume top-level sections", () => {
    expect(Object.keys(resume)).toEqual(
      expect.arrayContaining(["basics", "work", "education", "skills", "projects", "meta"]),
    );
  });

  it("uses YYYY-MM dates and omits endDate for current roles", () => {
    for (const job of resume.work) {
      expect(job.startDate).toMatch(YEAR_MONTH);
      if ("endDate" in job) expect(job.endDate).toMatch(YEAR_MONTH);
    }
    const current = experience.filter((job) => !job.end).length;
    expect(resume.work.filter((job) => !("endDate" in job))).toHaveLength(current);
  });

  it("derives profile usernames from URLs", () => {
    const github = resume.basics.profiles.find((p) => p.network === "GitHub");
    expect(github?.username).toBe("sudo-umair");
  });

  it("splits the city out of the location", () => {
    expect(resume.basics.location).toEqual({ city: "Rawalpindi", countryCode: "PK" });
  });
});

describe("jsonResponse", () => {
  it("sets CORS, caching and version headers", async () => {
    const response = jsonResponse({ ok: true }, { status: 404 });
    expect(response.status).toBe(404);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toContain("s-maxage");
    expect(response.headers.get("x-api-version")).toBe("1");
    expect(await response.json()).toEqual({ ok: true });
  });
});
