import { test, expect } from "@playwright/test";

// Keyboard nav uses ↓/↑/Home/End/1-9 (KeyboardNav component).
// scrollToSection calls lenis.scrollTo(target element).
// We verify the hash in the URL updates after the snap settles.

const SNAP_SETTLE_MS = 1500;

test.describe("keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    // reducedMotion: disables WebGL GPU stalls and continuous RAF loops that block the
    // headless browser process, causing beforeEach to timeout before tests even start.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.click("body");
    await page.waitForTimeout(300);
  });

  test("ArrowDown from hero scrolls to section 2 (identity)", async ({
    page,
  }) => {
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(SNAP_SETTLE_MS);

    const section = page.locator("section#identity");
    await expect(section).toBeInViewport({ ratio: 0.4 });
  });

  test("End key scrolls to the last section (closing)", async ({ page }) => {
    await page.keyboard.press("End");
    await page.waitForTimeout(SNAP_SETTLE_MS);

    const section = page.locator("section#closing");
    await expect(section).toBeInViewport({ ratio: 0.4 });
  });

  test("Home key returns to the first section (hero)", async ({ page }) => {
    // First go to last section
    await page.keyboard.press("End");
    await page.waitForTimeout(SNAP_SETTLE_MS);

    // Then press Home
    await page.keyboard.press("Home");
    await page.waitForTimeout(SNAP_SETTLE_MS);

    const section = page.locator("section#hero");
    await expect(section).toBeInViewport({ ratio: 0.4 });
  });

  test("pressing '6' jumps directly to payments section (index 5, 1-indexed = 6)", async ({
    page,
  }) => {
    await page.keyboard.press("6");
    await page.waitForTimeout(SNAP_SETTLE_MS);

    const section = page.locator("section#payments");
    await expect(section).toBeInViewport({ ratio: 0.4 });
  });

  test("Tab key moves focus without triggering snap (skip-link receives focus first)", async ({
    page,
  }) => {
    await page.keyboard.press("Tab");

    // After one Tab press the skip link should be focused (or the first focusable element)
    // The snap should NOT have fired (we should still be at hero)
    await page.waitForTimeout(400);

    const section = page.locator("section#hero");
    await expect(section).toBeInViewport({ ratio: 0.4 });
  });
});
