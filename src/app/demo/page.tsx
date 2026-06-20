import type { Metadata } from "next";
import { SalonHome } from "@/components/SalonHome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reveal demo",
  robots: { index: false, follow: false },
};

// /demo — plays the theatrical reveal intro over the real site.
export default function DemoPage() {
  return <SalonHome showIntro />;
}
