export const BRAND = {
  name: "Tindivo",
  wordmark: "tindivo",
  city: "San Jacinto",
  region: "Áncash",
  country: "Perú",
  launchYear: "2026",
  tagline: "Una manera nueva de pedir lo que ya pedías siempre.",
  supportPhone: "+51 906 550 166",
  whatsappNumber: "51906550166",
  instagram: "tindivo.pe",
} as const;

export const WHATSAPP_MESSAGES = {
  general: "Hola Tindivo, quiero saber cuándo lanzan.",
  vendor:
    "Hola Tindivo, tengo un restaurante en San Jacinto y quiero ser parte.",
  rider: "Hola Tindivo, quiero ser motorizado del equipo.",
} as const;

export function whatsappLink(message: keyof typeof WHATSAPP_MESSAGES): string {
  const text = encodeURIComponent(WHATSAPP_MESSAGES[message]);
  return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}

export const INSTAGRAM_URL = `https://instagram.com/${BRAND.instagram}`;
