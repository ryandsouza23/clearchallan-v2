import type { Metadata } from "next";
import Link from "next/link";
import { OwnershipGuard } from "@/components/OwnershipGuard";
import { PayMethodSelector } from "@/components/PayMethodSelector";
import { display, findChallan } from "@/lib/challans";

export const metadata: Metadata = {
  title: "Choose how to pay",
};

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string; challan?: string }>;
}) {
  const { regNo, challan: challanId } = await searchParams;
  const challan =
    regNo && challanId ? findChallan(regNo, challanId) : null;

  if (!challan || !regNo) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="ux4g-heading-m-strong text-ink">
          Nothing to pay here yet
        </h1>
        <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
          This payment screen needs a challan to work from, and none matched
          this link. Look the vehicle up first, then choose Pay on a challan.
        </p>
        <p className="mt-6">
          <Link className="ux4g-text-link-md" href="/">
            Check a vehicle
          </Link>
        </p>
      </div>
    );
  }

  const shown = display(regNo);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="ux4g-heading-l-strong text-ink">Choose how to pay</h1>

      <OwnershipGuard regNo={shown} challanId={challan.id} next="pay">

      {/* Fee Summary — who you're paying, for what, and how much */}
      <section
        aria-label="Fee summary"
        className="ux4g-card ux4g-card-solid ux4g-card-vertical ux4g-shadow-l1 mt-6"
      >
        <div className="ux4g-card-body">
          <div className="flex items-start justify-between gap-3">
            <h2 className="ux4g-title-s-strong text-ink">Fee summary</h2>
            <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-s">
              Sample data
            </span>
          </div>
          <dl className="mt-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
              <dt className="ux4g-body-m-default text-body">Paying to</dt>
              <dd className="ux4g-body-m-strong text-ink">
                SetuPay Synthetic Gateway
              </dd>
            </div>
            <hr className="ux4g-divider-horizontal" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
              <dt className="ux4g-body-m-default text-body">Vehicle</dt>
              <dd className="font-mono text-ink">{shown}</dd>
            </div>
            <hr className="ux4g-divider-horizontal" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
              <dt className="ux4g-body-m-default text-body">Challan</dt>
              <dd className="font-mono text-ink">{challan.id}</dd>
            </div>
            <hr className="ux4g-divider-horizontal" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
              <dt className="ux4g-body-m-default text-body">
                {challan.offence}
              </dt>
              <dd className="font-mono text-ink">{challan.amount}</dd>
            </div>
            <hr className="ux4g-divider-horizontal" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
              <dt className="ux4g-body-m-strong text-ink">Total</dt>
              <dd className="font-mono text-2xl font-medium text-ink">
                {challan.amount}
              </dd>
            </div>
          </dl>
          <p className="ux4g-label-m-default mt-1 text-muted">
            SetuPay is a synthetic gateway for this prototype. ClearChallan is
            only the tool — it never receives your money.
          </p>
        </div>
      </section>

      <h2 className="ux4g-heading-s-strong mt-8 text-ink">Payment method</h2>
      <div className="mt-3">
        <PayMethodSelector
          regNo={shown}
          challanId={challan.id}
          amount={challan.amount}
        />
      </div>
      </OwnershipGuard>
    </div>
  );
}
