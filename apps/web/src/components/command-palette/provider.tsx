"use client";

import { createContext, use, useCallback, useEffect, useState } from "react";
import { CommandPalette, type PaletteData } from "./command-palette";

const PaletteContext = createContext<{ openPalette: () => void } | null>(null);

export function useCommandPalette() {
  const context = use(PaletteContext);
  if (!context) throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  return context;
}

/** Owns the open state and the global ⌘K / Ctrl+K and "/" shortcuts. */
export function CommandPaletteProvider({ data, children }: { data: PaletteData; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPalette = useCallback(() => setOpen(true), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return;
      const modK = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey;
      const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !isTyping(event.target);
      // While open, the palette's own input handles ⌘K (to close it).
      if (!modK && !slash) return;
      event.preventDefault();
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <PaletteContext value={{ openPalette }}>
      {children}
      {/* Mounted only while open, so every opening starts with a fresh query. */}
      {open && <CommandPalette data={data} onClosed={() => setOpen(false)} />}
    </PaletteContext>
  );
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}
