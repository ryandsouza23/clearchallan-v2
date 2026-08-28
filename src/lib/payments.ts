/*
  Paid-challan ledger — browser-local. When a payment completes (the
  success result), the challan id is recorded here; the record pages then
  show it as Paid, drop it from the due total, and refuse a second
  payment. Stored in localStorage so a paid challan STAYS paid across
  refreshes (unlike ownership proof, which deliberately resets).
*/

const KEY = "cc-paid-challans";
const EVENT = "cc-paid-change";

function readSet(): Set<string> {
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markChallanPaid(challanId: string) {
  try {
    const set = readSet();
    set.add(challanId);
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    // Storage unavailable; payment still completes for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function isChallanPaid(challanId: string) {
  return readSet().has(challanId);
}

export function subscribePaid(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
