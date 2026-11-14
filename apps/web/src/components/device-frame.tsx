import type { Device } from "@portfolio/content";

/**
 * Plain, token-drawn device chrome around a screenshot or recording. The
 * child sets the size: frames add only bezels, so the screen keeps the
 * media's own aspect ratio. `compact` thins everything for small previews.
 */
export function DeviceFrame({
  device,
  compact = false,
  children,
}: {
  device: Device;
  compact?: boolean;
  children: React.ReactNode;
}) {
  if (device === "phone") {
    return (
      <div
        className={`relative overflow-hidden bg-bezel ${compact ? "rounded-[14px] p-[3px]" : "rounded-[2.25rem] p-2"}`}
      >
        <div className={`overflow-hidden bg-bg ${compact ? "rounded-[11px]" : "rounded-[1.75rem]"}`}>{children}</div>
        <span
          aria-hidden
          className={`absolute left-1/2 top-[2.2%] h-[2.4%] w-[28%] -translate-x-1/2 rounded-full bg-bezel ${compact ? "min-h-1" : "min-h-3"}`}
        />
      </div>
    );
  }

  if (device === "tv") {
    return (
      <div className="flex flex-col items-center">
        <div className={`w-full overflow-hidden bg-bezel ${compact ? "rounded-sm p-[3px]" : "rounded-md p-2.5"}`}>
          <div className="overflow-hidden bg-bg">{children}</div>
        </div>
        <span aria-hidden className={`rounded-b-sm bg-bezel ${compact ? "h-1 w-1/5" : "h-2.5 w-1/5"}`} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden border-bezel bg-bezel ${compact ? "rounded-md border-2" : "rounded-lg border-[3px]"}`}>
      <div aria-hidden className={`flex ${compact ? "gap-1 px-1.5 py-1" : "gap-1.5 px-2.5 py-2"}`}>
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={`rounded-full bg-white/35 ${compact ? "size-1.5" : "size-2.5"}`} />
        ))}
      </div>
      <div className="overflow-hidden rounded-[3px] bg-bg">{children}</div>
    </div>
  );
}
