import type { Metadata } from "next";
import { BRAND } from "./brand";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tindivo.pe";

export const SEO: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Se viene algo muy pronto`,
    template: `%s · ${BRAND.name}`,
  },
  description: `${BRAND.name} es delivery hiperlocal hecho en ${BRAND.region}. Pizza, hamburguesas, criolla — pides desde el celular, pagas como tú quieras. Llega este ${BRAND.launchYear}.`,
  keywords: [
    "Tindivo",
    "delivery",
    "San Jacinto",
    "Áncash",
    "Perú",
    "pedir comida",
    "pizza San Jacinto",
    "Yape",
    "Plin",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} — Se viene algo muy pronto`,
    description: `Delivery hiperlocal en ${BRAND.city}, ${BRAND.region}. Hecho por gente del barrio, para gente del barrio.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Se viene algo muy pronto`,
    description: `Delivery hiperlocal en ${BRAND.city}, ${BRAND.region}.`,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};
