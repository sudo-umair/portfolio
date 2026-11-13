import { projects } from "@portfolio/content";
import { ProjectIndex } from "./project-index";

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="page-gutter pb-24">
      <div className="flex items-baseline justify-between gap-4 pb-6">
        <h2 id="work-title" className="font-semiwide text-h2 font-bold uppercase">
          Selected work
        </h2>
        <p className="shrink-0 font-mono text-label whitespace-nowrap text-muted uppercase">{projects.length} projects</p>
      </div>
      <ProjectIndex projects={projects} />
    </section>
  );
}
