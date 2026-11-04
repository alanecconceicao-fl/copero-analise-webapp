import type { ReactNode } from "react";
import { Barlow, Oswald } from "next/font/google";
import "./globals.css";
import { GoogleCmp } from "../shared/google-cmp";
import { SITE_URL } from "../shared/site";

// Brand type: Oswald for display (uppercase, condensed — the "chant" look),
// Barlow for body copy. Self-hosted via next/font (no runtime Google fetch).
const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const description =
  "In-depth analysis of Grêmio matches, told in the language of the stands.";

// SEO (#38): metadataBase resolves every relative URL below (canonical, og);
// the title template brands child pages; OG makes a shared link show
// title+description+image instead of a bare URL. Canonical is per page, not
// here — inherited from the layout it would point every route at "/".
// No twitter title/description/images: X's card processor falls back to the
// og: tags, only the card type has no og equivalent.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Copero Analysis",
    template: "%s · Copero Analysis",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Copero Analysis",
    locale: "en_US",
    title: "Copero Analysis",
    description,
    images: ["/logo.png"],
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <GoogleCmp />
        {children}
      </body>
    </html>
  );
}
