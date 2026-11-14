"use client";

import { useEffect } from "react";

/**
 * Marks the hero intro as played once its last animation ends. The intro:
 * variant stops matching, so the homepage doesn't replay it when Next shows
 * the kept-alive page again (Back, or the header link). A reload still plays it.
 */
export function IntroSeen() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-intro]");
    if (!root) return;
    const onEnd = () => {
      const running = root.getAnimations({ subtree: true }).some((a) => a.playState !== "finished");
      if (!running) document.documentElement.dataset.introSeen = "";
    };
    root.addEventListener("animationend", onEnd);
    return () => root.removeEventListener("animationend", onEnd);
  }, []);

  return null;
}
