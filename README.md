# ClearChallan (independent prototype)

## UX4G Design System

This app uses the Government of India **UX4G Design System 3.0** via the
official npm package **`ux4g-web-components@1.0.13`** (published by
NeGD/Digital India; the same distribution as CDN `UX4G@3.0.18`). The full CSS
bundle, design tokens, light/dark themes, component classes, and interactive
runtime are wired in `src/app/layout.tsx`, `src/app/globals.css`, and
`src/components/Ux4gRuntime.tsx`. Our shell variables alias UX4G tokens
(indigo `#4a2bc2` ramp, Noto Sans typography, base-4 spacing, radius,
elevation), and the light/dark/system toggle drives UX4G's
`data-theme` attribute.

**Government identity assets are intentionally excluded.** ClearChallan is an
independent prototype, not a government service: the National Emblem,
Indian-flag strip, gov.in top bar, and NeGD/MeitY branding that accompany
UX4G patterns are never rendered, and `globals.css` contains a hard guard
(`.ux4g-topbar`, `.india-flag` are disabled) so pasted pattern snippets
cannot reintroduce them. One deliberate token deviation: UX4G's dark-mode
warning tint (orange-300 on orange-800, 3.58:1) fails WCAG AA, so the caution
status background uses UX4G's own orange-900 instead (≈5:1).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
