/*
  Session-scoped ownership flag. No accounts, no server: proof of ownership
  lives in sessionStorage for this tab only, and is read via
  useSyncExternalStore-compatible helpers. Client-side only.
*/

import { normalise } from "./challans";

const KEY = "cc-ownership-proven";
const EVENT = "cc-ownership-change";

function readSet(): Set<string> {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markOwnershipProven(regNo: string) {
  try {
    const set = readSet();
    set.add(normalise(regNo));
    window.sessionStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    // Storage unavailable; the flag simply won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function isOwnershipProven(regNo: string) {
  return readSet().has(normalise(regNo));
}

/* True when ownership of any vehicle is proven this session — the closest
   thing this account-less prototype has to "logged in". */
export function hasAnyOwnership() {
  return readSet().size > 0;
}

export function subscribeOwnership(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
