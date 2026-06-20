import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SALON } from "@/lib/salon-config";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
  themeColor: "#F7F3EE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
