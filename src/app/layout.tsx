import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Parisienne } from "next/font/google";
import { SALON } from "@/lib/salon-config";
import "./globals.css";

// Elegant display serif for headings.
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

// Clean geometric sans for body & UI.
const sans = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Romantic script for "hello beautiful" flourishes.
const script = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SALON.name} — Hair Salon`,
    template: `%s · ${SALON.name}`,
  },
  description: SALON.tagline,
};

export const viewport: Viewport = {
  themeColor: "#FAF5F1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${script.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
