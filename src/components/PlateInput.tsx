"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

/*
  The number-plate input. One element, two jobs:
  - a REAL <input> (visible label, ordinary caret, focus ring on the plate
    via :focus-within) where the registration is typed in plate lettering;
  - while empty and unfocused, an aria-hidden overlay underneath rolls
    through example plates odometer-style. Focus or typing hides the
    overlay instantly; reduced motion gets one static example instead.
  The plate face is a physical artefact: fixed white/black with a plain
  blue "IND" text tab — deliberately NO emblem, NO chakra, NO wheel.
*/

const PLATES = [
  "KA 25 XY 4567",
  "MH 12 AB 1234",
  "DL 3C AL 9087",
  "TN 09 BQ 5521",
  "GJ 05 JK 3390",
  "UP 32 CD 7788",
];

const CYCLE_MS = 2000;
const ROLL_MS = 500;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(reducedMotionQuery);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServer() {
  return true; // no motion until the preference is known
}

const plateText =
  "font-mono font-bold uppercase tracking-[0.08em] text-[#171717] text-[length:clamp(1.05rem,5.2vw,1.75rem)]";

export function PlateInput() {
  const router = useRouter();
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [index, setIndex] = useState(0);
  const [shift, setShift] = useState(false);

  const overlayVisible = value === "" && !focused;
  const rolling = overlayVisible && !reducedMotion;

  useEffect(() => {
    if (!rolling) return;
    let inner: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      setShift(true);
      inner = setTimeout(() => {
        setShift(false);
        setIndex((i) => (i + 1) % PLATES.length);
      }, ROLL_MS + 50);
    }, CYCLE_MS);
    return () => {
      clearInterval(cycle);
      if (inner) clearTimeout(inner);
    };
  }, [rolling]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const regNo = value.trim().replace(/\s+/g, " ").toUpperCase();
    router.push(`/challans?regNo=${encodeURIComponent(regNo)}`);
  }

  return (
    <form action="/challans" method="get" onSubmit={onSubmit}>
      <label
        htmlFor="regNo"
        className="ux4g-label-l-default block text-center text-body"
      >
        Vehicle registration number
      </label>

      {/* The plate */}
      <div className="mx-auto mt-3 flex h-[4.5rem] max-w-[26rem] overflow-hidden rounded-lg border-[3px] border-[#171717] bg-[#FFFFFF] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus">
        {/* IND tab — plain text only */}
        <span
          aria-hidden="true"
          className="flex shrink-0 flex-col items-center justify-center gap-px bg-[var(--ux4g-color-blue-800)] px-2"
        >
          {["I", "N", "D"].map((ch) => (
            <span
              key={ch}
              className="text-[0.55rem] leading-[0.8rem] font-semibold text-[#FFFFFF]"
            >
              {ch}
            </span>
          ))}
        </span>

        {/* input + rolling overlay share one box */}
        <span className="relative block min-w-0 flex-1">
          {overlayVisible && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 block overflow-hidden"
            >
              <span
                className="block h-[200%]"
                style={{
                  transform: shift ? "translateY(-50%)" : "translateY(0)",
                  transition: shift
                    ? `transform ${ROLL_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                    : "none",
                }}
              >
                <span
                  className={`flex h-1/2 items-center justify-center whitespace-nowrap ${plateText} opacity-45`}
                >
                  {PLATES[index]}
                </span>
                <span
                  className={`flex h-1/2 items-center justify-center whitespace-nowrap ${plateText} opacity-45`}
                >
                  {PLATES[(index + 1) % PLATES.length]}
                </span>
              </span>
            </span>
          )}
          <input
            id="regNo"
            name="regNo"
            type="text"
            required
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setShift(false);
            }}
            aria-describedby="regNo-hint"
            className={`relative h-full w-full bg-transparent text-center caret-[#171717] outline-none ${plateText}`}
          />
        </span>
      </div>

      <p
        id="regNo-hint"
        className="ux4g-label-m-default mx-auto mt-3 max-w-[44ch] text-center text-muted"
      >
        Usually the state code, district, series and number — like
        KA&nbsp;25&nbsp;XY&nbsp;4567. Spacing doesn&apos;t matter.
      </p>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="ux4g-btn ux4g-btn-primary ux4g-btn-lg w-full sm:w-auto"
        >
          Check challans
        </button>
      </div>
    </form>
  );
}
