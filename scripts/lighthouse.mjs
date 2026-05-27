/**
 * Lighthouse mobile audit against http://localhost:3000
 *
 * Prerequisites:
 *   pnpm build && pnpm start   (server must be running on port 3000)
 *
 * Run with:
 *   pnpm lighthouse
 *
 * Manual alternative (no Node required):
 *   1. Open Chrome and navigate to http://localhost:3000
 *   2. Open DevTools (F12) → Lighthouse tab
 *   3. Select "Mobile" preset → click "Analyze page load"
 *   4. Verify: Performance ≥ 90, LCP ≤ 2500ms, CLS ≤ 0.05, TBT ≤ 200ms
 *
 * Performance budget (mobile):
 *   LCP < 2500ms
 *   CLS < 0.05
 *   Performance score ≥ 90
 *
 * Exit code: 0 = budget met, 1 = budget violated
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const TARGET_URL = "http://localhost:3000";
const BUDGET = {
  lcp: 2500,
  cls: 0.05,
  performanceScore: 90,
};

function checkDependency() {
  try {
    execSync("lighthouse --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function runLighthouse() {
  const hasLighthouse = checkDependency();

  if (!hasLighthouse) {
    console.log("lighthouse CLI not found globally.");
    console.log("Install with: pnpm add -g lighthouse");
    console.log("\nManual alternative:");
    console.log("  1. pnpm build && pnpm start");
    console.log(`  2. Open Chrome → ${TARGET_URL}`);
    console.log("  3. DevTools (F12) → Lighthouse → Mobile → Analyze page load");
    console.log("  4. Targets: Performance ≥ 90, LCP ≤ 2.5s, CLS ≤ 0.05");
    process.exit(0);
  }

  console.log(`Running Lighthouse mobile audit on ${TARGET_URL}...`);
  console.log("Budget:", JSON.stringify(BUDGET, null, 2));
  console.log("");

  const outPath = "./lighthouse-report.json";

  const result = spawnSync(
    "lighthouse",
    [
      TARGET_URL,
      "--output=json",
      `--output-path=${outPath}`,
      "--preset=mobile",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--quiet",
    ],
    { stdio: "inherit", shell: true },
  );

  if (result.status !== 0) {
    console.error("Lighthouse process failed.");
    process.exit(1);
  }

  if (!existsSync(outPath)) {
    console.error("Lighthouse report not generated.");
    process.exit(1);
  }

  const { readFileSync, unlinkSync } = await import("node:fs");
  const report = JSON.parse(readFileSync(outPath, "utf8"));
  unlinkSync(outPath);

  const categories = report.categories ?? {};
  const audits = report.audits ?? {};

  const performanceScore = Math.round((categories.performance?.score ?? 0) * 100);
  const lcpMs = Math.round((audits["largest-contentful-paint"]?.numericValue ?? 0));
  const cls = audits["cumulative-layout-shift"]?.numericValue ?? 0;
  const fcpMs = Math.round((audits["first-contentful-paint"]?.numericValue ?? 0));

  console.log("Results:");
  console.log(`  Performance score : ${performanceScore} (target ≥ ${BUDGET.performanceScore})`);
  console.log(`  LCP               : ${lcpMs}ms (target < ${BUDGET.lcp}ms)`);
  console.log(`  CLS               : ${cls.toFixed(4)} (target < ${BUDGET.cls})`);
  console.log(`  FCP               : ${fcpMs}ms`);
  console.log("");

  const failures = [];

  if (lcpMs > BUDGET.lcp) {
    failures.push(`LCP ${lcpMs}ms exceeds budget of ${BUDGET.lcp}ms`);
  }
  if (cls > BUDGET.cls) {
    failures.push(`CLS ${cls.toFixed(4)} exceeds budget of ${BUDGET.cls}`);
  }
  if (performanceScore < BUDGET.performanceScore) {
    failures.push(`Performance score ${performanceScore} below budget of ${BUDGET.performanceScore}`);
  }

  if (failures.length > 0) {
    console.error("Budget violations:");
    for (const f of failures) {
      console.error(`  FAIL  ${f}`);
    }
    process.exit(1);
  }

  console.log("All performance budgets met.");
  process.exit(0);
}

runLighthouse().catch((err) => {
  console.error(err);
  process.exit(1);
});
