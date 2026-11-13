"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { platformLabels, type Project } from "@portfolio/content";
import { ProjectPreview } from "./project-preview";

const PREVIEW_W = 280;
const PREVIEW_H = 210;
/** Sticky header height; the preview flips below the cursor rather than hide under it. */
const HEADER_H = 64;

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();

  // Cursor-following preview: lerp toward the pointer in rAF, write the
  // transform directly so moving the mouse never re-renders React.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function tick() {
    const el = previewRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.18;
    current.current.x += (target.current.x - current.current.x) * ease;
    current.current.y += (target.current.y - current.current.y) * ease;
    el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
    const settled =
      Math.abs(target.current.x - current.current.x) < 0.5 && Math.abs(target.current.y - current.current.y) < 0.5;
    frame.current = settled ? null : requestAnimationFrame(tick);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!canHover) return;
    // Sit above-right of the cursor so it never covers the hovered row
    // (only the dimmed rows around it). Flip at the right and top edges.
    const GAP = 20;
    const right = event.clientX + GAP;
    const x = right + PREVIEW_W > window.innerWidth ? event.clientX - GAP - PREVIEW_W : right;
    const above = event.clientY - GAP - PREVIEW_H;
    const y = above < HEADER_H ? event.clientY + GAP * 2 : above;
    target.current = { x, y };
    if (active === null) current.current = { ...target.current }; // first frame: no fly-in
    if (frame.current === null) frame.current = requestAnimationFrame(tick);
  }

  const activeProject = projects.find((p) => p.slug === active);

  return (
    <>
      <ul
        className="group/list border-t border-line"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(null)}
      >
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-line">
            <Link
              href={`/work/${project.slug}`}
              onPointerEnter={() => canHover && setActive(project.slug)}
              data-active={active === project.slug || undefined}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-5 transition-[color,opacity] duration-200 group-has-[[data-active]]/list:opacity-35 data-active:!opacity-100 data-active:text-accent md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_auto] md:py-6"
            >
              <span className="font-semiwide text-h3 font-bold md:text-[1.5rem]">{project.name}</span>
              <span aria-hidden className="text-h3 md:order-last">
                →
              </span>
              <span className="col-span-full text-small text-muted md:col-span-1">{project.tagline}</span>
              <span className="col-span-full font-mono text-label uppercase text-muted md:col-span-1 md:text-right">
                {project.platforms.map((p) => platformLabels[p]).join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {canHover && (
        <div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-30 overflow-hidden border border-line shadow-2xl shadow-black/15 transition-[opacity,scale] duration-200"
          style={{
            width: PREVIEW_W,
            height: PREVIEW_H,
            opacity: activeProject ? 1 : 0,
            scale: activeProject ? "1" : "0.92",
          }}
        >
          {activeProject && <ProjectPreview project={activeProject} />}
        </div>
      )}
    </>
  );
}

/** True only for a real mouse/trackpad, so touch devices never get a stuck preview. */
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function useCanHover() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(HOVER_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false,
  );
}
