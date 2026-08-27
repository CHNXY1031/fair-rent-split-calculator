import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Link from "next/link";
import { Scale } from "lucide-react";
import { BASE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Fair Roommate Rent Split Calculator",
    template: "%s | Fair Rent Split",
  },
  description:
    "Split rent fairly by room size, private bathroom, premium features, and number of occupants. Free, instant, and easy to share.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Fair Rent Split",
    title: "Fair Roommate Rent Split Calculator",
    description:
      "A transparent rent calculator for roommates, couples, and uneven bedrooms.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fair Roommate Rent Split Calculator",
    description:
      "Stop guessing. Price every bedroom and shared space with a transparent formula.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <header className="border-b border-ink/15 bg-bone/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-3 font-bold tracking-tight"
              aria-label="Fair Rent Split home"
            >
              <span className="grid size-9 place-items-center rounded-full bg-ink text-bone">
                <Scale className="size-4" aria-hidden="true" />
              </span>
              <span>Fair Rent Split</span>
            </Link>
            <a
              href="#calculator"
              className="border-b border-ink/40 text-sm font-semibold transition hover:border-ledger hover:text-ledger"
            >
              Open calculator
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-ink/15 bg-paper">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>Built for honest roommate conversations.</p>
            <p>Estimates are a starting point—agree together before signing.</p>
            <a href="https://uptime-pulse-saas.vercel.app/?utm_source=fair-rent-split-calculator&amp;utm_medium=referral&amp;utm_campaign=protected_by" target="_blank" rel="noopener noreferrer" className="text-xs text-ink/45 underline decoration-ink/20 underline-offset-4 transition hover:text-ink">Protected by UptimePulse — Free Website &amp; SSL Monitor</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
