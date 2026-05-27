import { test, expect } from "@playwright/test";

// HeroCanvas renders:
//   <WebGLFallback /> always
//   {useShader && <HeroShader />}   ← only when !reducedMotion && webglSupported && tier !== "low"
//
// HeroShader appends a <canvas> element inside its div wrapper (aria-hidden).
// With reduced-motion, useShader is false → the HeroShader dynamic import is not mounted
// → no <canvas> is appended inside the hero section.

test.describe("prefers-reduced-motion behaviour", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Give React a moment to re-render with the media preference
    await page.waitForTimeout(600);
  });

  test("WebGL canvas is NOT mounted inside the hero section", async ({
    page,
  }) => {
    // HeroShader appends a canvas as a direct child of its wrapper div inside #hero.
    // With reduced motion, HeroShader is not rendered → canvas should not be present.
    const heroCanvas = page.locator("section#hero canvas");
    await expect(heroCanvas).toHaveCount(0);
  });

  test("WebGL fallback background is visible in the hero", async ({ page }) => {
    // WebGLFallback renders a div[aria-hidden] with gradient layers inside #hero.
    // It is always present regardless of reduced-motion.
    const fallback = page.locator(
      "section#hero div[aria-hidden='true'] div.absolute.inset-0",
    );
    await expect(fallback.first()).toBeAttached();
  });

  test("page scrolls natively without Lenis snap (scroll position changes freely)", async ({
    page,
  }) => {
    // With reduced-motion, Lenis is not instantiated.
    // Native scroll should work: scrolling by viewport height moves the page.
    const before = await page.evaluate(() => window.scrollY);

    await page.evaluate(() => {
      window.scrollBy({ top: window.innerHeight, behavior: "instant" });
    });
    await page.waitForTimeout(300);

    const after = await page.evaluate(() => window.scrollY);
    // The page should have scrolled (Lenis is not intercepting)
    expect(after).toBeGreaterThan(before);
  });
});
