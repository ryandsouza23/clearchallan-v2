"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  UPI payment sheet. Invented UPI apps only — River / Cedar / Timber /
  Pebble — flat geometric marks that resemble no real app. There is NO PIN
  entry anywhere on this surface, by design: a web page asking for a UPI PIN
  is the phishing pattern this product warns against. Mark colours use UX4G
  primitive ramps directly — a documented exception, since the semantic
  tokens have no role for third-party app marks.
*/

type AppId = "river" | "cedar" | "timber" | "pebble";
type SheetState = "confirm" | "qr" | "waiting" | "processing";
type IdMode = "id" | "phone";

const APPS: {
  id: AppId;
  name: string;
  handle: string;
  tint: string;
  color: string;
}[] = [
  {
    id: "river",
    name: "River",
    handle: "@riverdemo",
    tint: "var(--ux4g-color-cyan-100)",
    color: "var(--ux4g-color-cyan-700)",
  },
  {
    id: "cedar",
    name: "Cedar",
    handle: "@cedardemo",
    tint: "var(--ux4g-color-green-100)",
    color: "var(--ux4g-color-green-700)",
  },
  {
    id: "timber",
    name: "Timber",
    handle: "@timberdemo",
    tint: "var(--ux4g-color-gold-100)",
    color: "var(--ux4g-color-gold-700)",
  },
  {
    id: "pebble",
    name: "Pebble",
    handle: "@pebbledemo",
    tint: "var(--ux4g-color-purple-100)",
    color: "var(--ux4g-color-purple-700)",
  },
];

