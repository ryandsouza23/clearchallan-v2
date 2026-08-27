"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  Card payment form. Looks like a complete checkout but CANNOT accept a
  real card, by design:
  - only the fixed non-routable test card validates
      4111 1111 1111 1111 · 12/29 · Rukmini Kulkarni · CVV "···"
  - the CVV that validates is the literal mask "···" — three real digits
    are never a valid value here;
  - nothing is ever transmitted: there is no fetch/XHR/form action in this
    file, and validation is pure client-side string comparison;
  - after "payment", bank authorisation is a HANDOFF (approval happens in
    the bank's own app/SMS) — no bank login, no OTP input is rendered.
*/

const TEST = {
  number: "4111111111111111",
  expiry: "12/29",
  name: "rukmini kulkarni",
  cvv: "···",
};

type Stage = "form" | "authorising" | "processing";

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function CardPaymentForm({
  regNo,
  challanId,
  amount,
}: {
  regNo: string;
  challanId: string;
  amount: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const resultHref = `/pay/result?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`;

  useEffect(() => {
    if (stage !== "authorising") return;
    const t = setTimeout(() => setStage("processing"), 4200);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "processing") return;
    const t = setTimeout(() => router.push(resultHref), 2600);
    return () => clearTimeout(t);
  }, [stage, router, resultHref]);

  function useTestCard() {
    setNumber(formatCardNumber(TEST.number));
    setExpiry(TEST.expiry);
    setName("Rukmini Kulkarni");
    setCvv(TEST.cvv);
    setErrors([]);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // never submitted anywhere
    const bad: string[] = [];
    if (number.replace(/\s/g, "") !== TEST.number) bad.push("number");
    if (expiry !== TEST.expiry) bad.push("expiry");
    if (name.trim().toLowerCase() !== TEST.name) bad.push("name");
    if (cvv !== TEST.cvv) bad.push("cvv");
    setErrors(bad);
    if (bad.length === 0) setStage("authorising");
  }

  const err = (field: string) => errors.includes(field);

  if (stage === "authorising") {
    return (
      <div aria-live="polite" className="ux4g-card ux4g-card-outline ux4g-card-vertical">
        <div className="ux4g-card-body text-center">
          <Ux4gIcon name="account_balance" className="ux4g-fs-24 text-primary" />
          <p className="font-mono mt-3 text-4xl font-medium text-ink">
            {amount}
          </p>
          <p className="ux4g-body-m-strong cc-pulse mt-4 text-ink">
            Authorising with your bank…
          </p>
          <p className="ux4g-body-s-default mx-auto mt-2 max-w-[40ch] text-body">
            Your bank confirms this payment in its own app or by SMS — the
            way 3-D Secure works. Nothing more is entered on this page.
          </p>
        </div>
      </div>
    );
  }

  if (stage === "processing") {
    return (
      <div aria-live="polite" className="ux4g-card ux4g-card-outline ux4g-card-vertical">
        <div className="ux4g-card-body text-center">
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
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="ux4g-card ux4g-card-outline ux4g-card-vertical">
        <div className="ux4g-card-body">
          <div className="flex items-start justify-between gap-3">
            <h2 className="ux4g-title-s-strong flex items-center gap-2 text-ink">
              <Ux4gIcon name="credit_card" className="text-primary" /> Card
              details
            </h2>
            <button
              type="button"
              onClick={useTestCard}
              className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
            >
              Use test card
            </button>
          </div>

          {errors.length > 0 && (
            <div className="ux4g-alert ux4g-alert-info mt-3" role="status">
              <Ux4gIcon name="info" className="ux4g-alert-icon text-status-neutral-text" />
              <div className="ux4g-alert-content">
                <p className="ux4g-alert-title">
                  Only the test card validates here
                </p>
                <p className="ux4g-alert-message">
                  That&apos;s deliberate — this prototype must never be able
                  to accept a real card. Press &ldquo;Use test card&rdquo; and
                  the payment will go through.
                </p>
              </div>
            </div>
          )}

          <div
            className={`ux4g-input-container ux4g-input-md mt-4 ${err("number") ? "ux4g-input-error" : "ux4g-input-default"}`}
          >
            <label className="ux4g-label-m-default" htmlFor="cardNumber">
              Card number
            </label>
            <div className="ux4g-input">
              <input
                className="ux4g-input-input font-mono"
                id="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                value={number}
                onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                aria-invalid={err("number")}
                aria-describedby={err("number") ? "cardNumber-err" : undefined}
              />
            </div>
            {err("number") && (
              <div className="ux4g-input-helper" id="cardNumber-err">
                <Ux4gIcon name="info" className="ux4g-input-helper-icon" />
                <span className="ux4g-input-helper-text">
                  Not the test number — try 4111 1111 1111 1111.
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div
              className={`ux4g-input-container ux4g-input-md ${err("expiry") ? "ux4g-input-error" : "ux4g-input-default"}`}
            >
              <label className="ux4g-label-m-default" htmlFor="cardExpiry">
                Expiry
              </label>
              <div className="ux4g-input">
                <input
                  className="ux4g-input-input font-mono"
                  id="cardExpiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  aria-invalid={err("expiry")}
                />
              </div>
              {err("expiry") && (
                <div className="ux4g-input-helper">
                  <Ux4gIcon name="info" className="ux4g-input-helper-icon" />
                  <span className="ux4g-input-helper-text">Use 12/29.</span>
                </div>
              )}
            </div>
            <div
              className={`ux4g-input-container ux4g-input-md ${err("cvv") ? "ux4g-input-error" : "ux4g-input-default"}`}
            >
              <label className="ux4g-label-m-default" htmlFor="cardCvv">
                CVV
              </label>
              <div className="ux4g-input">
                <input
                  className="ux4g-input-input font-mono"
                  id="cardCvv"
                  type="text"
                  autoComplete="off"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  aria-invalid={err("cvv")}
                />
              </div>
              {err("cvv") && (
                <div className="ux4g-input-helper">
                  <Ux4gIcon name="info" className="ux4g-input-helper-icon" />
                  <span className="ux4g-input-helper-text">
                    The test card&apos;s CVV stays masked: ···
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`ux4g-input-container ux4g-input-md mt-3 ${err("name") ? "ux4g-input-error" : "ux4g-input-default"}`}
          >
            <label className="ux4g-label-m-default" htmlFor="cardName">
              Cardholder name
            </label>
            <div className="ux4g-input">
              <input
                className="ux4g-input-input"
                id="cardName"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={err("name")}
              />
            </div>
            {err("name") && (
              <div className="ux4g-input-helper">
                <Ux4gIcon name="info" className="ux4g-input-helper-icon" />
                <span className="ux4g-input-helper-text">
                  The test card belongs to Rukmini Kulkarni.
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="ux4g-btn ux4g-btn-primary ux4g-btn-lg mt-4 w-full"
          >
            Pay {amount}
          </button>

          <p className="ux4g-label-m-default mt-3 text-muted">
            These values are fixed because a prototype must never be capable
            of accepting a real card. Nothing you type here is sent anywhere.
          </p>
        </div>
      </div>
    </form>
  );
}
