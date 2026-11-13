// Theme store shared by the toggle (and anything else that needs it).
// "system" means no data-theme attribute, so the CSS media query decides.
// The inline script in layout.tsx applies the saved value before first paint.

export type Theme = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_ORDER: readonly Theme[] = ["system", "light", "dark"];

const listeners = new Set<() => void>();

export function readTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): still apply for this page view.
  }
  applyTheme(theme);
  listeners.forEach((notify) => notify());
}

export function subscribeTheme(notify: () => void) {
  listeners.add(notify);
  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readTheme());
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}
