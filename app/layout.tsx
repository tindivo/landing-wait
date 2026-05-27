import "./globals.css";

import type { Metadata, Viewport } from "next";
import { bricolage, geist, jetbrains } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SEO } from "@/lib/data/seo";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = SEO;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6F1" },
    { media: "(prefers-color-scheme: dark)", color: "#15110F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-PE"
      suppressHydrationWarning
      className={cn(
        bricolage.variable,
        geist.variable,
        jetbrains.variable,
        "h-full antialiased",
      )}
    >
      <body className="min-h-full overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LenisProvider>
            <MotionProvider>
              <a href="#main" className="skip-link">
                Saltar al contenido
              </a>
              {children}
            </MotionProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
