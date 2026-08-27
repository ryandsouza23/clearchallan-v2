import type { ReactNode } from "react";

export type StatusVariant = "neutral" | "caution" | "alert" | "success";

const variantClasses: Record<StatusVariant, string> = {
  neutral:
    "border-status-neutral-border bg-status-neutral-bg text-status-neutral-text",
  caution:
    "border-status-caution-border bg-status-caution-bg text-status-caution-text",
  alert: "border-status-alert-border bg-status-alert-bg text-status-alert-text",
  success:
    "border-status-success-border bg-status-success-bg text-status-success-text",
};

/**
 * Status label: coloured text on a tinted ground with a 3px left border.
 * All text/background pairs hold WCAG 2.1 AA in both themes.
 */
export function StatusBadge({
  variant,
  children,
}: {
  variant: StatusVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border-l-[3px] px-2 py-1 text-sm font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
