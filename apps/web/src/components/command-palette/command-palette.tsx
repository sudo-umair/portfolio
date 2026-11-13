"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { searchCommands, type CommandItem } from "@/lib/command-search";
import { readTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";

/** Serializable data passed from the server layout. */
export type PaletteData = {
  projects: { slug: string; name: string; tagline: string; keywords: string[] }[];
  links: { label: string; href: string }[];
};

/** What an item does, as data. Executed only in event handlers by runItem(). */
type PaletteAction =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string }
  | { type: "theme"; value: Theme }
  | { type: "copy-link" };

type PaletteItem = CommandItem & { action: PaletteAction };

const GROUP_ORDER = ["Projects", "Pages", "Actions", "Links"];

function buildItems(data: PaletteData, theme: Theme): PaletteItem[] {
  return [
    ...data.projects.map((project) => ({
      id: `project-${project.slug}`,
      group: "Projects",
      label: project.name,
      hint: project.tagline,
      keywords: project.keywords,
      action: { type: "navigate", href: `/work/${project.slug}` } as const,
    })),
    { id: "page-home", group: "Pages", label: "Home", keywords: ["start", "index"], action: { type: "navigate", href: "/" } },
    {
      id: "page-work",
      group: "Pages",
      label: "Selected work",
      keywords: ["projects", "portfolio"],
      action: { type: "navigate", href: "/#work" },
    },
    ...(["light", "dark", "system"] as const).map((value) => ({
      id: `theme-${value}`,
      group: "Actions",
      label: value === "system" ? "Use system theme" : `Use ${value} theme`,
      hint: theme === value ? "Current" : undefined,
      keywords: ["theme", "appearance", "mode", "color"],
      action: { type: "theme", value } as const,
    })),
    {
      id: "copy-link",
      group: "Actions",
      label: "Copy link to this page",
      keywords: ["share", "url", "clipboard"],
      action: { type: "copy-link" },
    },
    ...data.links.map((link) => ({
      id: `link-${link.label.toLowerCase()}`,
      group: "Links",
      label: link.label,
      hint: "Opens in a new tab",
      keywords: ["profile", "social", "contact"],
      action: { type: "external", href: link.href } as const,
    })),
    {
      id: "api-resume",
      group: "Links",
      label: "Résumé as JSON",
      hint: "JSON Resume format",
      keywords: ["cv", "resume", "api", "json", "download"],
      action: { type: "external", href: "/api/resume.json" },
    },
    {
      id: "api-index",
      group: "Links",
      label: "Public API",
      hint: "Read-only JSON",
      keywords: ["api", "json", "endpoints", "developer"],
      action: { type: "external", href: "/api" },
    },
  ];
}

export function CommandPalette({ data, onClosed }: { data: PaletteData; onClosed: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "system" as const);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;

  // Open as a modal on mount: native focus trap, Escape to close, inert page.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  /** Every close goes through the dialog so the browser restores focus. */
  const close = useCallback(() => dialogRef.current?.close(), []);

  function runItem(item: PaletteItem) {
    const { action } = item;
    close();
    switch (action.type) {
      case "navigate":
        router.push(action.href);
        break;
      case "external":
        window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "theme":
        setTheme(action.value);
        break;
      case "copy-link":
        void navigator.clipboard?.writeText(window.location.href).catch(() => {});
        break;
    }
  }

  const items = useMemo(() => buildItems(data, theme), [data, theme]);

  // Rank across everything, then group in order of each group's best match.
  // With no query, groups follow GROUP_ORDER.
  const groups = useMemo(() => {
    const ranked = searchCommands(items, query);
    const byGroup = new Map<string, PaletteItem[]>();
    const order = query.trim() ? ranked.map((item) => item.group) : GROUP_ORDER;
    for (const group of order) if (!byGroup.has(group)) byGroup.set(group, []);
    for (const item of ranked) byGroup.get(item.group)?.push(item);
    return [...byGroup].filter(([, groupItems]) => groupItems.length > 0);
  }, [items, query]);

  const flat = groups.flatMap(([, groupItems]) => groupItems);
  const active = Math.min(activeIndex, Math.max(flat.length - 1, 0));

  useEffect(() => {
    document.getElementById(`${listId}-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [listId, active]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (flat.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((active + step + flat.length) % flat.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flat[active];
      if (item) runItem(item);
    } else if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClose={onClosed}
      // Clicking the backdrop lands on the dialog element itself.
      onClick={(event) => event.target === event.currentTarget && close()}
      className="fixed inset-x-0 top-[12vh] m-0 mx-auto max-h-[min(34rem,76vh)] w-[min(40rem,calc(100%-2rem))] flex-col overflow-hidden open:flex border border-line bg-bg p-0 text-fg shadow-2xl shadow-black/30 backdrop:bg-black/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <SearchIcon />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={flat.length > 0 ? optionId(active) : undefined}
          aria-label="Search projects, pages and actions"
          placeholder="Search projects, pages and actions…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          className="h-14 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted"
        />
        <kbd className="hidden font-mono text-label text-muted sm:block">esc</kbd>
      </div>

      <ul id={listId} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto p-2">
        {flat.length === 0 && (
          <li role="presentation" className="px-3 py-10 text-center text-small text-muted">
            No results for “{query.trim()}”
          </li>
        )}
        {groups.map(([group, groupItems]) => (
          <li key={group} role="presentation" className="pb-2 last:pb-0">
            <div id={`${listId}-${group}`} role="presentation" className="px-3 pt-2 pb-1 font-mono text-label uppercase text-muted">
              {group}
            </div>
            <ul role="group" aria-labelledby={`${listId}-${group}`}>
              {groupItems.map((item) => {
                const index = flat.indexOf(item);
                const selected = index === active;
                return (
                  <li
                    key={item.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={selected}
                    onPointerMove={() => !selected && setActiveIndex(index)}
                    onClick={() => runItem(item)}
                    className="flex cursor-pointer items-baseline justify-between gap-4 px-3 py-2.5 text-small aria-selected:bg-accent aria-selected:text-accent-fg"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.hint && (
                      <span className="truncate text-label tracking-normal opacity-75">{item.hint}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>

      <div aria-hidden className="hidden gap-4 border-t border-line px-4 py-2 font-mono text-label text-muted uppercase sm:flex">
        <span>↑↓ Navigate</span>
        <span>↵ Open</span>
        <span>Esc Close</span>
      </div>
    </dialog>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden className="shrink-0 text-muted">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
