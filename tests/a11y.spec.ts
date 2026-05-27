import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SECTIONS = [
  { id: "hero", hash: "inicio" },
  { id: "identity", hash: "tindivo" },
  { id: "problem", hash: "antes" },
  { id: "restaurants", hash: "restaurantes" },
  { id: "tracking", hash: "tracking" },
  { id: "payments", hash: "pagos" },
  { id: "rewards", hash: "promos" },
  { id: "connected", hash: "vision" },
  { id: "closing", hash: "pronto" },
] as const;

test.describe("accessibility (WCAG 2.1 AA)", () => {
  for (const section of SECTIONS) {
    test(`section #${section.id}: zero critical/serious axe violations`, async ({
      page,
    }) => {
      // axe-core analysis on complex DOM (Rewards wheel, Connected constellation) can take
      // 30-60s in headless. test.slow() triples the default timeout to 90s.
      test.slow();
      // reducedMotion: disables WebGL shader (GPU ReadPixels stalls block headless renderer)
      // and continuous RAF loops that prevent page from settling for axe analysis.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/#${section.hash}`);
      await page.waitForLoadState("load");
      await page.waitForTimeout(600);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      if (critical.length > 0) {
        const summary = critical
          .map(
            (v) =>
              `[${v.impact}] ${v.id}: ${v.description}\n  nodes: ${v.nodes
                .slice(0, 2)
                .map((n) => n.html)
                .join(", ")}`,
          )
          .join("\n");
        expect(critical, `Violations in #${section.id}:\n${summary}`).toHaveLength(0);
      }

      expect(critical).toHaveLength(0);
    });
  }

  test("skip-link is focusable and visible when focused", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    // Tab to the skip link (should be the first focusable element)
    await page.keyboard.press("Tab");

    // The skip link text should now be visible
    const skipLink = page.locator('a[href="#main"]');
    if (await skipLink.count() === 0) {
      // Also try common patterns
      const altSkipLink = page.locator("text=Saltar al contenido").first();
      await expect(altSkipLink).toBeVisible();
    } else {
      await expect(skipLink).toBeVisible();
    }
  });

  test("page has exactly one h1 (hero headline)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
  });

  test("each non-hero section has an h2 heading", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    for (const section of SECTIONS.filter((s) => s.id !== "hero")) {
      const h2 = page.locator(`section#${section.id} h2`);
      const count = await h2.count();
      expect(
        count,
        `Section #${section.id} should have at least one <h2>`,
      ).toBeGreaterThan(0);
    }
  });

  test("ThemeToggle has aria-label", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const toggle = page.locator('button[aria-label="Cambiar tema"]');
    await expect(toggle).toBeAttached();
  });

  test("ThemeToggle has aria-pressed attribute after mount", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("load");

    const toggle = page.locator('button[aria-label="Cambiar tema"]');
    // Wait for React hydration to set aria-pressed (useEffect sets mounted=true).
    // aria-pressed is undefined until mount — poll until it appears.
    await expect(toggle).toHaveAttribute("aria-pressed", /^(true|false)$/, { timeout: 5000 });
  });

  test("brand orange #F97316 is not used as body text color", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    // Check that no paragraph or span with small body text uses brand orange directly
    const violation = await page.evaluate(() => {
      const brandOrange = "rgb(249, 115, 22)"; // #F97316
      const bodyTextSelectors = [
        "p",
        "li",
        "td",
        "th",
        "span:not([class*='brand']):not([class*='eyebrow'])",
      ];

      for (const selector of bodyTextSelectors) {
        const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
        for (const el of els) {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          const color = style.color;
          // Only flag body text (< 24px) with brand orange color
          if (color === brandOrange && fontSize < 24) {
            return { found: true, tag: el.tagName, text: el.textContent?.slice(0, 50), fontSize };
          }
        }
      }
      return { found: false };
    });

    expect(
      violation.found,
      `Brand orange #F97316 used as body text (< 24px): ${JSON.stringify(violation)}`,
    ).toBe(false);
  });
});
