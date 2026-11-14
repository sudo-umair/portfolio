import type { Device } from "@portfolio/content";

/**
 * Plain, token-drawn device chrome around a screenshot or recording. The
 * child sets the size: frames add only bezels, so the screen keeps the
 * media's own aspect ratio.
 */
export function DeviceFrame({ device, children }: { device: Device; children: React.ReactNode }) {
  if (device === "phone") {
    return (
      <div className="relative overflow-hidden rounded-[2.25rem] bg-bezel p-2">
        <div className="overflow-hidden rounded-[1.75rem] bg-bg">{children}</div>
        <span
          aria-hidden
          className="absolute left-1/2 top-[2.2%] h-[2.4%] min-h-3 w-[28%] -translate-x-1/2 rounded-full bg-bezel"
        />
      </div>
    );
  }

  if (device === "tv") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full overflow-hidden rounded-md bg-bezel p-2.5">
          <div className="overflow-hidden bg-bg">{children}</div>
        </div>
        <span aria-hidden className="h-2.5 w-1/5 rounded-b-sm bg-bezel" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border-[3px] border-bezel bg-bezel">
      <div aria-hidden className="flex gap-1.5 px-2.5 py-2">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2.5 rounded-full bg-white/35" />
        ))}
      </div>
      <div className="overflow-hidden rounded-[3px] bg-bg">{children}</div>
    </div>
  );
}
