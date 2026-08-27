import { Ux4gIcon } from "./Ux4gIcon";

/*
  Unlocked evidence: a schematic location map and a synthetic camera frame.
  Both are inline SVG drawn from design-system tokens — no map tiles, no
  imagery, no network requests, no API keys. The map is explicitly not
  cartography; the camera frame is explicitly synthetic, and the
  number-plate region in it is intentionally BLANK — the plate read is
  rendered separately as real text, never baked into the image.
  The camera frame uses fixed neutral steps from the UX4G primitive ramp
  (like the number plate, it depicts a physical artefact and doesn't
  theme-flip) — a documented exception.
*/

export function SchematicMap({
  area,
  pin,
}: {
  area: string;
  pin: { x: number; y: number };
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      role="img"
      aria-label={`Schematic street map marking the camera location near ${area}. Stylised, not to scale.`}
      className="block h-auto w-full border border-rule"
    >
      {/* ground */}
      <rect width="200" height="120" fill="var(--surface-sunken)" />
      {/* city blocks */}
      {[
        [8, 8, 52, 32],
        [72, 8, 56, 32],
        [140, 8, 52, 32],
        [8, 52, 52, 26],
        [140, 52, 52, 26],
        [8, 90, 52, 22],
        [72, 90, 56, 22],
        [140, 90, 52, 22],
      ].map(([x, y, w, h]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          fill="var(--surface)"
          stroke="var(--rule)"
        />
      ))}
      {/* main roads */}
      <path
        d="M0 46 H200 M0 84 H200 M66 0 V120 M134 0 V120"
        stroke="var(--muted)"
        strokeWidth="5"
        fill="none"
        opacity="0.55"
      />
      {/* lane lines */}
      <path
        d="M0 46 H200 M66 0 V120"
        stroke="var(--surface)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
      {/* camera pin */}
      <g transform={`translate(${pin.x} ${pin.y})`}>
        <path
          d="M0 0 C-7 -10 -9 -14 -9 -19 a9 9 0 1 1 18 0 c0 5 -2 9 -9 19Z"
          fill="var(--primary)"
        />
        <circle cx="0" cy="-19" r="4.5" fill="var(--on-primary)" />
        <circle cx="0" cy="-19" r="2" fill="var(--primary)" />
      </g>
    </svg>
  );
}

export function EvidenceFrame({ area }: { area: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      role="img"
      aria-label={`Synthetic camera evidence frame near ${area}: rear view of a vehicle at a junction. The number-plate area is intentionally blank; the plate read is shown as text beside this image. Illustrative only.`}
      className="block h-auto w-full border border-rule"
    >
      {/* night scene */}
      <rect width="200" height="120" fill="var(--ux4g-color-neutral-900)" />
      {/* road */}
      <path d="M55 120 L88 34 H112 L145 120 Z" fill="var(--ux4g-color-neutral-800)" />
      <path
        d="M100 40 V120"
        stroke="var(--ux4g-color-neutral-600)"
        strokeWidth="2"
        strokeDasharray="7 6"
      />
      {/* stop line + signal */}
      <rect x="70" y="38" width="60" height="3" fill="var(--ux4g-color-neutral-500)" />
      <rect x="146" y="16" width="4" height="26" fill="var(--ux4g-color-neutral-600)" />
      <rect x="142" y="6" width="12" height="14" rx="2" fill="var(--ux4g-color-neutral-700)" />
      <circle cx="148" cy="11" r="2.6" fill="var(--ux4g-color-red-400)" />
      {/* vehicle, rear view */}
      <g>
        <rect x="76" y="58" width="48" height="34" rx="6" fill="var(--ux4g-color-neutral-700)" />
        <rect x="82" y="50" width="36" height="14" rx="4" fill="var(--ux4g-color-neutral-600)" />
        {/* tail lamps */}
        <rect x="79" y="66" width="9" height="4" rx="1" fill="var(--ux4g-color-red-500)" />
        <rect x="112" y="66" width="9" height="4" rx="1" fill="var(--ux4g-color-red-500)" />
        {/* number-plate region — intentionally blank */}
        <rect
          x="88"
          y="76"
          width="24"
          height="9"
          rx="1"
          fill="var(--ux4g-color-neutral-0)"
        />
      </g>
      {/* CCTV frame corners */}
      <path
        d="M6 16 V6 H16 M184 6 H194 V16 M194 104 V114 H184 M16 114 H6 V104"
        stroke="var(--ux4g-color-neutral-500)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export function UnlockedEvidence({
  regNo,
  area,
  coords,
  pin,
  date,
}: {
  regNo: string;
  area: string;
  coords: string;
  pin: { x: number; y: number };
  date: string;
}) {
  return (
    <div className="mt-3 grid gap-4 border-t border-rule pt-3 sm:grid-cols-2">
      {/* Location */}
      <figure>
        <SchematicMap area={area} pin={pin} />
        <figcaption className="mt-2">
          <p className="ux4g-label-l-default flex items-center gap-2 text-ink">
            <Ux4gIcon name="location_on" className="text-primary" /> {area}
          </p>
          <p className="font-mono mt-1 text-sm text-body">{coords}</p>
          <p className="ux4g-label-m-default mt-1 text-muted">
            Schematic location — not to scale. Coordinates illustrative.
          </p>
          <p className="ux4g-label-m-default mt-2 text-muted">
            This is where the camera recorded the offence. Wrong-location
            challans are a real reason to look.
          </p>
        </figcaption>
      </figure>

      {/* Camera frame */}
      <figure>
        <EvidenceFrame area={area} />
        <figcaption className="mt-2">
          <p className="ux4g-label-l-default flex items-center gap-2 text-ink">
            <Ux4gIcon name="photo_camera" className="text-primary" /> Camera
            frame
          </p>
          <p className="font-mono mt-1 text-sm text-body">
            Plate read: {regNo}
          </p>
          <p className="font-mono mt-1 text-sm text-muted">Recorded {date}</p>
          <p className="ux4g-label-m-default mt-1 text-muted">
            Synthetic evidence frame — illustrative. The plate read is shown
            as text, never in the image.
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
