import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { SALON } from "@/lib/salon-config";

/**
 * The social share card (Open Graph / Twitter), generated at request time with
 * Satori from the same cut-out art the hero uses — no binary asset to keep in
 * sync. Next's file convention wires the <meta og:image> tags automatically.
 */
export const runtime = "nodejs";
export const alt = `${SALON.name} — ${SALON.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLUSH = "#F1C5CC";
const CREAM = "#FBF6F2";
const ACCENT = "#C95678";
const INK = "#1C1918";
const MUTED = "#8C807A";

/** Repeating vertical stripes as one linear-gradient with hard stops. */
function stripes(width: number, stripe: number): string {
  const stops: string[] = [];
  for (let x = 0; x < width; x += stripe * 2) {
    stops.push(`${BLUSH} ${x}px`, `${BLUSH} ${x + stripe}px`);
    stops.push(`${CREAM} ${x + stripe}px`, `${CREAM} ${x + stripe * 2}px`);
  }
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

async function assetUri(rel: string): Promise<string> {
  const buf = await readFile(path.join(process.cwd(), "public", rel));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

/** Fetch a Google Font as TTF bytes (Satori needs raw font data). */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}` +
    `:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(cssUrl, {
      // A non-woff2 user agent makes Google return TTF sources.
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36" },
    })
  ).text();
  const url = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?(?:truetype|opentype)['"]?\)/)?.[1];
  if (!url) throw new Error(`No TTF source for ${family}`);
  return (await fetch(url)).arrayBuffer();
}

export default async function OgImage() {
  const heading = SALON.name;
  const script = "hello gorgeous";
  const tagline = SALON.tagline;
  const meta = `${SALON.cityLine.split(",")[0]}  ·  mainstreetsalon.studio`;

  const [chandelier, clock, rose, serif, scriptFont, sans] = await Promise.all([
    assetUri("theme/cut/chandelier.png"),
    assetUri("theme/cut/clock-bracket.png"),
    assetUri("theme/cut/rose-2.png"),
    googleFont("Cormorant Garamond", 600, heading),
    googleFont("Parisienne", 400, script),
    googleFont("Jost", 400, tagline + meta + meta.toUpperCase()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: CREAM,
          backgroundImage: stripes(1200, 60),
          fontFamily: "Jost",
          position: "relative",
        }}
      >
        {/* soft cream wash so the text stays legible over the stripes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(ellipse 62% 70% at 50% 52%, rgba(251,246,242,0.94), rgba(251,246,242,0.6) 55%, rgba(251,246,242,0.15))",
          }}
        />

        {/* decor, cut from the salon photos */}
        <img src={chandelier} width={172} style={{ position: "absolute", top: -6, left: 514 }} />
        <img src={clock} width={196} style={{ position: "absolute", top: 368, left: 16 }} />
        <img
          src={rose}
          width={198}
          style={{ position: "absolute", right: 48, bottom: -26, transform: "rotate(-8deg)" }}
        />
        <img
          src={rose}
          width={108}
          style={{ position: "absolute", right: 66, top: 34, transform: "scaleX(-1) rotate(-14deg)" }}
        />
        <img
          src={rose}
          width={92}
          style={{ position: "absolute", left: 70, bottom: 24, transform: "rotate(12deg)" }}
        />

        {/* centered lockup */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingTop: 36,
          }}
        >
          <div style={{ fontFamily: "Parisienne", fontSize: 54, color: ACCENT, lineHeight: 1 }}>
            {script}
          </div>
          <div
            style={{
              fontFamily: "Cormorant",
              fontSize: 88,
              fontWeight: 600,
              color: INK,
              lineHeight: 1.02,
              marginTop: 2,
            }}
          >
            {heading}
          </div>
          <div style={{ marginTop: 18, fontSize: 24, color: MUTED, maxWidth: 680 }}>{tagline}</div>
          <div
            style={{
              marginTop: 22,
              fontSize: 16,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            {meta}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, weight: 600 as const, style: "normal" as const },
        { name: "Parisienne", data: scriptFont, weight: 400 as const, style: "normal" as const },
        { name: "Jost", data: sans, weight: 400 as const, style: "normal" as const },
      ],
    },
  );
}
