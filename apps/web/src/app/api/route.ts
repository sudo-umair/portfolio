import { API_VERSION, jsonResponse } from "@/lib/api";
import { siteUrl } from "@/lib/site";

/** Index of the public API. */
export function GET() {
  const url = (path: string) => new URL(path, siteUrl).toString();
  return jsonResponse({
    version: API_VERSION,
    endpoints: {
      projects: url("/api/projects"),
      // Appended, not passed to URL(), which would percent-encode the braces.
      project: `${url("/api/projects")}/{slug}`,
      resume: url("/api/resume.json"),
    },
  });
}
