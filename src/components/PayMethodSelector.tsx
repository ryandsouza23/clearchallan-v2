"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  UX4G "Payment Method" pattern (Payment & Transactions), adapted:
  - the pattern's "Powered by Digital India" footer logo is excluded
    (identity guard) — the payee is named in the fee summary instead;
  - the pattern's card-brand copy ("Visa, MasterCard, RuPay") is replaced
    with brand-free wording;
  - IMPS and NEFT are nested under Net banking, not top-level methods.
*/

type MethodId = "upi" | "card" | "netbanking";
type Rail = "portal" | "imps" | "neft";

const METHODS: {
  id: MethodId;
  icon: string;
  label: string;
  line: string;
}[] = [
  {
    id: "upi",
    icon: "qr_code",
    label: "Pay with UPI",
    line: "Pay from a UPI app, ID, phone number or QR.",
  },
  {
    id: "card",
    icon: "credit_card",
    label: "Debit or credit card",
    line: "Enter card details, authorised by your bank.",
  },
  {
    id: "netbanking",
    icon: "account_balance",
    label: "Net banking",
    line: "Pay from your bank's site. Includes IMPS and NEFT.",
  },
];

const RAILS: { id: Rail; label: string; line: string }[] = [
  {
    id: "portal",
    label: "Your bank's site",
    line: "Log in and approve the payment there.",
  },
  { id: "imps", label: "IMPS", line: "Instant transfer, any time." },
  { id: "neft", label: "NEFT", line: "Batched transfer, settles in hours." },
];

export function PayMethodSelector({
  regNo,
  challanId,
  amount,
}: {
  regNo: string;
  challanId: string;
  amount: string;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<MethodId>("upi");
  const [rail, setRail] = useState<Rail>("portal");

  const query = `?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`;
  const href =
    method === "netbanking"
      ? `/pay/netbanking${query}&rail=${rail}`
      : `/pay/${method}${query}`;
  const continueLabel =
    method === "upi"
      ? "Continue with UPI"
      : method === "card"
        ? "Continue with card"
        : "Continue with net banking";

  return (
    <div>
      <ul className="ux4g-list ux4g-list-default ux4g-list-m">
        {METHODS.map((m) => (
          <li key={m.id} className="ux4g-list-item flex flex-col items-stretch">
            <label className="ux4g-list-item-row flex cursor-pointer items-center gap-3">
              <span className="ux4g-list-item-start flex items-center gap-3">
                <span className="ux4g-radio ux4g-radio-md ux4g-w-auto">
                  <input
                    className="ux4g-radio-input"
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                  />
                  <span className="ux4g-radio-control">
                    <span className="ux4g-radiomark"></span>
                  </span>
                </span>
                <Ux4gIcon name={m.icon} className="ux4g-fs-24 text-primary" />
                <span className="flex flex-col text-left">
                  <span className="ux4g-body-m-strong text-ink">{m.label}</span>
                  <span className="ux4g-body-s-default text-body">
                    {m.line}
                  </span>
                </span>
              </span>
            </label>

            {/* IMPS / NEFT live under Net banking, never as top-level methods */}
            {m.id === "netbanking" && method === "netbanking" && (
              <fieldset className="mt-2 mb-2 ml-12 border-l-2 border-rule pl-4">
                <legend className="ux4g-label-m-default py-1 text-muted">
                  How the money moves
                </legend>
                {RAILS.map((r) => (
                  <label
                    key={r.id}
                    className="flex cursor-pointer items-center gap-3 py-2"
                  >
                    <span className="ux4g-radio ux4g-radio-sm ux4g-w-auto">
                      <input
                        className="ux4g-radio-input"
                        type="radio"
                        name="netbankingRail"
                        value={r.id}
                        checked={rail === r.id}
                        onChange={() => setRail(r.id)}
                      />
                      <span className="ux4g-radio-control">
                        <span className="ux4g-radiomark"></span>
                      </span>
                    </span>
                    <span className="flex flex-col">
                      <span className="ux4g-label-l-default text-ink">
                        {r.label}
                      </span>
                      <span className="ux4g-label-m-default text-muted">
                        {r.line}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => router.push(href)}
        className="ux4g-btn ux4g-btn-primary ux4g-btn-lg mt-6 w-full sm:w-auto"
      >
        {continueLabel} · {amount}
      </button>

      <p className="ux4g-label-m-default mt-4 text-muted">
        No card number, UPI ID or PIN is entered on ClearChallan without you
        choosing a method first.
      </p>
    </div>
  );
}
