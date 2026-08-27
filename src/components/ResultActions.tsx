"use client";

import { useState } from "react";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  Receipt actions and the manual recheck control. Everything is a stub:
  nothing is transmitted anywhere. The PDF is generated entirely in the
  browser (a minimal hand-built PDF), so even the download makes no request.
  The recheck is MANUAL only — this architecture has no scheduled jobs, and
  no copy here may claim automatic or background rechecking.
*/

function buildReceiptPdf(lines: string[]) {
  const esc = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const content = [
    "BT /F1 11 Tf 14 TL 50 790 Td",
    ...lines.map((l) => `(${esc(l)}) Tj T*`),
    "ET",
  ].join("\n");
  const objects = [
    "<</Type /Catalog /Pages 2 0 R>>",
    "<</Type /Pages /Kids [3 0 R] /Count 1>>",
    "<</Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>",
    `<</Length ${content.length}>>\nstream\n${content}\nendstream`,
    "<</Type /Font /Subtype /Type1 /BaseFont /Courier>>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<</Size ${objects.length + 1} /Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

export function ReceiptActions({
  regNo,
  challanId,
  amount,
  txnRef,
  treasuryRef,
}: {
  regNo: string;
  challanId: string;
  amount: string;
  txnRef: string;
  treasuryRef: string;
}) {
  const [note, setNote] = useState<string | null>(null);

  function downloadPdf() {
    const pdf = buildReceiptPdf([
      "ClearChallan - sample receipt",
      "All records are invented. Not a government service.",
      "",
      `Vehicle:            ${regNo}`,
      `Challan:            ${challanId}`,
      `Amount:             ${amount.replace("₹", "Rs ")}`,
      `Status:             Cleared`,
      `Transaction ref:    ${txnRef}`,
      `Treasury ref:       ${treasuryRef}`,
      "",
      "Paid via SetuPay Synthetic Gateway (synthetic).",
      "No money moved. This document proves nothing.",
    ]);
    const url = URL.createObjectURL(
      new Blob([pdf], { type: "application/pdf" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `clearchallan-sample-receipt-${challanId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setNote("Sample receipt downloaded — generated in your browser, nothing was requested from any server.");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
          onClick={() =>
            setNote(
              "Queued to your registered mobile (sample) — nothing is actually sent in this prototype.",
            )
          }
        >
          <Ux4gIcon name="sms" /> Send SMS
        </button>
        <button
          type="button"
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
          onClick={() =>
            setNote(
              "Queued to your registered email (sample) — nothing is actually sent in this prototype.",
            )
          }
        >
          <Ux4gIcon name="mail" /> Send email
        </button>
        <button
          type="button"
          className="ux4g-btn ux4g-btn-primary ux4g-btn-md"
          onClick={downloadPdf}
        >
          <Ux4gIcon name="picture_as_pdf" /> Download PDF
        </button>
      </div>
      {note && (
        <p aria-live="polite" className="ux4g-label-m-default mt-3 text-muted">
          {note}
        </p>
      )}
    </div>
  );
}

export function RecheckStatus() {
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
        onClick={() => setCheckedAt(new Date().toLocaleTimeString())}
      >
        <Ux4gIcon name="refresh" /> Recheck status
      </button>
      <p aria-live="polite" className="ux4g-label-m-default mt-2 text-muted">
        {checkedAt
          ? `Checked at ${checkedAt} — still awaiting the treasury's confirmation (sample). Checking happens only when you press this; nothing rechecks in the background.`
          : "Checking happens only when you press this — nothing rechecks automatically."}
      </p>
    </div>
  );
}
