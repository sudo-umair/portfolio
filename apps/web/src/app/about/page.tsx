import type { Metadata } from "next";
import Link from "next/link";
import { education, experience, getProject, profile, skillAreaLabels, type SkillArea } from "@portfolio/content";
import { formatRange } from "@/lib/dates";

export const metadata: Metadata = {
  title: "About",
  description: profile.bio,
};

export default function AboutPage() {
  const current = experience.find((job) => !job.end);

  return (
    <main id="main" className="flex-1">
      <header className="page-gutter pt-10 pb-12 sm:pt-14 sm:pb-16">
        <p className="font-mono text-label uppercase text-muted">About</p>
        <h1 className="mt-3 font-wide text-h1 font-extrabold uppercase">{profile.name}</h1>

        <div className="mt-10 grid gap-10 border-t-2 border-fg pt-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
          <p className="max-w-[46ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug">{profile.bio}</p>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-small md:grid-cols-1">
            {current && <Fact label="Currently">{`${current.title}, ${current.org}`}</Fact>}
            <Fact label="Experience">{profile.yearsExperience}+ years</Fact>
            <Fact label="Based in">{profile.location} · UTC+5</Fact>
            {profile.openToWork && <Fact label="Status">Open to full-time roles</Fact>}
          </dl>
        </div>
      </header>

      <Section id="experience" title="Experience">
        <ol className="flex flex-col">
          {experience.map((job) => (
            <li
              key={`${job.org}-${job.start}`}
              className="grid gap-3 border-t border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16"
            >
              <div className="flex flex-col gap-1">
                <p className="font-mono text-label uppercase text-muted">{formatRange(job.start, job.end)}</p>
                <h3 className="font-semiwide text-h3 font-bold">{job.title}</h3>
                <p className="text-small text-muted">
                  {job.org} · {job.location}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <ul className="flex list-disc flex-col gap-2 pl-5 text-body marker:text-muted">
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                {job.projects.length > 0 && (
                  <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-small">
                    <span className="font-mono text-label uppercase text-muted">Case studies</span>
                    {job.projects.map((slug) => {
                      const project = getProject(slug);
                      return project ? (
                        <Link key={slug} href={`/work/${slug}`} className="underline underline-offset-4 hover:text-accent">
                          {project.name}
                        </Link>
                      ) : null;
                    })}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" title="Skills">
        <dl className="grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(profile.skills) as [SkillArea, string[]][]).map(([area, skills]) => (
            <div key={area} className="flex flex-col gap-3">
              <dt className="font-mono text-label uppercase text-muted">{skillAreaLabels[area]}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <li key={skill} className="border border-line px-2 py-0.5 text-small">
                      {skill}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="education" title="Education">
        <ul className="flex flex-col">
          {education.map((school) => (
            <li
              key={school.institution}
              className="grid gap-3 border-t border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16"
            >
              <div className="flex flex-col gap-1">
                <p className="font-mono text-label uppercase text-muted">{formatRange(school.start, school.end)}</p>
                <h3 className="font-semiwide text-h3 font-bold">
                  {school.studyType} in {school.area}
                </h3>
                <p className="text-small text-muted">
                  {school.institution} · {school.location}
                </p>
              </div>
              {school.highlights.length > 0 && (
                <ul className="flex list-disc flex-col gap-2 pl-5 text-body marker:text-muted">
                  {school.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <section aria-label="Get in touch" className="border-t-2 border-fg">
        <div className="page-gutter flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semiwide text-h2 font-bold uppercase">Let&apos;s talk</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-small font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              Get in touch
            </Link>
            <a
              href="/api/resume.json"
              className="inline-flex items-center gap-2 border border-fg px-5 py-3 text-small font-semibold transition-colors hover:bg-fg hover:text-bg"
            >
              Résumé as JSON
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="page-gutter pb-16">
      <h2 id={`${id}-title`} className="mb-6 font-semiwide text-h2 font-bold uppercase">
        {title}
      </h2>
      {children}
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
