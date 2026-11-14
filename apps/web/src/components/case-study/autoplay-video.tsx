"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping recording. People who prefer reduced motion get it paused
 * on its poster with controls, so it only plays if they choose to.
 */
export function AutoplayVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(query.matches);
      const video = ref.current;
      if (!video) return;
      if (query.matches) video.pause();
      else video.play().catch(() => {});
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced}
      className="block h-auto w-full"
    />
  );
}
