import type { Metadata } from "next";
import Link from "next/link";
import { ChallanActions } from "@/components/ChallanActions";
import { GatedDetails } from "@/components/GatedDetails";
import { LawAccordion } from "@/components/LawAccordion";
import {
  type Challan,
  RECORDS,
  STATUS_META,
  display,
  normalise,
  resolveVehicle,
  totalDue,
} from "@/lib/challans";

export const metadata: Metadata = {
  title: "Challans",
};

function StaticPlate({ regNo }: { regNo: string }) {
  return (
    <div
      aria-hidden="true"
      className="inline-block border border-[#737373] bg-[#FFFFFF] px-6 py-2"
    >
      <span className="font-mono text-2xl font-medium tracking-[0.12em] whitespace-nowrap text-[#171717]">
        {regNo}
      </span>
    </div>
  );
}

function ChallanCard({ challan, regNo }: { challan: Challan; regNo: string }) {
  const status = STATUS_META[challan.status];

  return (
    <article className="ux4g-card ux4g-card-outline ux4g-card-vertical">
      <div className="ux4g-card-body">
        {/* Public: offence, section, amount, date, status */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <h2 className="ux4g-title-s-strong text-ink">{challan.offence}</h2>
            <p className="mt-2 flex flex-wrap items-center gap-2">
              <span className="ux4g-tag ux4g-tag-tonal-primary ux4g-tag-s">
                {challan.section}
              </span>
              <span className={status.tag}>{status.label}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-medium text-ink">
              {challan.amount}
            </p>
            <p className="ux4g-label-m-default mt-1 text-muted">
              {challan.date}
            </p>
          </div>
        </div>

        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1">
          <div className="flex gap-2">
            <dt className="ux4g-label-m-default text-muted">Challan</dt>
            <dd className="ux4g-label-m-default font-mono text-body">
              {challan.id}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="ux4g-label-m-default text-muted">Issued</dt>
            <dd className="ux4g-label-m-default text-body">{challan.area}</dd>
          </div>
        </dl>

        {/* Plain-language law, expandable */}
        <LawAccordion title={`What ${challan.section.replace("MV Act ", "")} means`}>
          <p className="ux4g-body-m-default text-body">
            {challan.sectionMeaning}
          </p>
          <p className="ux4g-label-m-default mt-2 text-muted">
            Plain-language summary, illustrative — not legal advice.
          </p>
        </LawAccordion>

        {/* Gated: camera photo + exact location. Locked until ownership is
            proven via /gate; never rendered while locked. */}
        <GatedDetails
          regNo={regNo}
          challanId={challan.id}
          area={challan.area}
          coords={challan.coords}
          pin={challan.pin}
          date={challan.date}
        />

        {status.due && (
          <>
            <hr className="ux4g-divider-horizontal my-4" />
            <ChallanActions
              regNo={regNo}
              challanId={challan.id}
              amount={challan.amount}
            />
          </>
        )}
      </div>
    </article>
  );
}

export default async function ChallansPage({
  searchParams,
}: {
  searchParams: Promise<{ regNo?: string }>;
}) {
  const { regNo } = await searchParams;

  if (!regNo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="ux4g-heading-l-strong text-ink">Check a vehicle</h1>
        <p className="ux4g-body-l-default mt-4 text-body">
          Enter a registration number on the{" "}
          <Link className="ux4g-text-link-md" href="/">
            home page
          </Link>{" "}
          to see the challans on a vehicle.
        </p>
      </div>
    );
  }

  const resolved = resolveVehicle(regNo);
  const viaChassisEngine = resolved !== null && normalise(regNo) !== resolved;
  const shown = display(resolved ?? regNo);
  const challans = resolved ? RECORDS[resolved] : undefined;

  if (!challans) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-6">
          <StaticPlate regNo={shown} />
        </div>
        <h1 className="ux4g-heading-m-strong text-ink">
          No challans in the sample set
        </h1>
        <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
          This prototype holds a small set of invented records, and none match{" "}
          <span className="font-mono text-ink">{shown}</span>. Real lookups are
          not performed here.
        </p>
        <p className="mt-6">
          <Link className="ux4g-text-link-md" href="/">
            Try another registration number
          </Link>
        </p>
      </div>
    );
  }

  const due = totalDue(challans);
  const dueCount = challans.filter((c) => STATUS_META[c.status].due).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="sr-only">Challans for {shown}</h1>
          <StaticPlate regNo={shown} />
          <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-s">
            Sample data
          </span>
          {viaChassisEngine && (
            <span className="ux4g-tag ux4g-tag-tonal-primary ux4g-tag-s">
              Matched by chassis / engine number
            </span>
          )}
        </div>
        <p className="ux4g-body-l-default mt-4 text-body">
          {challans.length} challans on this vehicle ·{" "}
          <span className="font-mono font-medium text-ink">{due}</span> due
          across {dueCount}.
        </p>
        <p className="ux4g-label-l-default mt-2 text-muted">
          Every challan on this vehicle, gathered into one place.
        </p>
        <p className="ux4g-label-m-default mt-1 text-muted">
          Sections shown are indicative — verify against your official
          challan.
        </p>
      </header>

      <div className="mt-8 grid gap-6">
        {challans.map((challan) => (
          <ChallanCard key={challan.id} challan={challan} regNo={shown} />
        ))}
      </div>

      <p className="ux4g-label-m-default mt-8 text-muted">
        All records shown are invented for design purposes.
      </p>
    </div>
  );
}
