import type { Flow as FlowData } from "@portfolio/content";

export function Flow({ data }: { data: FlowData }) {
  const { lanes, steps } = data;

  const paths = steps.slice(1).map((step, i) => {
    const from = steps[i]!.lane + 0.5;
    const to = step.lane + 0.5;
    return `M ${i + 0.5} ${from} H ${i + 1} V ${to} H ${i + 1.5}`;
  });

  return (
    <figure className="flex flex-col gap-6">
      <ol
        className="relative flex flex-col gap-3 lg:grid lg:gap-x-3 lg:gap-y-0"
        style={{
          gridTemplateColumns: `7.5rem repeat(${steps.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${lanes.length}, minmax(8rem, 1fr))`,
        }}
      >
        {lanes.map((lane, index) => (
          <li
            key={lane}
            aria-hidden
            className="hidden items-center border-t border-line pr-3 font-mono text-label uppercase text-muted lg:flex"
            style={{ gridColumn: 1, gridRow: index + 1 }}
          >
            {lane}
          </li>
        ))}
        {lanes.map((lane, index) => (
          <li
            key={`band-${lane}`}
            aria-hidden
            className={`hidden border-t border-line lg:block ${index % 2 === 0 ? "bg-surface" : ""}`}
            style={{ gridColumn: "2 / -1", gridRow: index + 1 }}
          />
        ))}
        <li aria-hidden className="hidden lg:block" style={{ gridColumn: "2 / -1", gridRow: "1 / -1" }}>
          <svg
            className="h-full w-full text-accent"
            viewBox={`0 0 ${steps.length} ${lanes.length}`}
            preserveAspectRatio="none"
          >
            {paths.map((d) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </li>

        {steps.map((step, index) => (
          <li
            key={step.title}
            className="reveal-on-scroll relative flex flex-col gap-1 border border-line bg-bg p-3 lg:self-center lg:[grid-column:var(--col)] lg:[grid-row:var(--row)] lg:[--i:var(--step)]"
            style={
              {
                "--col": index + 2,
                "--row": step.lane + 1,
                "--step": index % 4,
              } as React.CSSProperties
            }
          >
            <p className="flex items-baseline gap-2 font-mono text-label uppercase text-muted">
              <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
              <span className="lg:sr-only">{lanes[step.lane]}</span>
            </p>
            <p className="text-small font-semibold">{step.title}</p>
            <p className="text-small leading-snug text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption className="max-w-prose text-small text-muted">{data.summary}</figcaption>
    </figure>
  );
}
