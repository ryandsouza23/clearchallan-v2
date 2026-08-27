/*
  Seeded, illustrative records — every value is invented.
  Offence ↔ section pairings verified against the Kolkata Traffic Police
  offences & penalties table (kolkatatrafficpolice.gov.in/offences.pdf,
  updated 28.10.2024):
    signal violation    → §119 r/w §177 (duty to obey signals; general penalty)
    over-speeding       → §183(1) (driving at excessive speed)
    riding helmetless   → §194D (r/w §129, protective headgear)
  §184 is reserved for dangerous driving (incl. handheld-device use);
  §194B is the seatbelt section. Amounts are illustrative but realistic
  (statutory fine plus court/processing fees, hence the paise).
*/

export type ChallanStatus = "pending" | "virtual-court" | "paid";

export type Challan = {
  id: string;
  offence: string;
  section: string;
  sectionMeaning: string;
  amount: string;
  date: string;
  area: string;
  /* Illustrative coordinates (display text) and the pin position on the
     schematic map, in its 200×120 viewBox. */
  coords: string;
  pin: { x: number; y: number };
  status: ChallanStatus;
};

export const RECORDS: Record<string, Challan[]> = {
  KA25XY4567: [
    {
      id: "CH-2026-1177-0031",
      offence: "Disobeying a red-light signal",
      section: "MV Act §119/§177",
      sectionMeaning:
        "Section 119 places a duty on every driver to obey traffic signals and signs, but carries no penalty of its own — so a signal violation is charged with Section 177, the Act's general penalty: ₹500 for a first offence, up to ₹1,500 after that. Aggravated signal-jumping that endangers others can instead be booked as dangerous driving under Section 184.",
      amount: "₹611.20",
      date: "14 Jul 2026",
      area: "Near Silk Board Junction, Bengaluru",
      coords: "12.9172° N, 77.6228° E",
      pin: { x: 76, y: 52 },
      status: "pending",
    },
    {
      id: "CH-2026-1183-0578",
      offence: "Over-speeding — 68 km/h in a 40 km/h zone",
      section: "MV Act §183",
      sectionMeaning:
        "Section 183(1) is driving at excessive speed. The fine depends on the class of vehicle — ₹1,000 to ₹2,000 for cars, two-wheelers and autos, double that for buses and heavy vehicles. Repeated offences can lead to licence action, which is why this one has moved to a virtual court.",
      amount: "₹1,542.60",
      date: "02 Jun 2026",
      area: "Electronic City Flyover, Bengaluru",
      coords: "12.8511° N, 77.6601° E",
      pin: { x: 128, y: 84 },
      status: "virtual-court",
    },
    {
      id: "CH-2026-1194-0912",
      offence: "Riding without a helmet",
      section: "MV Act §194D",
      sectionMeaning:
        "Section 194D — read with Section 129, which sets the helmet requirement — is riding a two-wheeler without protective headgear. The fine is ₹1,000, and the licence can be disqualified for three months. It applies to the rider and, in most states, the pillion as well.",
      amount: "₹1,011.80",
      date: "21 Apr 2026",
      area: "100 Feet Road, Indiranagar, Bengaluru",
      coords: "12.9719° N, 77.6412° E",
      pin: { x: 52, y: 90 },
      status: "paid",
    },
  ],
};

export const STATUS_META: Record<
  ChallanStatus,
  { label: string; tag: string; due: boolean }
> = {
  pending: {
    label: "Pending",
    tag: "ux4g-tag ux4g-tag-tonal-warning",
    due: true,
  },
  "virtual-court": {
    label: "In Virtual Court",
    tag: "ux4g-tag ux4g-tag-tonal-error",
    due: true,
  },
  paid: { label: "Paid", tag: "ux4g-tag ux4g-tag-tonal-success", due: false },
};

export function normalise(regNo: string) {
  return regNo.toUpperCase().replace(/\s+/g, "");
}

export function display(regNo: string) {
  // KA25XY4567 → KA 25 XY 4567; leaves unusual formats as typed.
  const m = normalise(regNo).match(
    /^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{1,4})$/,
  );
  return m ? `${m[1]} ${m[2]} ${m[3]} ${m[4]}` : regNo.toUpperCase();
}

export function findChallan(regNo: string, challanId: string) {
  return RECORDS[normalise(regNo)]?.find((c) => c.id === challanId) ?? null;
}

export function totalDue(challans: Challan[]) {
  const paise = challans
    .filter((c) => STATUS_META[c.status].due)
    .reduce(
      (sum, c) =>
        sum + Math.round(parseFloat(c.amount.replace(/[₹,]/g, "")) * 100),
      0,
    );
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

/*
  Ownership-proof seed for the sample vehicle (illustrative). Last-five
  matching only — full numbers are never asked for.
*/
export const VEHICLE_PROOF: Record<
  string,
  { chassisLast5: string; engineLast5: string; mobileMasked: string }
> = {
  KA25XY4567: {
    chassisLast5: "48213",
    engineLast5: "20931",
    mobileMasked: "•• ••• 2870",
  },
};

/*
  Seeded dispute (illustrative). Dates are fictional and keyed to the
  seeded "today" below — never to the real calendar.
*/
export const SEEDED_TODAY = "24 Aug 2026";

export type DisputeEntry = {
  date: string;
  title: string;
  detail?: string;
  state: "done" | "current";
};

export const DISPUTES: Record<
  string,
  {
    ref: string;
    challanId: string;
    statusLabel: string;
    expectedBy: string;
    timeline: DisputeEntry[];
  }
> = {
  KA25XY4567: {
    ref: "DSP-2026-0612-114",
    challanId: "CH-2026-1183-0578",
    statusLabel: "In Virtual Court",
    expectedBy: "07 Sep 2026",
    timeline: [
      { date: "12 Jun 2026", title: "Filed", state: "done" },
      {
        date: "19 Jun 2026",
        title: "Accepted for review",
        detail: "The issuing unit acknowledged the dispute.",
        state: "done",
      },
      {
        date: "28 Jun 2026",
        title: "Evidence requested",
        detail:
          "Camera frame and speed-measurement record requested from the issuing unit.",
        state: "done",
      },
      {
        date: "14 Jul 2026",
        title: "Moved to Virtual Court",
        detail: "Listed for digital review by a magistrate.",
        state: "current",
      },
    ],
  },
};
