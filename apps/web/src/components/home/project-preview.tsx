import { platformLabels, type Project } from "@portfolio/content";

/**
 * Placeholder preview art drawn from tokens: a phone frame for mobile/TV
 * projects, a browser frame for web ones. Swap for real screenshots once
 * they exist (add an image field to the content schema).
 */
export function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-4 bg-surface p-5">
      <div className="flex flex-1 items-center justify-center">
        {project.variant === "mobile" ? <PhoneFrame tv={project.platforms.includes("android-tv")} /> : <BrowserFrame />}
      </div>
      <div>
        <p className="font-semiwide text-small font-bold uppercase">{project.name}</p>
        <p className="font-mono text-label uppercase text-muted">
          {project.platforms.map((p) => platformLabels[p]).join(" · ")}
        </p>
      </div>
    </div>
  );
}

function PhoneFrame({ tv }: { tv: boolean }) {
  if (tv) {
    return (
      <div className="flex w-[78%] flex-col items-center gap-1">
        <div className="aspect-video w-full rounded-sm border-[5px] border-fg bg-accent/80" />
        <div className="h-1.5 w-1/4 rounded-full bg-fg" />
      </div>
    );
  }
  return (
    <div className="flex h-[118px] w-[58px] flex-col rounded-[14px] border-[4px] border-fg bg-accent/80 p-1">
      <div className="mx-auto h-1 w-4 rounded-full bg-fg" />
    </div>
  );
}

function BrowserFrame() {
  return (
    <div className="w-[82%] overflow-hidden rounded-md border-2 border-fg">
      <div className="flex gap-1 border-b-2 border-fg bg-bg px-2 py-1.5">
        <span className="size-1.5 rounded-full bg-fg" />
        <span className="size-1.5 rounded-full bg-fg" />
        <span className="size-1.5 rounded-full bg-fg" />
      </div>
      <div className="grid aspect-[16/8] grid-cols-[1fr_2fr] gap-1.5 bg-accent/80 p-2">
        <div className="rounded-sm bg-bg/70" />
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-3/4 rounded-sm bg-bg/70" />
          <div className="flex-1 rounded-sm bg-bg/40" />
        </div>
      </div>
    </div>
  );
}
