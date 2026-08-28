"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isOwnershipProven, subscribeOwnership } from "@/lib/ownership";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  Client-side gate for owner-only pages. Ownership proof is in-memory and
  resets on refresh — so a reload on a payment page re-locks it and sends
  the visitor back through the ownership gate.
*/
export function OwnershipGuard({
  regNo,
  challanId,
  next,
  children,
}: {
  regNo: string;
  challanId?: string;
  next: string;
  children: React.ReactNode;
}) {
  const proven = useSyncExternalStore(
    subscribeOwnership,
    () => isOwnershipProven(regNo),
    () => false,
  );

  if (proven) return <>{children}</>;

  const gateHref = `/gate?regNo=${encodeURIComponent(regNo)}${
    challanId ? `&challan=${encodeURIComponent(challanId)}` : ""
  }&next=${next}`;

  return (
    <div className="ux4g-card ux4g-card-outline ux4g-card-vertical max-w-md">
      <div className="ux4g-card-body">
        <h2 className="ux4g-title-s-strong flex items-center gap-2 text-ink">
          <Ux4gIcon name="lock" className="text-muted" /> Ownership proof
          needed
        </h2>
        <p className="ux4g-body-m-default mt-2 text-body">
          Paying for <span className="font-mono text-ink">{regNo}</span> is
          for its owner only — and proof resets when the page reloads.
        </p>
        <Link
          href={gateHref}
          className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-3 inline-flex"
        >
          Prove it&apos;s your vehicle
        </Link>
      </div>
    </div>
  );
}
