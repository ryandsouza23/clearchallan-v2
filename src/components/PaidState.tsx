"use client";

import { useEffect, useSyncExternalStore } from "react";
import { isChallanPaid, markChallanPaid, subscribePaid } from "@/lib/payments";

/* Marks a challan paid — rendered by the success payment result. */
export function MarkPaid({ challanId }: { challanId: string }) {
  useEffect(() => {
    markChallanPaid(challanId);
  }, [challanId]);
  return null;
}

/* Status tag that upgrades to Paid once the challan is settled locally. */
export function ChallanStatusTag({
  challanId,
  seededLabel,
  seededTag,
}: {
  challanId: string;
  seededLabel: string;
  seededTag: string;
}) {
  const paid = useSyncExternalStore(
    subscribePaid,
    () => isChallanPaid(challanId),
    () => false,
  );
  if (paid) {
    return <span className="ux4g-tag ux4g-tag-tonal-success">Paid</span>;
  }
  return <span className={seededTag}>{seededLabel}</span>;
}

/* Header summary line, recomputed as challans get paid. */
export function DueSummary({
  challans,
}: {
  challans: { id: string; amount: string; due: boolean }[];
}) {
  const paidKey = useSyncExternalStore(
    subscribePaid,
    () => challans.map((c) => (isChallanPaid(c.id) ? "1" : "0")).join(""),
    () => challans.map(() => "0").join(""),
  );
  const stillDue = challans.filter(
    (c, i) => c.due && paidKey[i] === "0",
  );
  const paise = stillDue.reduce(
    (sum, c) =>
      sum + Math.round(parseFloat(c.amount.replace(/[₹,]/g, "")) * 100),
    0,
  );
  const total = `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <p className="ux4g-body-l-default mt-4 text-body">
      {challans.length} challans on this vehicle ·{" "}
      {stillDue.length > 0 ? (
        <>
          <span className="font-mono font-medium text-ink">{total}</span> due
          across {stillDue.length}.
        </>
      ) : (
        <span className="text-status-success-text">nothing due.</span>
      )}
    </p>
  );
}
