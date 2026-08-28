"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isOwnershipProven, subscribeOwnership } from "@/lib/ownership";
import { isChallanPaid, subscribePaid } from "@/lib/payments";

/*
  Pay / Dispute actions on a challan card. Once ownership is proven for
  this session, the gate hop is skipped and the buttons link straight to
  payment / dispute — proving once is enough.
*/
export function ChallanActions({
  regNo,
  challanId,
  amount,
}: {
  regNo: string;
  challanId: string;
  amount: string;
}) {
  const proven = useSyncExternalStore(
    subscribeOwnership,
    () => isOwnershipProven(regNo),
    () => false,
  );
  const paid = useSyncExternalStore(
    subscribePaid,
    () => isChallanPaid(challanId),
    () => false,
  );

  if (paid) {
    return (
      <p className="ux4g-label-l-default text-status-success-text">
        Paid — nothing due on this challan.
      </p>
    );
  }

  const gate = `/gate?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`;
  const payHref = proven
    ? `/pay?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`
    : `${gate}&next=pay`;
  const disputeHref = proven
    ? `/dispute?regNo=${encodeURIComponent(regNo)}`
    : `${gate}&next=dispute`;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={payHref} className="ux4g-btn ux4g-btn-primary ux4g-btn-md">
        Pay {amount}
      </Link>
      <Link
        href={disputeHref}
        className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
      >
        Dispute this challan
      </Link>
    </div>
  );
}
