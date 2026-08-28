import type { Metadata } from "next";
import Link from "next/link";
import { MarkPaid } from "@/components/PaidState";
import { ReceiptActions, RecheckStatus } from "@/components/ResultActions";
import { Ux4gIcon } from "@/components/Ux4gIcon";
import { display, findChallan } from "@/lib/challans";

export const metadata: Metadata = {
  title: "Payment result",
};

type Outcome = "success" | "declined" | "timeout" | "stuck";

type StepView = "done" | "warning" | "pending";

const STAGES = [
  { label: "Initiated", holder: "Gateway", line: "SetuPay opens the payment." },
  { label: "Debited", holder: "Your bank", line: "Your bank moves the money." },
  {
    label: "Confirmed",
    holder: "Treasury",
    line: "The treasury acknowledges receipt.",
  },
  {
    label: "Cleared",
    holder: "Challan",
    line: "The challan record is marked settled.",
  },
];

const TXN_REF = "SPX-2026-0824-004917";
const TREASURY_REF = "TRV-KA-26-118220";

/* The seeded stuck scenario. */
const STUCK = {
  regNo: "KA 25 XY 4567",
  challanId: "KA252026080200309",
  amount: "₹1,542.60",
};

const OUTCOMES: Record<
  Outcome,
  {
    steps: StepView[];
    stepStatus: string[];
    treasuryRef: string | null;
  }
> = {
  success: {
    steps: ["done", "done", "done", "done"],
    stepStatus: ["Completed", "Completed", "Completed", "Completed"],
    treasuryRef: TREASURY_REF,
  },
  declined: {
    steps: ["done", "pending", "pending", "pending"],
    stepStatus: ["Declined here", "Never reached", "Never reached", "Never reached"],
    treasuryRef: null,
  },
  timeout: {
    steps: ["warning", "pending", "pending", "pending"],
    stepStatus: ["Outcome unknown", "Unknown", "Not reached", "Not reached"],
    treasuryRef: null,
  },
  stuck: {
    steps: ["done", "done", "warning", "pending"],
    stepStatus: ["Completed", "Completed", "No callback", "Blocked"],
    treasuryRef: null,
  },
};

function StageStep({
  n,
  view,
  status,
}: {
  n: number;
  view: StepView;
  status: string;
}) {
  const stage = STAGES[n - 1];
  const li =
    view === "done"
      ? "ux4g-stepper-step ux4g-stepper-completed ux4g-stepper-done"
      : view === "warning"
        ? "ux4g-stepper-step ux4g-stepper-completed"
        : "ux4g-stepper-step ux4g-stepper-step-pending ux4g-stepper-completed";
  return (
    <li className={li}>
      {view === "done" ? (
        <span className="ux4g-stepper-head-icon ux4g-stepper-head-icon-active">
          {n}
        </span>
      ) : view === "warning" ? (
        <span className="ux4g-stepper-head-icon ux4g-stepper-warning-icon">
          {n}
        </span>
      ) : (
        <span className="ux4g-stepper-head-icon">{n}</span>
      )}
      <div className="ux4g-stepper-head">
        <span className="ux4g-label-l-default ux4g-stepper-label">
          {stage.label} · {stage.holder}
        </span>
        <span className="ux4g-stepper-description">{stage.line}</span>
        <span
          className={`ux4g-label-l-default ux4g-stepper-status ${
            view === "done" && status === "Completed"
              ? "ux4g-stepper-label-success"
              : view === "warning"
                ? "ux4g-stepper-warning"
                : ""
          }`}
        >
          {status}
        </span>
      </div>
    </li>
  );
}

