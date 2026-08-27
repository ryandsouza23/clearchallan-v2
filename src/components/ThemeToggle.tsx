"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "clearchallan-theme";
const THEME_CHANGE_EVENT = "clearchallan-theme-change";

// In-memory fallback so the toggle still works when storage is unavailable
// (private mode, blocked cookies).
let memoryPreference: ThemePreference | null = null;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): ThemePreference {
  if (memoryPreference) return memoryPreference;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function getServerSnapshot(): ThemePreference {
  return "system";
}

// UX4G's dark theme keys off :root[data-theme="dark"] and has no
// prefers-color-scheme fallback, so the attribute always carries the
// RESOLVED theme; "system" is resolved via matchMedia at apply time.
function applyPreference(preference: ThemePreference) {
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.setAttribute("data-theme", resolved);
}

function selectPreference(next: ThemePreference) {
  memoryPreference = next;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage unavailable; memoryPreference keeps the choice for this page.
  }
  applyPreference(next);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

const options: { value: ThemePreference; label: string; Icon: typeof SunIcon }[] = [
  { value: "light", label: "Light theme", Icon: SunIcon },
  { value: "dark", label: "Dark theme", Icon: MoonIcon },
  { value: "system", label: "Match system theme", Icon: MonitorIcon },
];

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // While the preference is "system", follow live OS theme changes.
  useEffect(() => {
    if (preference !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyPreference("system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [preference]);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center border border-rule bg-surface"
    >
      {options.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => selectPreference(value)}
            className={`flex h-8 w-8 items-center justify-center transition-colors ${
              active
                ? "bg-primary text-on-primary"
                : "text-muted hover:bg-surface-sunken hover:text-ink"
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
