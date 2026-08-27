/**
 * UX4G Material Icon (ligature-based; the icon fonts are base64-embedded in
 * the ux4g-web-components stylesheet, so names render as glyphs, not text).
 * Always decorative here — hidden from assistive tech.
 */
export function Ux4gIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <i className={`ux4g-icon-outlined ${className}`} aria-hidden="true">
      {name}
    </i>
  );
}
