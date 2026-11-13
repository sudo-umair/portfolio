"use client";

import { useSyncExternalStore } from "react";
import { useCommandPalette } from "./provider";

const noop = () => () => {};

/** Apple platforms get ⌘, everything else Ctrl. Server renders ⌘, the client corrects it after hydration. */
function useIsApple() {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
}

export function CommandPaletteTrigger() {
  const { openPalette } = useCommandPalette();
  const apple = useIsApple();

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search and commands"
      aria-keyshortcuts={apple ? "Meta+K" : "Control+K"}
      className="flex h-9 items-center gap-2 rounded-full px-2 text-muted transition-colors hover:bg-surface hover:text-fg sm:border sm:border-line sm:pr-1.5 sm:pl-3"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <kbd className="hidden rounded-full bg-surface px-2 py-0.5 font-mono text-label text-muted sm:inline">
        {apple ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
