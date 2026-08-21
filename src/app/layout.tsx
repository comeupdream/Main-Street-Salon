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

// Romantic script for "hello gorgeous" flourishes.
const script = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mainstreetsalon.studio",
  ),
  title: {
    default: `${SALON.name} — Hair Salon`,
    template: `%s · ${SALON.name}`,
  },
  description: SALON.tagline,
  // The share-card image itself comes from src/app/opengraph-image.tsx
  // (Next's file convention adds the og:image / twitter:image tags).
  openGraph: {
    type: "website",
    siteName: SALON.name,
    title: `${SALON.name} — Hair Salon`,
    description: SALON.tagline,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SALON.name} — Hair Salon`,
    description: SALON.tagline,
  },
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
      <body>
        {/* Re-apply the persisted palette before first paint (no color flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("salon-palette")==="ice")document.documentElement.dataset.palette="ice"}catch(e){}',
          }}
        />
        {children}
      </body>
    </html>
  );
}
