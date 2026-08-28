"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isOwnershipProven, subscribeOwnership } from "@/lib/ownership";
import { UnlockedEvidence } from "./EvidenceUnlocked";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  The gated photo + exact-location block on a challan card. Locked until
  ownership is proven for this session via /gate. No map or photo is ever
  rendered while locked; unlocked, both are inline SVGs — nothing external.
*/
export function GatedDetails({
  regNo,
  challanId,
  area,
  coords,
  pin,
  date,
}: {
  regNo: string;
  challanId: string;
  area: string;
  coords: string;
  pin: { x: number; y: number };
  date: string;
}) {
  const proven = useSyncExternalStore(
    subscribeOwnership,
    () => isOwnershipProven(regNo),
    () => false,
  );

  if (proven) {
    return (
      <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-4">
        <div className="ux4g-card-body">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Ux4gIcon
                name="lock_open"
                className="ux4g-fs-20 text-status-success-text"
              />
              <div>
                <p className="ux4g-label-l-default text-ink">
                  Unlocked — camera photo and exact location
                </p>
                <p className="ux4g-label-m-default mt-1 text-muted">
                  Ownership proven — resets when you refresh.
                </p>
              </div>
            </div>
            <span className="ux4g-tag ux4g-tag-tonal-success ux4g-tag-s">
              <Ux4gIcon name="verified" /> Owner
            </span>
          </div>
          <UnlockedEvidence
            regNo={regNo}
            area={area}
            coords={coords}
            pin={pin}
            date={date}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-4">
      <div className="ux4g-card-body">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Ux4gIcon name="lock" className="ux4g-fs-20 text-muted" />
            <div>
              <p className="ux4g-label-l-default text-ink">
                Camera photo and exact location
              </p>
              <p className="ux4g-label-m-default mt-1 text-muted">
                Visible only to the vehicle&apos;s owner.
              </p>
            </div>
          </div>
          <Link
            href={`/gate?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}&next=view`}
            className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
          >
            Login to Verify
          </Link>
        </div>
      </div>
    </div>
  );
}
