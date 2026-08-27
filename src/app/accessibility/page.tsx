import type { Metadata } from "next";
import Link from "next/link";
import { ReadAloud } from "@/components/ReadAloud";
import { Ux4gIcon } from "@/components/Ux4gIcon";

export const metadata: Metadata = {
  title: "Accessibility",
};

const SUPPORTED: { icon: string; title: string; detail: string }[] = [
  {
    icon: "keyboard",
    title: "Keyboard operable",
    detail:
      "Every control — lookups, payment methods, the ownership gate, accordions — works without a mouse.",
  },
  {
    icon: "center_focus_strong",
    title: "Visible focus",
    detail:
      "A consistent focus ring, drawn with the design system's focus token, on every interactive element.",
  },
  {
    icon: "record_voice_over",
    title: "Screen-reader labelling",
    detail:
      "Fields carry labels, errors are linked with aria-describedby, OTP digits announce their position, and status changes use live regions.",
  },
  {
    icon: "motion_photos_off",
    title: "Reduced motion respected",
    detail:
      "With prefers-reduced-motion set, the cycling plate goes static and pulses and floats stop. Every state remains reachable.",
  },
  {
    icon: "contrast",
    title: "Light, dark, and system themes",
    detail:
      "All three, persisted. Text and status colours are contrast-checked to WCAG 2.1 AA in both themes — including one fix where the design system's own dark warning pairing fell short.",
  },
  {
    icon: "volume_up",
    title: "Read-aloud on key screens",
    detail:
      "The ownership gate, dispute tracker, and honesty pages can read themselves aloud using the browser's speech engine.",
  },
  {
    icon: "translate",
    title: "Language",
    detail:
      "English today. Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati and more are planned — shown as \"Coming soon\", never as broken links.",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12" id="a11y-statement">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="ux4g-heading-l-strong text-ink">Accessibility</h1>
        <ReadAloud targetId="a11y-statement" />
      </div>
      <p className="ux4g-body-l-default mt-4 max-w-[56ch] text-body">
        ClearChallan is built to WCAG 2.1 AA, following UX4G and GIGW
        guidance. Here is what that means in practice — and what isn&apos;t
        done yet.
      </p>

      <section className="mt-8" aria-label="What is supported">
        <div className="grid gap-3">
          {SUPPORTED.map((item) => (
            <div
              key={item.title}
              className="ux4g-card ux4g-card-outline ux4g-card-vertical"
            >
              <div className="ux4g-card-body flex items-start gap-3">
                <Ux4gIcon
                  name={item.icon}
                  className="ux4g-fs-24 mt-1 shrink-0 text-primary"
                />
                <div>
                  <h2 className="ux4g-title-s-strong text-ink">
                    {item.title}
                  </h2>
                  <p className="ux4g-body-m-default mt-1 text-body">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="ux4g-heading-s-strong text-ink">Not done yet</h2>
        <div className="ux4g-alert ux4g-alert-warning mt-4" role="note">
          <Ux4gIcon
            name="construction"
            className="ux4g-alert-icon text-status-caution-text"
          />
          <div className="ux4g-alert-content">
            <p className="ux4g-alert-title">Honest gaps</p>
            <p className="ux4g-alert-message">
              Translation beyond English is not built — the other languages
              are placeholders. Read-aloud covers key screens, not every
              page. Testing has been against WCAG criteria and keyboard use,
              not yet across the full matrix of screen readers and assistive
              technology. The sample PDF receipt is plain text without
              tagged-PDF structure.
            </p>
          </div>
        </div>
      </section>

      <hr className="ux4g-divider-horizontal my-12" />
      <p className="ux4g-body-m-default text-body">
        What&apos;s genuine and what&apos;s invented on this site is spelled
        out on{" "}
        <Link className="ux4g-text-link-md" href="/what-is-real">
          What&apos;s real
        </Link>
        .
      </p>
    </div>
  );
}
