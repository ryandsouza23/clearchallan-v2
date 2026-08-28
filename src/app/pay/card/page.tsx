import type { Metadata } from "next";
import Link from "next/link";
import { CardPaymentForm } from "@/components/CardPaymentForm";
import { OwnershipGuard } from "@/components/OwnershipGuard";
import { display, findChallan } from "@/lib/challans";

export const metadata: Metadata = {
  title: "Pay by card",
};

export default async function PayCardPage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string; challan?: string }>;
}) {
  const { regNo, challan: challanId } = await searchParams;
  const challan = regNo && challanId ? findChallan(regNo, challanId) : null;

  if (!challan || !regNo) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="ux4g-heading-m-strong text-ink">
          Nothing to pay here yet
        </h1>
        <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
          This card screen needs a challan to work from, and none matched
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
      <h1 className="ux4g-heading-l-strong text-ink">Debit or credit card</h1>

      <section
        aria-label="Payment summary"
        className="ux4g-card ux4g-card-solid ux4g-card-vertical ux4g-shadow-l1 mt-6"
      >
        <div className="ux4g-card-body">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div>
              <p className="ux4g-label-m-default text-muted">Paying to</p>
              <p className="ux4g-body-m-strong mt-1 text-ink">
                SetuPay Synthetic Gateway
              </p>
              <p className="font-mono mt-1 text-sm text-muted">
                {shown} · {challan.id}
              </p>
            </div>
            <p className="font-mono text-3xl font-medium text-ink">
              {challan.amount}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <OwnershipGuard regNo={shown} challanId={challan.id} next="pay">
        <CardPaymentForm
          regNo={shown}
          challanId={challan.id}
          amount={challan.amount}
        />
        </OwnershipGuard>
      </div>
    </div>
  );
}
