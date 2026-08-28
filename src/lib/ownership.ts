/*
  Ownership flag — in-memory only, on purpose: proof of ownership lasts
  until the page is refreshed or closed. A reload forgets it, so every
  fresh page load walks through the ownership gate again. No accounts,
  no storage, nothing persisted.
*/

import { normalise } from "./challans";

const proven = new Set<string>();
const EVENT = "cc-ownership-change";

export function markOwnershipProven(regNo: string) {
  proven.add(normalise(regNo));
  window.dispatchEvent(new Event(EVENT));
}

export function isOwnershipProven(regNo: string) {
  return proven.has(normalise(regNo));
}

/* True when ownership of any vehicle is proven since the last page load —
   the closest thing this account-less prototype has to "logged in". */
export function hasAnyOwnership() {
  return proven.size > 0;
}

export function subscribeOwnership(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener(EVENT, callback);
  };
}
