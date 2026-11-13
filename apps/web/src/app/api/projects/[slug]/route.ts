import { getProject, projects } from "@portfolio/content";
import { jsonResponse, projectDetail } from "@/lib/api";

// Prerendered for every project; unknown slugs run at request time and 404.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/api/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return jsonResponse({ error: { code: "not_found", message: `No project "${slug}".` } }, { status: 404 });
  return jsonResponse(projectDetail(project));
}
