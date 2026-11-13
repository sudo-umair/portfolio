import Link from "next/link";
import { experience, profile } from "@portfolio/content";

const focusAreas = ["React", "Next.js", "React Native", "Node"];

export function Hero() {
  const current = experience.find((job) => !job.end);

  return (
    <section aria-labelledby="hero-title" className="page-gutter pt-14 pb-12 sm:pt-24 sm:pb-16">
      <p className="font-mono text-label uppercase text-muted">
        {profile.title} — {focusAreas.join(" · ")}
      </p>

      {/* One word per line: the name is the page's thesis in the Index layout. */}
      <h1 id="hero-title" className="mt-5 font-wide text-display uppercase">
        {profile.name.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h1>

      <div className="mt-10 grid gap-8 border-b-2 border-fg pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
        <div className="flex flex-col gap-8">
          <p className="max-w-[34ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug">{profile.headline}</p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-small font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              See the work
              <span aria-hidden>↓</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-fg px-5 py-3 text-small font-semibold transition-colors hover:bg-fg hover:text-bg"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-10 gap-y-5 text-small md:grid-cols-1">
          {current && (
            <Fact label="Currently">
              {current.title}
              <br />
              <span className="text-muted">at {current.org}</span>
            </Fact>
          )}
          <Fact label="Experience">{profile.yearsExperience}+ years shipping production apps</Fact>
          <Fact label="Based in">
            {profile.location}
            <br />
            <span className="text-muted">UTC+5</span>
          </Fact>
        </dl>
      </div>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-label uppercase text-muted">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
