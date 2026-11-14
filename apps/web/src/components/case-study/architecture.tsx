import type { Architecture as ArchitectureData } from "@portfolio/content";

/**
 * Tiers as columns joined by arrows: left to right on wide screens, top to
 * bottom on phones (every tier spans the full grid until lg). A plain grid
 * scales to any tier count without hand-drawn SVG paths.
 */
export function Architecture({ data }: { data: ArchitectureData }) {
  return (
    <figure className="flex flex-col gap-6">
      <ol
        className="grid gap-2 lg:gap-0"
        style={{ gridTemplateColumns: `repeat(${data.tiers.length}, minmax(0, 1fr))` }}
      >
        {data.tiers.map((tier, index) => (
          <li
            key={tier.label}
            className="col-span-full flex flex-col gap-2 reveal-on-scroll lg:col-span-1 lg:flex-row lg:[--i:var(--tier)]"
            style={{ "--tier": index } as React.CSSProperties}
          >
            <div className="flex flex-1 flex-col gap-2 border border-line bg-surface p-3">
              <p className="font-mono text-label uppercase text-muted">{tier.label}</p>
              <ul className="flex flex-col gap-2">
                {tier.nodes.map((node) => (
                  <li key={node.name} className="border border-line bg-bg p-3">
                    <p className="text-small font-semibold">{node.name}</p>
                    <p className="mt-1 text-small leading-snug text-muted">{node.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            {index < data.tiers.length - 1 && (
              <span aria-hidden className="flex items-center justify-center text-muted lg:w-7 lg:shrink-0">
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="max-w-prose text-small text-muted">{data.summary}</figcaption>
    </figure>
  );
}
