import type { Metadata } from "next";
import { DisputeTracker } from "@/components/DisputeTracker";

export const metadata: Metadata = {
  title: "Track a dispute",
};

export default async function DisputePage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string }>;
}) {
  const { regNo } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="ux4g-heading-l-strong text-ink">Track a dispute</h1>
      <p className="ux4g-body-m-default mt-2 max-w-[56ch] text-body">
        Follow a contested challan from filing to decision. Dispute histories
        are private — proving ownership uses the same three routes as
        everything else.
      </p>
      <div className="mt-6">
        <DisputeTracker regNo={regNo} />
      </div>
    </div>
  );
}
