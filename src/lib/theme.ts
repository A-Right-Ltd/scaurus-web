export type Theme = "light" | "dark";

const THEME_KEY = "theme";

export function readStoredTheme(fallback: Theme = "dark"): Theme {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return fallback;
}

export function applyThemeClass(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function persistTheme(theme: Theme): void {
  applyThemeClass(theme);
  localStorage.setItem(THEME_KEY, theme);
}
