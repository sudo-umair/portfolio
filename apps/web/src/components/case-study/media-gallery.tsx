import Image from "next/image";
import { isVideo, type Media } from "@portfolio/content";
import { DeviceFrame } from "@/components/device-frame";
import { AutoplayVideo } from "./autoplay-video";

// Wide screens take two thirds of the row, phones sit beside them.
const itemWidth = {
  browser: "w-full lg:w-[calc(66.666%-1.5rem)]",
  tv: "w-full lg:w-[calc(66.666%-1.5rem)]",
  phone: "w-[calc(50%-1rem)] sm:w-[15rem]",
} as const;

const imageSizes = {
  browser: "(min-width: 1024px) 66vw, 100vw",
  tv: "(min-width: 1024px) 66vw, 100vw",
  phone: "(min-width: 640px) 240px, 50vw",
} as const;

export function MediaGallery({ media }: { media: Media[] }) {
  return (
    <ul className="flex flex-wrap items-start gap-x-8 gap-y-12">
      {media.map((item, index) => (
        <li
          key={`${index}-${item.src}`}
          className={`reveal-on-scroll ${itemWidth[item.device]}`}
          // Each item reveals on its own view() timeline, so the stagger only matters
          // between neighbours entering together. A global index pushes later items'
          // animation-range past full entry and they never reach full opacity.
          style={{ "--i": index % 3 } as React.CSSProperties}
        >
          <figure className="flex flex-col gap-3">
            <DeviceFrame device={item.device}>
              {isVideo(item) ? (
                <AutoplayVideo src={item.src} poster={item.poster} label={item.alt} />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes={imageSizes[item.device]}
                  className="block h-auto w-full"
                />
              )}
            </DeviceFrame>
            {item.caption && <figcaption className="text-small text-muted">{item.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  );
}
