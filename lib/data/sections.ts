export type SectionTheme = "light" | "dark" | "brand";

export type SectionMeta = {
  id: string;
  index: number;
  label: string;
  hash: string;
  theme: SectionTheme;
  eyebrow: string;
  headline: string;
};

export const SECTIONS: SectionMeta[] = [
  {
    id: "hero",
    index: 0,
    label: "Hero",
    hash: "inicio",
    theme: "light",
    eyebrow: "SAN JACINTO · ÁNCASH · 2026",
    headline: "Se viene algo muy pronto.",
  },
  {
    id: "identity",
    index: 1,
    label: "Identidad",
    hash: "tindivo",
    theme: "dark",
    eyebrow: "HOLA, SOMOS",
    headline: "tindivo.",
  },
  {
    id: "problem",
    index: 2,
    label: "Antes",
    hash: "antes",
    theme: "light",
    eyebrow: "ANTES DE TINDIVO",
    headline:
      "Llamabas. Repetías. Repetías de nuevo. Esperabas sin saber.",
  },
  {
    id: "restaurants",
    index: 3,
    label: "Restaurantes",
    hash: "restaurantes",
    theme: "light",
    eyebrow: "LO QUE SE VIENE · 01",
    headline: "Tus restaurantes, en un solo lugar.",
  },
  {
    id: "tracking",
    index: 4,
    label: "Tracking",
    hash: "tracking",
    theme: "light",
    eyebrow: "LO QUE SE VIENE · 02",
    headline: "Vas a ver tu pedido moverse.",
  },
  {
    id: "payments",
    index: 5,
    label: "Pagos",
    hash: "pagos",
    theme: "light",
    eyebrow: "LO QUE SE VIENE · 03",
    headline: "Paga como tú quieras.",
  },
  {
    id: "rewards",
    index: 6,
    label: "Promos",
    hash: "promos",
    theme: "light",
    eyebrow: "LO QUE SE VIENE · 04",
    headline: "Pide más. Paga menos. Repite.",
  },
  {
    id: "connected",
    index: 7,
    label: "Visión",
    hash: "vision",
    theme: "dark",
    eyebrow: "EL BARRIO GANA",
    headline:
      "Trabajo para motorizados. Ventas para restaurantes. Comida rica para tus vecinos.",
  },
  {
    id: "closing",
    index: 8,
    label: "Pronto",
    hash: "pronto",
    theme: "brand",
    eyebrow: "2026",
    headline: "Pronto.",
  },
];

export const SECTION_COUNT = SECTIONS.length;

export function getSectionByHash(hash: string): SectionMeta | undefined {
  const clean = hash.replace(/^#/, "");
  return SECTIONS.find((s) => s.hash === clean);
}

export function getSectionByIndex(index: number): SectionMeta | undefined {
  return SECTIONS[index];
}
