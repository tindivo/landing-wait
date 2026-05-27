# landing-wait

Pre-launch landing page de **Tindivo** — delivery hiperlocal en San Jacinto, Áncash.

9 secciones snap por viewport con animaciones cinematográficas: shader WebGL en hero, smooth scroll Lenis, GSAP timelines por sección, mockup de iPhone con motorizado siguiendo path bezier, navegación con tap (mobile, estilo Instagram Stories) y wheel/keyboard (desktop).

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4 (con `@theme` tokens)
- GSAP 3.15 + `@gsap/react` + ScrollTrigger + MotionPath
- Lenis 1.3 (smooth scroll)
- OGL 1.0 (WebGL shader hero)
- Framer Motion 12
- TypeScript strict

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
pnpm build
pnpm start
```

## Tests

```bash
pnpm test          # Playwright E2E
pnpm test:a11y     # axe-core a11y
```

## Deploy

Optimizado para [Vercel](https://vercel.com). Push a `main` → preview automático.
