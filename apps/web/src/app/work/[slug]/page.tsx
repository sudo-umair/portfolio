import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, platformLabels, projects } from "@portfolio/content";

// Every case study is prebuilt. Unknown slugs render at request time and 404.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    openGraph: { title: project.name, description: project.summary, url: `/work/${project.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length]!;
  const platforms = project.platforms.map((p) => platformLabels[p]).join(" · ");

  return (
    <main id="main" className="flex-1">
      <article>
        <header className="page-gutter pt-10 pb-12 sm:pt-14 sm:pb-16">
          <Link href="/#work" className="font-mono text-label uppercase text-muted transition-colors hover:text-fg">
            <span aria-hidden>← </span>All work
          </Link>

          <p className="mt-10 font-mono text-label uppercase text-muted">{platforms}</p>
          <h1 className="mt-3 font-wide text-h1 font-extrabold uppercase">{project.name}</h1>
          <p className="mt-6 max-w-[40ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug">{project.summary}</p>

          <dl className="mt-12 grid gap-x-10 gap-y-6 border-y-2 border-fg py-8 sm:grid-cols-2 lg:grid-cols-[auto_auto_minmax(0,1fr)]">
            <Meta label="Role">{project.role}</Meta>
            {project.client && <Meta label="Client">{project.client}</Meta>}
            <Meta label="Platforms">{platforms}</Meta>
            <Meta label="Stack" className="sm:col-span-full lg:col-span-1">
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="border border-line px-2 py-0.5 text-small">
                    {tech}
                  </li>
                ))}
              </ul>
            </Meta>
          </dl>
        </header>

        <section aria-labelledby="highlights-title" className="page-gutter pb-20">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
            <h2 id="highlights-title" className="font-semiwide text-h2 font-bold uppercase">
              What I built
            </h2>
            <ul className="flex flex-col divide-y divide-line border-t border-line">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="py-4 text-body">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>

      <nav aria-label="Next project" className="border-t border-line">
        <Link
          href={`/work/${next.slug}`}
          className="page-gutter group flex items-baseline justify-between gap-6 py-10 transition-colors hover:text-accent"
        >
          <span className="flex flex-col gap-1">
            <span className="font-mono text-label uppercase text-muted">Next project</span>
            <span className="font-semiwide text-h2 font-bold uppercase">{next.name}</span>
          </span>
          <span aria-hidden className="text-h2 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </nav>
    </main>
  );
}

function Meta({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <dt className="font-mono text-label uppercase text-muted">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
