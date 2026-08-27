"use client";

import { useEffect } from "react";

// UX4G Design System 3.0 — npm package `ux4g-web-components` (v1.0.13),
// published by NeGD/Digital India (support.ux4g@digitalindia.gov.in).
// The side-effect import injects the UX4G interactive runtime (dropdowns,
// modals, tooltips, accordions, drawers, tabs, …). It is loaded inside
// useEffect — after hydration — because the runtime's MutationObserver
// stamps data-ux4g-init attributes on elements, which would otherwise make
// the client DOM diverge from the server HTML mid-hydration.
export function Ux4gRuntime() {
  useEffect(() => {
    import("ux4g-web-components/design-system");
  }, []);
  return null;
}
