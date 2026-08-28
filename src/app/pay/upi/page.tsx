import type { Metadata } from "next";
import Link from "next/link";
import { OwnershipGuard } from "@/components/OwnershipGuard";
import { UpiSheet } from "@/components/UpiSheet";
import { display, findChallan } from "@/lib/challans";

export const metadata: Metadata = {
  title: "Pay with UPI",
};

export default async function PayUpiPage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string; challan?: string; rail?: string }>;
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
          This UPI sheet needs a challan to work from, and none matched this
          link. Look the vehicle up first, then choose Pay on a challan.
        </p>
        <p className="mt-6">
          <Link className="ux4g-text-link-md" href="/">
            Check a vehicle
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="ux4g-heading-l-strong text-ink">Pay with UPI</h1>
      <p className="ux4g-body-m-default mt-2 max-w-[56ch] text-body">
        A focused payment surface. Every app here is invented, and nothing on
        this page moves money.
      </p>
      <div className="mt-6">
        <OwnershipGuard regNo={display(regNo)} challanId={challan.id} next="pay">
        <UpiSheet
          regNo={display(regNo)}
          challanId={challan.id}
          amount={challan.amount}
        />
        </OwnershipGuard>
      </div>
    </div>
  );
}
