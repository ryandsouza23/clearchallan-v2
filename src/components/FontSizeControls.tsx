"use client";

import { useSyncExternalStore } from "react";

/*
  Government-portal text-size controls (A− / A / A+). The scale is applied
  as a percentage font-size on <html>, so UX4G's rem-based type scale — and
  everything else — resizes with it. Persisted like the theme, restored by
  a pre-paint script in layout.tsx.
*/

export const FONT_SCALE_KEY = "clearchallan-font-scale";
const EVENT = "cc-font-scale-change";
const STEPS = [80, 90, 100, 110, 120, 130];

let memoryScale: number | null = null;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function getSnapshot(): number {
  if (memoryScale !== null) return memoryScale;
  const stored = parseInt(
    window.localStorage.getItem(FONT_SCALE_KEY) ?? "100",
    10,
  );
  return STEPS.includes(stored) ? stored : 100;
}

function getServerSnapshot() {
  return 100;
}

function applyScale(scale: number) {
  document.documentElement.style.fontSize = scale === 100 ? "" : `${scale}%`;
}

function setScale(scale: number) {
  memoryScale = scale;
  try {
    window.localStorage.setItem(FONT_SCALE_KEY, String(scale));
  } catch {
    // Storage unavailable; the choice still applies for this page.
  }
  applyScale(scale);
  window.dispatchEvent(new Event(EVENT));
}

const buttonClass =
  "flex h-8 min-w-8 items-center justify-center px-1 text-sm text-body hover:bg-surface-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";

export function FontSizeControls() {
  const scale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const index = STEPS.indexOf(scale);

  return (
    <div
      role="group"
      aria-label="Text size"
      className="flex items-center border border-rule bg-surface"
    >
      <button
        type="button"
        aria-label="Decrease text size"
        disabled={index <= 0}
        onClick={() => setScale(STEPS[Math.max(0, index - 1)])}
        className={buttonClass}
      >
        A−
      </button>
      <button
        type="button"
        aria-label="Reset text size to default"
        aria-pressed={scale === 100}
        onClick={() => setScale(100)}
        className={`${buttonClass} ${scale === 100 ? "bg-surface-sunken font-semibold text-ink" : ""}`}
      >
        A
      </button>
      <button
        type="button"
        aria-label="Increase text size"
        disabled={index >= STEPS.length - 1}
        onClick={() => setScale(STEPS[Math.min(STEPS.length - 1, index + 1)])}
        className={buttonClass}
      >
        A+
      </button>
      <span aria-live="polite" className="sr-only">
        Text size {scale} percent
      </span>
    </div>
  );
}
