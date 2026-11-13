import type { Decision } from "@portfolio/content";

export function Decisions({ decisions }: { decisions: Decision[] }) {
  return (
    <div className="flex flex-col border-t border-line">
      {decisions.map((decision) => (
        <article
          key={decision.title}
          className="grid gap-4 border-b border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-10"
        >
          <h3 className="font-semiwide text-h3 font-bold">{decision.title}</h3>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase text-muted">Problem</p>
            <p className="text-small leading-relaxed">{decision.problem}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase text-accent">Solution</p>
            <p className="text-small leading-relaxed">{decision.solution}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
