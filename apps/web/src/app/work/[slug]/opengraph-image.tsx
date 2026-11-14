import { getProject, platformLabels, profile, projects } from "@portfolio/content";
import { notFound } from "next/navigation";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = `${profile.name}, case study`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderOgImage({
    eyebrow: `Case study · ${project.platforms.map((p) => platformLabels[p]).join(" · ")}`,
    title: project.name,
    description: project.tagline,
    cta: { label: "Read case study", path: `/work/${project.slug}` },
  });
}
