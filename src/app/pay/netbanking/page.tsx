import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Net banking",
};

export default function PayNetbankingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="ux4g-heading-l-strong text-ink">Net banking</h1>
      <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
        The net banking flow — your bank&apos;s site, IMPS or NEFT — is coming
        in a later step. Nothing is entered or charged here yet.
      </p>
    </div>
  );
}
