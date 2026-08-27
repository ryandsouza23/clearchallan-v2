import type { Metadata } from "next";
import Link from "next/link";
import { ReadAloud } from "@/components/ReadAloud";
import { Ux4gIcon } from "@/components/Ux4gIcon";

export const metadata: Metadata = {
  title: "What's real",
};

export default function WhatIsRealPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12" id="what-is-real">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="ux4g-heading-l-strong text-ink">
          What&apos;s real here
        </h1>
        <ReadAloud targetId="what-is-real" />
      </div>
      <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
        Almost nothing — and that&apos;s the point. This page says exactly
        what ClearChallan is, what it fakes, and where the real systems it
        imitates fall short.
      </p>

      {/* What it is */}
      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">
          What ClearChallan is
        </h2>
        <p className="ux4g-body-m-default mt-3 max-w-[60ch] text-body">
          An independent design prototype. It is not a government service, it
          holds no real records, and it is not affiliated with UX4G, NeGD, or
          the Government of India. It is built <em>to</em> the UX4G design
          standard — the public design system for Indian government services —
          to show what a citizen-first challan experience could feel like.
        </p>
      </section>

      {/* Synthetic */}
      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">
          Everything you see is invented
        </h2>
        <p className="ux4g-body-m-default mt-3 max-w-[60ch] text-body">
          Every vehicle, registration plate, challan, amount, RC detail,
          dispute, reference number, and date on this site is synthetic. No
          lookup touches a real database, and no page can tell you anything
          about a real vehicle.
        </p>
      </section>

      {/* Simulated */}
      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">
          What&apos;s simulated — and cannot be real here
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="ux4g-table ux4g-table-m ux4g-table-column-dividers min-w-[34rem]">
            <thead>
              <tr>
                <th scope="col">On this site</th>
                <th scope="col">In the real world</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  The DigiLocker handoff is a timed animation. We are not an
                  onboarded DigiLocker requester — nothing is fetched.
                </td>
                <td>
                  DigiLocker issues real documents to registered requesters
                  after the citizen consents inside DigiLocker.
                </td>
              </tr>
              <tr>
                <td>
                  Aadhaar is never captured, verified, or even asked for —
                  we don&apos;t do it at all.
                </td>
                <td>
                  Aadhaar verification happens inside DigiLocker&apos;s own
                  flow, never on a third-party page.
                </td>
              </tr>
              <tr>
                <td>
                  SetuPay is a synthetic gateway. No money moves, ever.
                </td>
                <td>
                  Real challans are paid through authorised payment gateways
                  to the treasury.
                </td>
              </tr>
              <tr>
                <td>
                  The card form validates only one fixed test card and
                  transmits nothing — it cannot accept a real card.
                </td>
                <td>
                  Real card entry happens on a PCI-compliant gateway page
                  with bank authorisation.
                </td>
              </tr>
              <tr>
                <td>
                  The payment QR is a decorative pattern that resolves
                  nowhere.
                </td>
                <td>A real UPI QR encodes a payee and amount.</td>
              </tr>
              <tr>
                <td>The OTP is a mock — always 000000.</td>
                <td>Real OTPs are generated and delivered per attempt.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Honest limitations */}
      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">
          Limitations we&apos;re honest about
        </h2>
        <ul className="mt-3 grid max-w-[62ch] gap-3">
          <li className="ux4g-body-m-default border-l-2 border-rule pl-4 text-body">
            DigiLocker still needs an active Aadhaar-linked mobile — it moves
            the dead-number dependency rather than removing it. That&apos;s
            why chassis + engine numbers are the floor: they work when even
            that number is dead.
          </li>
          <li className="ux4g-body-m-default border-l-2 border-rule pl-4 text-body">
            There are no scheduled or background jobs anywhere. Status
            rechecks happen only when you press the button — the interface
            never claims otherwise.
          </li>
          <li className="ux4g-body-m-default border-l-2 border-rule pl-4 text-body">
            Net banking, IMPS and NEFT are presented as one family and map to
            a single method code at submission — the split is informative,
            not mechanical.
          </li>
        </ul>
      </section>

      {/* Where the real systems fall short */}
      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">
          Where the real systems miss their own standard
        </h2>
        <div className="ux4g-alert ux4g-alert-info mt-4" role="note">
          <Ux4gIcon
            name="info"
            className="ux4g-alert-icon text-status-neutral-text"
          />
          <div className="ux4g-alert-content">
            <p className="ux4g-alert-title">
              Two findings from building this prototype
            </p>
            <p className="ux4g-alert-message">
              UX4G&apos;s own dark-mode warning colours pair at 3.58:1 —
              below the WCAG 2.1 AA minimum of 4.5:1 that UX4G itself
              targets. This prototype substitutes a darker step from
              UX4G&apos;s own palette (≈5:1) and documents the change. And in
              our review, official e-challan pages miss checkpoints of GIGW
              3.0 — India&apos;s own web guidelines — in areas like form
              labelling and visible focus. Specifics vary by page and change
              as the portals update; the point is general: the standard
              exists, and following it is the fix.
            </p>
          </div>
        </div>
      </section>

      {/* Virtual courts are real */}
      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">
          One thing that is real: Virtual Courts
        </h2>
        <p className="ux4g-body-m-default mt-3 max-w-[60ch] text-body">
          Virtual Courts — courts that handle traffic challans entirely
          online — are a real initiative of the Supreme Court&apos;s
          e-Committee, run with state governments. Which challans go there,
          and the amounts involved, vary by state. The dispute flow here
          imitates that process with invented data.
        </p>
      </section>

      <hr className="ux4g-divider-horizontal my-12" />
      <p className="ux4g-body-m-default text-body">
        How this prototype supports assistive tech is documented on the{" "}
        <Link className="ux4g-text-link-md" href="/accessibility">
          accessibility page
        </Link>
        .
      </p>
    </div>
  );
}
