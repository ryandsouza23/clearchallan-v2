import Link from "next/link";
import { PlateInput } from "@/components/PlateInput";
import { Ux4gIcon } from "@/components/Ux4gIcon";

/*
  Civic-portal homepage: hero band with the plate lookup, overlapping
  highlight cards, a dark "together" band with numbered services, an
  online-services grid, and an honesty strip. All graphics are drawn from
  UX4G tokens — no photography, no illustration, no identity assets.
*/

const TAGLINE =
  "See every traffic challan on a vehicle, gathered from the systems that normally scatter them.";

const HIGHLIGHTS = [
  {
    icon: "search",
    title: "One lookup, every challan",
    line: "Type the plate once — nothing scattered across portals.",
  },
  {
    icon: "menu_book",
    title: "The law attached",
    line: "Every offence names its MV Act section, in plain language.",
  },
  {
    icon: "lock",
    title: "Evidence, owner-gated",
    line: "Photos and exact locations open only to the vehicle's owner.",
  },
];

const SERVICES = [
  {
    n: "01",
    icon: "directions_car",
    title: "Check a vehicle",
    line: "Every challan on a plate, with the law attached.",
    href: "#regNo",
    cta: "Start above",
  },
  {
    n: "02",
    icon: "credit_card",
    title: "Pay a challan",
    line: "UPI, card or net banking — tracked hand to hand.",
    href: "/pay",
    cta: "How paying works",
  },
  {
    n: "03",
    icon: "gavel",
    title: "Dispute & track",
    line: "Contest a challan and follow it to a decision.",
    href: "/dispute",
    cta: "Track a dispute",
  },
  {
    n: "04",
    icon: "verified",
    title: "Prove ownership",
    line: "DigiLocker, chassis + engine, or OTP — best first.",
    href: "/gate",
    cta: "See the three routes",
  },
];

const ONLINE_SERVICES = [
  { icon: "directions_car", label: "Check challans", href: "/" },
  { icon: "credit_card", label: "Pay a challan", href: "/pay" },
  { icon: "gavel", label: "Dispute a challan", href: "/dispute" },
  { icon: "verified", label: "Prove ownership", href: "/gate" },
  { icon: "info", label: "What's real", href: "/what-is-real" },
  { icon: "volume_up", label: "Accessibility", href: "/accessibility" },
];

const INFO_TILES = [
  {
    icon: "info",
    title: "What's real",
    line: "Almost nothing — and that's the point. Read exactly what's invented.",
    href: "/what-is-real",
  },
  {
    icon: "accessibility_new",
    title: "Accessibility",
    line: "Keyboard, screen readers, text size, read-aloud — what's supported.",
    href: "/accessibility",
  },
  {
    icon: "account_balance",
    title: "Virtual Courts are real",
    line: "A Supreme Court e-Committee initiative. Thresholds vary by state.",
    href: "/dispute",
  },
];

function Eyebrow({
  children,
  inverse = false,
}: {
  children: React.ReactNode;
  inverse?: boolean;
}) {
  return (
    <p
      className={`ux4g-label-l-default tracking-[0.14em] uppercase ${
        inverse ? "text-(--ux4g-text-neutral-inverse)" : "text-primary"
      }`}
    >
      • {children}
    </p>
  );
}

export default function Home() {
  return (
    <div>
      {/* ============ HERO BAND ============ */}
      <section className="cc-band">
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-16 text-center">
          <Eyebrow inverse>
            Built to the UX4G standard · not a government service
          </Eyebrow>
          <h1 className="ux4g-display-xs-strong mx-auto mt-4 max-w-[22ch] text-(--ux4g-text-neutral-inverse)">
            Every challan on your vehicle, made legible
          </h1>
          <p className="ux4g-body-l-default mx-auto mt-3 max-w-[48ch] text-(--ux4g-text-neutral-inverse)">
            {TAGLINE}
          </p>

          <div className="ux4g-card ux4g-card-solid ux4g-card-vertical ux4g-shadow-l3 mx-auto mt-8 max-w-xl text-left">
            <div className="ux4g-card-body">
              <PlateInput />
            </div>
          </div>
        </div>
      </section>

      {/* ============ HIGHLIGHT CARDS (overlapping the band) ============ */}
      <section aria-label="Highlights" className="mx-auto max-w-5xl px-4">
        <div className="-mt-12 grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="ux4g-card ux4g-card-solid ux4g-card-vertical ux4g-shadow-l2 text-center"
            >
              <div className="ux4g-card-body">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-surface-sunken">
                  <Ux4gIcon name={h.icon} className="ux4g-fs-24 text-primary" />
                </span>
                <h2 className="ux4g-title-s-strong mt-3 text-ink">{h.title}</h2>
                <p className="ux4g-body-m-default mt-1 text-body">{h.line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ DARK BAND — numbered services ============ */}
      <section className="cc-band mt-16">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <Eyebrow inverse>One vehicle, one place</Eyebrow>
          <h2 className="ux4g-heading-l-strong mx-auto mt-3 max-w-[24ch] text-(--ux4g-text-neutral-inverse)">
            Everything a challan drags you through, together
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.n}
                className="ux4g-card ux4g-card-solid ux4g-card-vertical text-left"
              >
                <div className="ux4g-card-body">
                  <div className="flex items-start justify-between">
                    <Ux4gIcon name={s.icon} className="ux4g-fs-24 text-primary" />
                    <span className="font-mono text-lg text-muted">{s.n}</span>
                  </div>
                  <h3 className="ux4g-title-s-strong mt-3 text-ink">
                    {s.title}
                  </h3>
                  <p className="ux4g-body-m-default mt-1 text-body">{s.line}</p>
                  <p className="mt-3">
                    <Link className="ux4g-text-link-md" href={s.href}>
                      {s.cta} →
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ONLINE SERVICES GRID ============ */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <Eyebrow>Explore online services</Eyebrow>
        <h2 className="ux4g-heading-l-strong mt-3 max-w-[26ch] text-ink">
          Everything here works — with invented records
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ONLINE_SERVICES.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="ux4g-card ux4g-card-outline ux4g-card-vertical text-center hover:border-primary"
            >
              <div className="ux4g-card-body">
                <Ux4gIcon name={s.icon} className="ux4g-fs-24 text-primary" />
                <p className="ux4g-label-l-default mt-2 text-ink">{s.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* honesty strip, where the template puts partner logos */}
        <div className="mt-16 flex items-center gap-4">
          <hr className="ux4g-divider-horizontal min-w-4 flex-1" />
          <p className="ux4g-label-m-default min-w-0 text-center tracking-[0.14em] uppercase text-muted">
            An independent prototype — every record invented
          </p>
          <hr className="ux4g-divider-horizontal min-w-4 flex-1" />
        </div>
      </section>

      {/* ============ INFO TILES ============ */}
      <section aria-label="About this prototype" className="bg-surface-sunken">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-12 md:grid-cols-3">
          {INFO_TILES.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="ux4g-card ux4g-card-solid ux4g-card-vertical hover:border-primary"
            >
              <div className="ux4g-card-body flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary">
                  <Ux4gIcon name={t.icon} className="ux4g-fs-24 text-on-primary" />
                </span>
                <span>
                  <span className="ux4g-title-s-strong block text-ink">
                    {t.title}
                  </span>
                  <span className="ux4g-body-m-default mt-1 block text-body">
                    {t.line}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
