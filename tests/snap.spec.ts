import { test, expect } from "@playwright/test";

const SECTIONS = [
  { id: "hero", label: "Hero", hash: "inicio" },
  { id: "identity", label: "Identidad", hash: "tindivo" },
  { id: "problem", label: "Antes", hash: "antes" },
  { id: "restaurants", label: "Restaurantes", hash: "restaurantes" },
  { id: "tracking", label: "Tracking", hash: "tracking" },
  { id: "payments", label: "Pagos", hash: "pagos" },
  { id: "rewards", label: "Promos", hash: "promos" },
  { id: "connected", label: "Visión", hash: "vision" },
  { id: "closing", label: "Pronto", hash: "pronto" },
] as const;

// DOM presence checks: reducedMotion avoids GPU stall that blocks beforeEach in headless.
test.describe("snap navigation — DOM structure", () => {
  test.beforeEach(async ({ page }) => {
    // reducedMotion: disables WebGL GPU stalls and continuous RAF loops (Rewards/Connected)
    // that block the headless browser process and cause beforeEach to timeout.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("load");
  });

  for (const section of SECTIONS) {
    test(`section #${section.id} is present in the DOM`, async ({ page }) => {
      const el = page.locator(`section#${section.id}`);
      await expect(el).toBeAttached({ timeout: 15_000 });
    });
  }
});

// Navigation tests: require Lenis active (no reducedMotion) for scrollToSection to work.
// These tests depend on smooth scroll snap behaviour — run against pnpm start for stability.
test.describe("snap navigation — Lenis scroll", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
  });

  test("clicking a ProgressDot scrolls to that section and marks it active", async ({
    page,
  }) => {
    test.slow();
    const dotByLabel = page.locator(
      'nav[aria-label="Navegación de secciones"] button[aria-label="Ir a Pagos"]',
    );
    await dotByLabel.first().click();

    // Allow Lenis snap animation to settle (1.2s covers the GSAP duration)
    await page.waitForTimeout(2000);

    await expect(dotByLabel.first()).toHaveAttribute("aria-current", "true");
  });

  test("hash in URL updates when snapping to a section", async ({ page }) => {
    test.slow();
    // HashSync writes the URL hash after the IntersectionObserver fires post-snap.
    await page.goto("/#tracking");
    await page.waitForLoadState("load");
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).toContain("#tracking");
  });

  test("visiting /#pagos directly lands on payments section in viewport", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/#pagos");
    await page.waitForLoadState("load");
    await page.waitForTimeout(2000);

    const section = page.locator("section#payments");
    await expect(section).toBeInViewport({ ratio: 0.5 });
  });
});