/* Flat single-colour geometric marks, 40×40, resembling no real app. */
function AppMark({ app, size = 40 }: { app: AppId; size?: number }) {
  const paths: Record<AppId, React.ReactNode> = {
    river: (
      <path
        d="M4 14c4-5 8-5 12 0s8 5 12 0M4 24c4-5 8-5 12 0s8 5 12 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    ),
    cedar: (
      <path d="M16 4 26 18h-6l7 10H5l7-10H6L16 4Z" fill="currentColor" />
    ),
    timber: (
      <g fill="currentColor">
        <rect x="5" y="6" width="22" height="5" rx="2.5" />
        <rect x="9" y="14" width="18" height="5" rx="2.5" />
        <rect x="5" y="22" width="14" height="5" rx="2.5" />
      </g>
    ),
    pebble: (
      <g fill="currentColor">
        <ellipse cx="14" cy="13" rx="9" ry="7" />
        <ellipse cx="20" cy="23" rx="7" ry="5.5" opacity="0.7" />
      </g>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable={false}
    >
      {paths[app]}
    </svg>
  );
}

/*
  Representative QR only. Deterministic pattern (no randomness, so server
  and client render identically); encodes nothing.
*/
function bit(seed: string, x: number, y: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= Math.imul(x + 1, 0x9e3779b1) ^ Math.imul(y + 1, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) % 2 === 0;
}

function FakeQr({ seed }: { seed: string }) {
  const n = 25;
  const cells: React.ReactNode[] = [];
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!inFinder(x, y) && bit(seed, x, y)) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
      }
    }
  }
  const finder = (fx: number, fy: number) => (
    <g key={`f${fx}${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" fill="none" stroke="currentColor" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg
      viewBox={`-1 -1 ${n + 2} ${n + 2}`}
      className="mx-auto block w-full max-w-[17rem]"
      role="img"
      aria-label="Representative QR code — encodes nothing"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {cells}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}

const STATES: { id: SheetState; label: string }[] = [
  { id: "confirm", label: "Confirm" },
  { id: "qr", label: "QR" },
  { id: "waiting", label: "Waiting" },
  { id: "processing", label: "Processing" },
];

export function UpiSheet({
  regNo,
  challanId,
  amount,
}: {
  regNo: string;
  challanId: string;
  amount: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<SheetState>("confirm");
  const [appId, setAppId] = useState<AppId>("river");
  const [idMode, setIdMode] = useState<IdMode>("id");
  const [upiId, setUpiId] = useState("rukmini");
  const [phone, setPhone] = useState("98450 21870");
  const [secondsLeft, setSecondsLeft] = useState(300);

  const app = APPS.find((a) => a.id === appId)!;
  const payingFrom = idMode === "id" ? `${upiId}${app.handle}` : `+91 ${phone}`;
  const resultHref = `/pay/result?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`;

  // Entering the waiting state restarts the 5-minute approval countdown.
  function goTo(next: SheetState) {
    if (next === "waiting") setSecondsLeft(300);
    setState(next);
  }

  // Waiting: tick the approval countdown; the simulated approval arrives
  // after ~3 seconds and moves the sheet on to processing.
  useEffect(() => {
    if (state !== "waiting") return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    const approved = setTimeout(() => setState("processing"), 3000);
    return () => {
      clearInterval(t);
      clearTimeout(approved);
    };
  }, [state]);

  // Processing: hand off to the result page.
  useEffect(() => {
    if (state !== "processing") return;
    const t = setTimeout(() => router.push(resultHref), 2800);
    return () => clearTimeout(t);
  }, [state, router, resultHref]);

  const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <div>
      {/* Preview-only control, clearly outside the sheet */}
      <div
        role="group"
        aria-label="Preview sheet state"
        className="mb-4 flex flex-wrap items-center gap-2"
      >
        <span className="ux4g-label-m-default text-muted">Preview state</span>
        {STATES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={state === s.id}
            onClick={() => goTo(s.id)}
            className={`border px-2 py-1 text-sm ${
              state === s.id
                ? "border-primary bg-primary text-on-primary"
                : "border-rule bg-surface text-body hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* The sheet — fixed light, both themes */}
      <div className="cc-pay-sheet ux4g-card ux4g-card-solid ux4g-card-vertical ux4g-shadow-l3 mx-auto max-w-md">
        <div className="ux4g-card-body">
          {/* App bar */}
          <div className="flex items-center gap-3 border-b border-rule pb-3">
            <Link
              href={`/pay?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`}
              aria-label="Back to payment methods"
              className="flex h-8 w-8 items-center justify-center text-body hover:text-ink"
            >
              <Ux4gIcon name="arrow_back" className="ux4g-fs-20" />
            </Link>
            <span
              className="flex h-8 w-8 items-center justify-center"
              style={{ background: app.tint, color: app.color }}
            >
              <AppMark app={app.id} size={22} />
            </span>
            <span className="ux4g-body-m-strong text-ink">{app.name}</span>
            <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-s ml-auto">
              Sample
            </span>
          </div>

          {state === "confirm" && (
            <div>
              {/* App picker */}
              <fieldset className="mt-4">
                <legend className="ux4g-label-l-default text-body">
                  Pay with
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {APPS.map((a) => (
                    <label
                      key={a.id}
                      className={`flex cursor-pointer items-center gap-3 border p-2 ${
                        appId === a.id
                          ? "border-primary bg-surface-sunken"
                          : "border-rule"
                      }`}
                    >
                      <input
                        type="radio"
                        name="upiApp"
                        value={a.id}
                        checked={appId === a.id}
                        onChange={() => setAppId(a.id)}
                        className="sr-only"
                      />
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center"
                        style={{ background: a.tint, color: a.color }}
                      >
                        <AppMark app={a.id} size={28} />
                      </span>
                      <span className="ux4g-body-m-strong text-ink">
                        {a.name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* UPI ID / phone */}
              <div className="mt-4">
                {idMode === "id" ? (
                  <div className="ux4g-input-container ux4g-input-md ux4g-input-default">
                    <label className="ux4g-label-m-default" htmlFor="upiId">
                      UPI ID
                    </label>
                    <div className="ux4g-input">
                      <input
                        className="ux4g-input-input"
                        id="upiId"
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <span className="ux4g-body-m-strong pr-3 text-body">
                        {app.handle}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="ux4g-input-container ux4g-input-md ux4g-input-default">
                    <label className="ux4g-label-m-default" htmlFor="upiPhone">
                      UPI-linked phone number
                    </label>
                    <div className="ux4g-input">
                      <span className="ux4g-body-m-strong pl-3 text-body">
                        +91
                      </span>
                      <input
                        className="ux4g-input-input"
                        id="upiPhone"
                        type="text"
                        inputMode="tel"
                        autoComplete="off"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                  <button
                    type="button"
                    className="ux4g-text-link-md text-primary hover:text-primary-hover"
                    onClick={() => setIdMode(idMode === "id" ? "phone" : "id")}
                  >
                    {idMode === "id"
                      ? "Pay by phone number instead"
                      : "Use a UPI ID instead"}
                  </button>
                  <button
                    type="button"
                    className="ux4g-text-link-md text-primary hover:text-primary-hover"
                    onClick={() => setState("qr")}
                  >
                    Show QR instead
                  </button>
                </div>
              </div>

              <hr className="ux4g-divider-horizontal my-4" />

              {/* Payee + amount */}
              <p className="ux4g-label-l-default text-body">Paying</p>
              <p className="ux4g-body-m-strong mt-1 text-ink">
                SetuPay Synthetic Gateway
              </p>
              <p className="font-mono mt-2 text-4xl font-medium text-ink">
                {amount}
              </p>
              <p className="font-mono mt-1 text-sm text-muted">{challanId}</p>
              <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-rule pt-3">
                <span className="ux4g-label-m-default text-muted">
                  Paying from
                </span>
                <span className="ux4g-body-m-strong text-ink">
                  {payingFrom}
                </span>
              </div>

              <button
                type="button"
                onClick={() => goTo("waiting")}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-lg mt-4 w-full"
              >
                Verify and pay {amount}
              </button>
              <p className="ux4g-label-m-default mt-3 text-muted">
                No credential is collected here — your UPI PIN is entered only
                inside your UPI app, never on this page.
              </p>
            </div>
          )}

          {state === "qr" && (
            <div className="mt-4 text-center">
              <div className="text-ink">
                <FakeQr seed={`${challanId}:${amount}`} />
              </div>
              <p className="ux4g-body-m-strong mt-4 text-ink">
                SetuPay Synthetic Gateway
              </p>
              <p className="font-mono mt-1 text-3xl font-medium text-ink">
                {amount}
              </p>
              <p className="font-mono mt-1 text-sm text-muted">{challanId}</p>
              <p className="ux4g-label-m-default mt-3 text-muted">
                Representative QR. In a real build it would encode a upi://pay
                string that resolves nowhere and moves no money.
              </p>
              <button
                type="button"
                onClick={() => setState("confirm")}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md mt-4"
              >
                Back to details
              </button>
            </div>
          )}

          {state === "waiting" && (
            <div aria-live="polite" className="mt-4 text-center">
              <p className="font-mono text-4xl font-medium text-ink">
                {amount}
              </p>
              <p className="font-mono mt-1 text-sm text-muted">{challanId}</p>
              <p className="ux4g-body-m-strong cc-pulse mt-6 text-ink">
                Waiting for approval in {app.name}
              </p>
              <p className="ux4g-body-s-default mt-1 text-body">
                Open {app.name} on your phone and approve the request from{" "}
                {payingFrom}.
              </p>
              <p className="font-mono mt-4 text-lg text-body">{mmss}</p>
              <p className="ux4g-label-m-default mt-4 text-muted">
                Your UPI PIN belongs in {app.name}, not here — this page never
                asks for it.
              </p>
            </div>
          )}

          {state === "processing" && (
            <div aria-live="polite" className="mt-6 text-center">
              <span
                className="ux4g-spinner-primary-full ux4g-spinner-lg"
                role="status"
                aria-label="Processing payment"
              ></span>
              <p className="font-mono mt-4 text-4xl font-medium text-ink">
                {amount}
              </p>
              <p className="ux4g-body-m-strong mt-3 text-ink">
                Confirming with SetuPay…
              </p>
              <p className="ux4g-label-m-default mt-1 text-muted">
                Taking you to the result.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
