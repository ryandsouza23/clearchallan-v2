import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans, Noto_Sans_Display } from "next/font/google";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
// UX4G Design System 3.0 (ux4g-web-components@1.0.13, the npm package
// behind CDN dist UX4G@3.0.18) is imported inside globals.css into a
// dedicated cascade layer so Tailwind utilities and our overrides win.
import "./globals.css";

// UX4G typography: Noto Sans (base) + Noto Sans Display (display).
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoDisplay = Noto_Sans_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-noto-display",
  display: "swap",
});

// IBM Plex Mono stays for figures: plates, IDs, amounts.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ClearChallan",
    template: "%s · ClearChallan",
  },
  description:
    "Independent prototype for checking vehicle challans. All records are invented; not a government service.",
};

// Light-only: the site does not theme. data-theme="light" is fixed on
// <html>, so UX4G's dark rules (keyed to [data-theme="dark"]) never apply.
// This pre-paint script only restores the persisted text-size preference.
const initScript = `
(function () {
  try {
    var scale = parseInt(localStorage.getItem("clearchallan-font-scale"), 10);
    if (scale && scale !== 100 && scale >= 80 && scale <= 130) {
      document.documentElement.style.fontSize = scale + "%";
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${notoSans.variable} ${notoDisplay.variable} ${plexMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary"
        >
          Skip to main content
        </a>
        <TopBar />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
