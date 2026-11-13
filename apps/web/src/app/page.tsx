import { profile } from "@portfolio/content";

export default function Home() {
  return (
    <main id="main" className="page-gutter flex flex-1 flex-col gap-6 py-16">
      <p className="font-mono text-label uppercase text-muted">{profile.title}</p>
      <h1 className="font-wide text-display uppercase">{profile.name}</h1>
      <p className="max-w-prose text-muted">{profile.headline}</p>
      <a href="#" className="w-fit bg-accent px-4 py-2 text-small font-medium text-accent-fg">
        Accent token
      </a>
    </main>
  );
}
