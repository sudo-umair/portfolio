import Image from "next/image";
import { isVideo, platformLabels, projectDevices, type Project } from "@portfolio/content";
import { DeviceFrame } from "@/components/device-frame";

/**
 * The project's first screenshot in its device frame, or placeholder art
 * drawn from tokens when it has none yet (TV, phone, then browser).
 * Recordings use their poster, so a hover preview never starts a video.
 */
export function ProjectPreview({ project }: { project: Project }) {
  const shot = project.media.find((m) => !isVideo(m) || m.poster);
  const device = shot?.device ?? projectDevices(project)[0];
  return (
    <div className="flex h-full w-full flex-col justify-between gap-4 bg-surface p-5">
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {shot ? (
          <div className={device === "phone" ? "w-[64px]" : "w-[82%]"}>
            <DeviceFrame device={device} compact>
              <Image
                src={isVideo(shot) ? shot.poster! : shot.src}
                alt=""
                width={shot.width}
                height={shot.height}
                sizes="240px"
                className="block h-auto w-full"
              />
            </DeviceFrame>
          </div>
        ) : device === "browser" ? (
          <BrowserArt />
        ) : (
          <PhoneArt tv={device === "tv"} />
        )}
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

function PhoneArt({ tv }: { tv: boolean }) {
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

function BrowserArt() {
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
