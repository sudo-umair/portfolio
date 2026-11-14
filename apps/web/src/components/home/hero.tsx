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
      {/*
       * Each word rises from behind its own line's bottom edge. Clipping with
       * clip-path (not overflow) leaves room above and to the sides for the
       * tight 0.86 line height.
       */}
      <h1 id="hero-title" className="mt-5 font-wide text-display uppercase">
        {profile.name.split(" ").map((word, index) => (
          <span key={word} className="block [clip-path:inset(-0.25em_-0.25em_0_-0.25em)]">
            <span className="block motion-safe:animate-hero-rise" style={{ animationDelay: `${index * 90}ms` }}>
              {word}
            </span>
          </span>
        ))}
      </h1>

      <div className="mt-10 grid gap-8 border-b-2 border-fg pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
        <div className="flex flex-col gap-8 motion-safe:animate-hero-fade motion-safe:[animation-delay:300ms]">
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

        <dl className="grid grid-cols-2 gap-x-10 gap-y-5 text-small motion-safe:animate-hero-fade motion-safe:[animation-delay:400ms] md:grid-cols-1">
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
