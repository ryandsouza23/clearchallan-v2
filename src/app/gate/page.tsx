import type { Metadata } from "next";
import Link from "next/link";
import { GateFlow } from "@/components/GateFlow";
import { display } from "@/lib/challans";

export const metadata: Metadata = {
  title: "Prove ownership",
};

/*
  UX4G Identity & Access sign-in layout (two-panel: brand sidebar + form
  column), rebuilt natively. Deliberately excluded from the pattern:
  the National Emblem, the "Powered by Digital India" logo, "Sign in with
  Aadhaar", and the trust statistics — this is an independent prototype
  with no accounts; "login" here is proving ownership of a vehicle.
*/

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string; challan?: string; next?: string }>;
}) {
  const { regNo, challan, next } = await searchParams;

  return (
    <div className="ux4g-identity-access-container">
      <div className="ux4g-identity-access-layout flex-col lg:flex-row">
        {/* Sidebar — hidden on mobile, like the pattern */}
        <div className="ux4g-identity-access-sidebar cc-band hidden w-2/5 flex-col justify-between p-8 lg:flex">
          <div className="ux4g-sidebar-top">
            <h2 className="ux4g-heading-l-strong max-w-[16ch] text-(--ux4g-text-neutral-inverse)">
              One proof opens everything that&apos;s yours
            </h2>
            <p className="ux4g-body-l-default mt-4 max-w-[38ch] text-(--ux4g-text-neutral-inverse)">
              Photos, exact locations, payment and disputes unlock once you
              prove the vehicle is yours — and the proof holds for your whole
              session.
            </p>
          </div>
          <div className="ux4g-sidebar-bottom flex gap-6">
            <div className="ux4g-sidebar-stat flex flex-col gap-1">
              <span className="ux4g-label-m-default tracking-[0.14em] text-(--ux4g-text-neutral-inverse) uppercase">
                Ways to prove it
              </span>
              <span className="ux4g-label-l-default text-(--ux4g-text-neutral-inverse)">
                Three — best first
              </span>
            </div>
            <div className="ux4g-sidebar-stat flex flex-col gap-1">
              <span className="ux4g-label-m-default tracking-[0.14em] text-(--ux4g-text-neutral-inverse) uppercase">
                Accounts created
              </span>
              <span className="ux4g-label-l-default text-(--ux4g-text-neutral-inverse)">
                None — session only
              </span>
            </div>
          </div>
          {/* Decorative rings from the pattern (abstract, no identity) */}
          <div className="ux4g-sidebar-ring ux4g-ring-1" aria-hidden="true"></div>
          <div
            className="ux4g-sidebar-ring ux4g-ring-2 ux4g-sidebar-ring-bottom"
            aria-hidden="true"
          ></div>
        </div>

        {/* Form column */}
        <div className="ux4g-identity-access-column">
          <div className="ux4g-form-box mx-auto max-w-2xl py-8">
            {!regNo ? (
              <>
                <h1 className="ux4g-heading-m-strong text-ink">
                  Which vehicle is yours?
                </h1>
                <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
                  The ownership gate needs a vehicle to work from. Look one up
                  first, then choose Pay, Dispute, or a gated detail.
                </p>
                <p className="mt-6">
                  <Link className="ux4g-text-link-md" href="/">
                    Check a vehicle
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h1 className="ux4g-heading-m-strong text-ink">
                  Prove it&apos;s your vehicle
                </h1>
                <p className="ux4g-body-m-default mt-2 max-w-[56ch] text-body">
                  Everything private about{" "}
                  <span className="font-mono text-ink">{display(regNo)}</span>{" "}
                  opens only to its owner. Three ways to prove it, best first
                  — all illustrative.
                </p>
                <div className="mt-6">
                  <GateFlow
                    regNo={display(regNo)}
                    challanId={challan}
                    next={next ?? "view"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
