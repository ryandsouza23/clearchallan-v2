"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "./icons";

const languages = [
  { code: "en", name: "English", native: "English", available: true },
  { code: "hi", name: "Hindi", native: "हिन्दी", available: false },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", available: false },
  { code: "ta", name: "Tamil", native: "தமிழ்", available: false },
  { code: "te", name: "Telugu", native: "తెలుగు", available: false },
  { code: "mr", name: "Marathi", native: "मराठी", available: false },
  { code: "bn", name: "Bengali", native: "বাংলা", available: false },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", available: false },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", available: false },
  { code: "ml", name: "Malayalam", native: "മലയാളം", available: false },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", available: false },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-2 border border-rule bg-surface px-3 text-sm text-body hover:bg-surface-sunken hover:text-ink"
      >
        <GlobeIcon size={16} className="text-muted" />
        <span>English</span>
        <ChevronDownIcon size={12} className="text-muted" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 z-50 mt-1 w-[232px] border border-rule bg-surface-elevated py-1"
        >
          {languages.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.available}>
              {lang.available ? (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-surface-sunken"
                >
                  <span>
                    {lang.name}
                    <span className="ml-2 text-muted-strong">{lang.native}</span>
                  </span>
                  <CheckIcon size={14} className="text-primary" />
                </button>
              ) : (
                <span
                  aria-disabled="true"
                  className="flex w-full cursor-not-allowed items-center justify-between gap-2 px-3 py-2 text-sm text-muted-strong"
                >
                  <span>
                    {lang.name}
                    <span className="ml-2">{lang.native}</span>
                  </span>
                  <span className="shrink-0 border border-rule px-1 py-px text-[11px] leading-4">
                    Coming soon
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