export default async function PayResultPage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string; challan?: string; outcome?: string }>;
}) {
  const params = await searchParams;
  const outcome: Outcome = (
    ["success", "declined", "timeout", "stuck"] as const
  ).includes(params.outcome as Outcome)
    ? (params.outcome as Outcome)
    : "success";

  // The stuck preview always shows the seeded stuck scenario.
  const fromRecords =
    params.regNo && params.challan
      ? findChallan(params.regNo, params.challan)
      : null;
  const regNo =
    outcome === "stuck"
      ? STUCK.regNo
      : params.regNo
        ? display(params.regNo)
        : STUCK.regNo;
  const challanId =
    outcome === "stuck" ? STUCK.challanId : (fromRecords?.id ?? params.challan ?? STUCK.challanId);
  const amount =
    outcome === "stuck" ? STUCK.amount : (fromRecords?.amount ?? STUCK.amount);

  const cfg = OUTCOMES[outcome];
  const previewHref = (o: Outcome) => {
    const q = new URLSearchParams();
    if (params.regNo) q.set("regNo", params.regNo);
    if (params.challan) q.set("challan", params.challan);
    q.set("outcome", o);
    return `/pay/result?${q.toString()}`;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="ux4g-heading-l-strong text-ink">Payment result</h1>

      {/* Preview-only control */}
      <nav
        aria-label="Preview outcome"
        className="mt-4 flex flex-wrap items-center gap-2"
      >
        <span className="ux4g-label-m-default text-muted">Preview outcome</span>
        {(Object.keys(OUTCOMES) as Outcome[]).map((o) => (
          <Link
            key={o}
            href={previewHref(o)}
            aria-current={outcome === o ? "page" : undefined}
            className={`border px-2 py-1 text-sm ${
              outcome === o
                ? "border-primary bg-primary text-on-primary"
                : "border-rule bg-surface text-body hover:text-ink"
            }`}
          >
            {o}
          </Link>
        ))}
      </nav>

      {/* Outcome banner — each of the four reads differently on purpose */}
      <div className="mt-6">
        {outcome === "success" && <MarkPaid challanId={challanId} />}
        {outcome === "success" && (
          <div className="ux4g-alert ux4g-alert-success" role="status">
            <Ux4gIcon
              name="check_circle"
              className="ux4g-alert-icon text-status-success-text"
            />
            <div className="ux4g-alert-content">
              <p className="ux4g-alert-title">Paid and cleared</p>
              <p className="ux4g-alert-message">
                The treasury confirmed this payment and the challan is
                settled. This is the state most payments end in.
              </p>
            </div>
          </div>
        )}
        {outcome === "declined" && (
          <div className="border border-rule bg-surface-sunken p-4" role="status">
            <p className="ux4g-body-m-strong flex items-center gap-2 text-ink">
              <Ux4gIcon name="block" className="text-muted" /> Declined —
              nothing debited
            </p>
            <p className="ux4g-body-s-default mt-1 text-body">
              Your bank said no before any money moved. Nothing is at risk,
              and it&apos;s safe to retry with the same reference.
            </p>
          </div>
        )}
        {outcome === "timeout" && (
          <div className="ux4g-alert ux4g-alert-warning" role="status">
            <Ux4gIcon
              name="schedule"
              className="ux4g-alert-icon text-status-caution-text"
            />
            <div className="ux4g-alert-content">
              <p className="ux4g-alert-title">
                Outcome unknown — check before retrying
              </p>
              <p className="ux4g-alert-message">
                The gateway timed out while initiating. Money may or may not
                have left your account — check your account before paying
                again, and recheck here in 30 minutes. If it did go through,
                it reverses by the same route.
              </p>
            </div>
          </div>
        )}
        {outcome === "stuck" && (
          <div className="ux4g-alert ux4g-alert-error" role="alert">
            <Ux4gIcon
              name="warning"
              className="ux4g-alert-icon text-status-alert-text"
            />
            <div className="ux4g-alert-content">
              <p className="ux4g-alert-title">
                Debited, but not confirmed — don&apos;t pay again
              </p>
              <p className="ux4g-alert-message">
                Your bank debited {amount}, the treasury never confirmed, and
                the challan still reads Pending. Paying again risks paying
                twice. If confirmation never lands, the amount reverses to
                your bank by the same route it left.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Amount + references */}
      <section className="ux4g-card ux4g-card-outline ux4g-card-vertical mt-6">
        <div className="ux4g-card-body">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div>
              <p className="ux4g-label-m-default text-muted">
                Paid to SetuPay Synthetic Gateway
              </p>
              <p className="font-mono mt-1 text-sm text-muted">
                {regNo} · {challanId}
              </p>
            </div>
            <p className="font-mono text-3xl font-medium text-ink">{amount}</p>
          </div>
          <hr className="ux4g-divider-horizontal my-3" />
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="ux4g-label-m-default text-muted">
                Transaction reference
              </dt>
              <dd className="font-mono mt-1 text-ink">{TXN_REF}</dd>
            </div>
            <div>
              <dt className="ux4g-label-m-default text-muted">
                Treasury reference
              </dt>
              <dd className="font-mono mt-1 text-ink">
                {cfg.treasuryRef ?? "Not issued"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Settlement pipeline */}
      <section className="ux4g-card ux4g-card-outline ux4g-card-vertical mt-6">
        <div className="ux4g-card-body">
          <h2 className="ux4g-title-s-strong text-ink">Where the money is</h2>
          <div className="mt-4 overflow-x-auto pb-2">
            <ul className="ux4g-stepper ux4g-stepper-horizontal min-w-[36rem]">
              {cfg.steps.map((view, i) => (
                <StageStep
                  key={STAGES[i].label}
                  n={i + 1}
                  view={view}
                  status={cfg.stepStatus[i]}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Outcome-specific actions */}
      <section className="mt-6">
        {outcome === "success" && (
          <ReceiptActions
            regNo={regNo}
            challanId={challanId}
            amount={amount}
            txnRef={TXN_REF}
            treasuryRef={TREASURY_REF}
          />
        )}
        {outcome === "declined" && (
          <div>
            <Link
              href={`/pay?regNo=${encodeURIComponent(params.regNo ?? regNo)}&challan=${encodeURIComponent(params.challan ?? challanId)}`}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-md"
            >
              Try again
            </Link>
            <p className="ux4g-label-m-default mt-2 text-muted">
              Retrying reuses reference{" "}
              <span className="font-mono">{TXN_REF}</span> — you won&apos;t be
              charged twice for one attempt.
            </p>
          </div>
        )}
        {outcome === "timeout" && (
          <p className="ux4g-body-s-default max-w-[56ch] text-body">
            Come back in 30 minutes and open this page again — by then the
            outcome is definite either way. Nothing more to do right now.
          </p>
        )}
        {outcome === "stuck" && <RecheckStatus />}
      </section>

      <p className="ux4g-label-m-default mt-8 text-muted">
        All records shown are invented for design purposes.
      </p>
    </div>
  );
}
