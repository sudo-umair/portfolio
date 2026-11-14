"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping recording that only plays while it is on screen, so a
 * gallery of them doesn't download and decode everything at once. People who
 * prefer reduced motion get it paused on its poster, with controls.
 */
export function AutoplayVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      setReduced(motion.matches);
      if (visible && !motion.matches) video.play().catch(() => {});
      else video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
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
      preload="none"
      controls={reduced}
      className="block h-auto w-full"
    />
  );
}
