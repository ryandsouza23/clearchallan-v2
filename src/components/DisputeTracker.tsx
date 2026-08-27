"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  DISPUTES,
  SEEDED_TODAY,
  display,
  normalise,
} from "@/lib/challans";
import { isOwnershipProven, subscribeOwnership } from "@/lib/ownership";
import { ReadAloud } from "./ReadAloud";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  Dispute tracker. A dispute's history is private, so viewing it requires
  the SAME ownership proof as everything else — the /gate flow (DigiLocker /
  chassis+engine / OTP-last). Deliberately NOT a bare registered-mobile OTP:
  reusing /gate means an owner with a dead RC-linked number is never locked
  out. Dates are fictional, keyed to the seeded "today".
*/

export function DisputeTracker({ regNo }: { regNo?: string }) {
  const router = useRouter();
  const [lookup, setLookup] = useState("");

  const proven = useSyncExternalStore(
    subscribeOwnership,
    () => (regNo ? isOwnershipProven(regNo) : false),
    () => false,
  );

  /* ---------- entry: which vehicle? ---------- */
  if (!regNo) {
    function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      const clean = lookup.trim();
      if (!clean) return;
      const target = `/dispute?regNo=${encodeURIComponent(clean.toUpperCase())}`;
      if (isOwnershipProven(clean)) {
        router.push(target);
      } else {
        router.push(
          `/gate?regNo=${encodeURIComponent(clean.toUpperCase())}&next=dispute`,
        );
      }
    }
    return (
      <form onSubmit={onSubmit} className="max-w-md">
        <div className="ux4g-input-container ux4g-input-lg ux4g-input-default">
          <label className="ux4g-label-l-default" htmlFor="disputeRegNo">
            Vehicle registration number
          </label>
          <div className="ux4g-input">
            <Ux4gIcon
              name="directions_car"
              className="ux4g-input-leading-icon"
            />
            <input
              className="ux4g-input-input font-mono uppercase placeholder:normal-case"
              id="disputeRegNo"
              type="text"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              aria-describedby="disputeRegNo-hint"
            />
          </div>
          <div className="ux4g-input-helper">
            <Ux4gIcon name="info" className="ux4g-input-helper-icon" />
            <span className="ux4g-input-helper-text" id="disputeRegNo-hint">
              A dispute&apos;s history is private — you&apos;ll be asked to
              prove ownership first (DigiLocker, chassis + engine, or OTP).
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="ux4g-btn ux4g-btn-primary ux4g-btn-lg mt-3 w-full sm:w-auto"
        >
          Track dispute
        </button>
      </form>
    );
  }

  /* ---------- gate check ---------- */
  if (!proven) {
    return (
      <div className="ux4g-card ux4g-card-outline ux4g-card-vertical max-w-md">
        <div className="ux4g-card-body">
          <h2 className="ux4g-title-s-strong flex items-center gap-2 text-ink">
            <Ux4gIcon name="lock" className="text-muted" /> Ownership proof
            needed
          </h2>
          <p className="ux4g-body-m-default mt-2 text-body">
            The dispute history for{" "}
            <span className="font-mono text-ink">{display(regNo)}</span> is
            visible only to its owner.
          </p>
          <Link
            href={`/gate?regNo=${encodeURIComponent(regNo)}&next=dispute`}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-3 inline-flex"
          >
            Prove it&apos;s your vehicle
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- dispute view ---------- */
  const dispute = DISPUTES[normalise(regNo)];

  if (!dispute) {
    return (
      <div className="max-w-md">
        <p className="ux4g-body-l-default text-body">
          No dispute on record for{" "}
          <span className="font-mono text-ink">{display(regNo)}</span> in this
          prototype&apos;s sample set.
        </p>
        <p className="mt-4">
          <Link
            className="ux4g-text-link-md"
            href={`/challans?regNo=${encodeURIComponent(regNo)}`}
          >
            See the vehicle&apos;s challans instead
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div id="dispute-view">
      <div className="flex justify-end">
        <ReadAloud targetId="dispute-view" />
      </div>

      {/* Header: refs + current state */}
      <div className="ux4g-card ux4g-card-solid ux4g-card-vertical ux4g-shadow-l1 mt-3">
        <div className="ux4g-card-body">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-lg font-medium text-ink">
                {display(regNo)}
              </p>
              <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                <div className="flex gap-2">
                  <dt className="ux4g-label-m-default text-muted">Dispute</dt>
                  <dd className="ux4g-label-m-default font-mono text-body">
                    {dispute.ref}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="ux4g-label-m-default text-muted">Challan</dt>
                  <dd className="ux4g-label-m-default font-mono text-body">
                    {dispute.challanId}
                  </dd>
                </div>
              </dl>
            </div>
            <span className="flex items-center gap-2">
              <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-s">
                Sample data
              </span>
              <span className="ux4g-tag ux4g-tag-tonal-warning">
                {dispute.statusLabel}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section
        aria-label="Dispute history"
        className="ux4g-card ux4g-card-outline ux4g-card-vertical mt-4"
      >
        <div className="ux4g-card-body">
          <h2 className="ux4g-title-s-strong text-ink">What has happened</h2>
          <ol className="ux4g-journey-timeline ux4g-journey-timeline--vertical mt-4 list-none">
            {dispute.timeline.map((entry) => (
              <li
                key={entry.title}
                className={`ux4g-journey-step ${
                  entry.state === "done"
                    ? "ux4g-journey-step-completed"
                    : "ux4g-journey-step-active"
                }`}
              >
                <div className="ux4g-journey-indicator">
                  <Ux4gIcon
                    name={entry.state === "done" ? "check" : "gavel"}
                  />
                </div>
                <div className="ux4g-journey-card ux4g-journey-card--standard">
                  <div className="ux4g-journey-info">
                    <span className="ux4g-journey-date font-mono">
                      {entry.date}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="ux4g-journey-title">{entry.title}</span>
                      {entry.detail && (
                        <span className="ux4g-journey-description">
                          {entry.detail}
                        </span>
                      )}
                    </span>
                    {entry.state === "done" ? (
                      <span className="ux4g-tag ux4g-tag-tonal-success ux4g-tag-s">
                        Completed
                      </span>
                    ) : (
                      <span className="ux4g-tag ux4g-tag-tonal-warning ux4g-tag-s">
                        Current stage
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="ux4g-label-m-default mt-3 text-muted">
            Expected decision by{" "}
            <span className="font-mono text-body">{dispute.expectedBy}</span>{" "}
            — two weeks from this prototype&apos;s seeded &ldquo;today&rdquo;
            (<span className="font-mono">{SEEDED_TODAY}</span>).
          </p>
        </div>
      </section>

      {/* Virtual court explainer — accurate and general */}
      <div className="ux4g-alert ux4g-alert-info mt-4" role="note">
        <Ux4gIcon
          name="gavel"
          className="ux4g-alert-icon text-status-neutral-text"
        />
        <div className="ux4g-alert-content">
          <p className="ux4g-alert-title">
            What &ldquo;Virtual Court&rdquo; means
          </p>
          <p className="ux4g-alert-message">
            A virtual court is a real court that handles traffic challans
            entirely online — an initiative of the Supreme Court&apos;s
            e-Committee, run with state governments. A magistrate reviews the
            e-challan digitally and a notice goes to the vehicle&apos;s
            registered contact with a proposed fine. You can accept and pay
            online, or contest — contesting moves the case to a regular court
            hearing. Which challans go to virtual court, and the amounts
            involved, vary by state.
          </p>
        </div>
      </div>

      <p className="ux4g-label-m-default mt-6 text-muted">
        All records shown are invented for design purposes.
      </p>
    </div>
  );
}
