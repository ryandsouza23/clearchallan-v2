import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans, Noto_Sans_Display } from "next/font/google";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import { Ux4gRuntime } from "@/components/Ux4gRuntime";
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

// Applies the stored theme before first paint so there is no flash.
// UX4G's dark theme keys off :root[data-theme="dark"], with no
// prefers-color-scheme fallback of its own — so the attribute always
// carries the RESOLVED theme. "system" (or no stored value) resolves via
// matchMedia here and is kept in sync by the ThemeToggle afterwards.
const themeInitScript = `
(function () {
  var theme = "light";
  try {
    var stored = localStorage.getItem("clearchallan-theme");
    if (stored === "light" || stored === "dark") {
      theme = stored;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", theme);
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${notoSans.variable} ${notoDisplay.variable} ${plexMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Ux4gRuntime />
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
