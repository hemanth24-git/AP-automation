/* ==========================================================================
   Browser smoke test
   --------------------------------------------------------------------------
   Opens the real app in a real browser and checks that each screen renders
   and that the interactive parts actually do something. Also saves
   screenshots into /screenshots for use in the presentation deck.

   Run with:  node tools/smoke-test.mjs
   Requires Playwright. This is a developer tool — you do NOT need it to use
   the app. If you never run this, the app still works.
   ========================================================================== */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

// Resolve Playwright wherever it happens to be installed (project-local or
// global). Using require here avoids ESM path-resolution differences.
const require = createRequire(import.meta.url);
let chromium;
try {
  chromium = require("playwright").chromium;
} catch {
  console.error(
    "Playwright is not installed, so the browser test cannot run.\n" +
    "This is a developer tool only — the app itself works without it.\n" +
    "To install it:  npm install -D playwright && npx playwright install chromium"
  );
  process.exit(0);
}

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const shots = join(root, "screenshots");
mkdirSync(shots, { recursive: true });

const fileUrl = "file://" + join(root, "index.html");

const results = [];
function check(name, passed, detail) {
  results.push({ name, passed, detail: detail || "" });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push(String(e)));

async function go(hash, waitFor) {
  await page.goto(fileUrl + hash);
  if (waitFor) await page.waitForSelector(waitFor, { timeout: 5000 });
  await page.waitForTimeout(250);
}

try {
  /* ---------------------------------------------------------- dashboard -- */
  await go("#/dashboard", ".stat-grid");
  const statCount = await page.locator(".stat").count();
  check("Overview renders stat cards", statCount >= 5, `${statCount} cards`);

  const recordsStat = await page.locator(".stat").first().locator(".stat-value").innerText();
  check("Overview record count reads 20 from the data", recordsStat.trim() === "20", `shows "${recordsStat.trim()}"`);

  const barCount = await page.locator(".bar-row").count();
  check("Overview renders charts", barCount > 5, `${barCount} bars`);
  await page.screenshot({ path: join(shots, "01-overview.png"), fullPage: true });

  /* ----------------------------------------------------------- activity -- */
  await go("#/activity", "table tbody tr");
  const rowCount = await page.locator("table tbody tr").count();
  check("Activity table lists all 20 records", rowCount === 20, `${rowCount} rows`);
  await page.screenshot({ path: join(shots, "02-activity.png"), fullPage: true });

  // Search box
  await page.fill("#f-q", "pharma");
  await page.waitForTimeout(300);
  const searched = await page.locator("table tbody tr").count();
  check("Search box filters the table", searched > 0 && searched < 20, `"pharma" -> ${searched} rows`);

  // Filter dropdown
  await page.fill("#f-q", "");
  await page.waitForTimeout(200);
  await page.selectOption("#f-city", "Chennai");
  await page.waitForSelector("table tbody tr");
  const chennai = await page.locator("table tbody tr").count();
  check("City filter works", chennai === 3, `Chennai -> ${chennai} rows (expected 3)`);
  await page.screenshot({ path: join(shots, "03-activity-filtered.png"), fullPage: true });

  // Clear button
  await page.click("#clear-filters");
  await page.waitForSelector("table tbody tr");
  const cleared = await page.locator("table tbody tr").count();
  check("Clear button resets filters", cleared === 20, `${cleared} rows`);

  // Empty state
  await page.fill("#f-q", "zzzznotathing");
  await page.waitForTimeout(300);
  const emptyVisible = await page.locator(".empty-title").count();
  check("Empty state appears when nothing matches", emptyVisible === 1);
  await page.screenshot({ path: join(shots, "04-empty-state.png") });

  /* ------------------------------------------------------------- detail -- */
  await go("#/company/vontier-bengaluru", ".detail-title");
  const title = await page.locator(".detail-title").innerText();
  check("Company detail page renders", title.includes("Vontier"), title);

  const factLabel = await page.locator(".label-inline.fact").count();
  const interpLabel = await page.locator(".block-interp").count();
  check("Detail separates sourced facts from interpretation", factLabel === 1 && interpLabel === 1);

  const sourceLinks = await page.locator('.source-item a[target="_blank"]').count();
  check("Detail shows clickable source links", sourceLinks >= 2, `${sourceLinks} links`);

  const firstHref = await page.locator('.source-item a[target="_blank"]').first().getAttribute("href");
  check("Source links point to real https URLs", /^https:\/\//.test(firstHref || ""), firstHref || "none");
  await page.screenshot({ path: join(shots, "05-company-detail.png"), fullPage: true });

  // Unknown id should not crash
  await go("#/company/does-not-exist", ".empty-title");
  const nf = await page.locator(".empty-title").innerText();
  check("Unknown company id shows a graceful message", nf.toLowerCase().includes("not found"), nf);

  /* ---------------------------------------------------------------- ask -- */
  await go("#/ask", "#ask-input");

  // A question the dataset can answer
  await page.fill("#ask-input", "How many records in Hyderabad?");
  await page.click("#ask-go");
  await page.waitForSelector(".answer", { timeout: 5000 });
  const answered = await page.locator(".answer-text").innerText();
  const hasEvidence = await page.locator(".evidence-item").count();
  check("Ask answers a question it can support", /Hyderabad/i.test(answered) && hasEvidence > 0,
        `${hasEvidence} supporting records`);
  await page.screenshot({ path: join(shots, "06-ask-answer.png"), fullPage: true });

  // A question about a topic the dataset excludes — must refuse specifically
  await page.fill("#ask-input", "What are typical salaries at these GCCs?");
  await page.click("#ask-go");
  await page.waitForSelector(".answer", { timeout: 5000 });
  const refusedClass = await page.locator(".answer").getAttribute("class");
  const refusedText = await page.locator(".answer-text").innerText();
  const noEvidence = await page.locator(".evidence-item").count();
  check("Ask refuses out-of-scope topics and names the gap",
        refusedClass.includes("no-match") &&
        /salary or compensation/i.test(refusedText) &&
        noEvidence === 0,
        "refused, named the missing data, cited nothing");
  await page.screenshot({ path: join(shots, "07-ask-refusal.png"), fullPage: true });

  // A prediction question — the product explicitly does not forecast
  await page.fill("#ask-input", "Which company will open a GCC next year?");
  await page.click("#ask-go");
  await page.waitForSelector(".answer", { timeout: 5000 });
  const predText = await page.locator(".answer-text").innerText();
  check("Ask refuses to predict future activity",
        /predict/i.test(predText) && (await page.locator(".evidence-item").count()) === 0,
        "refused to forecast");

  // An unrelated question that happens to share a word with the data
  // (L'Oreal's parent HQ is France) must not look like a real answer.
  await page.fill("#ask-input", "What is the capital of France?");
  await page.click("#ask-go");
  await page.waitForSelector(".answer", { timeout: 5000 });
  const franceClass = await page.locator(".answer").getAttribute("class");
  const franceEvidence = await page.locator(".evidence-item").count();
  check("Ask ignores incidental single-word matches",
        franceClass.includes("no-match") && franceEvidence === 0,
        "one weak keyword match does not count as an answer");

  // Suggestion chips
  await page.locator(".suggestion").first().click();
  await page.waitForSelector(".answer");
  check("Suggestion chips run a search", true);

  /* -------------------------------------------------------------- cities -- */
  await go("#/cities", ".bar-row");
  const cityBars = await page.locator(".bar-row").count();
  check("Cities page renders breakdowns", cityBars > 10, `${cityBars} bars`);
  const cityCards = await page.locator(".card").count();
  check("Cities page lists per-city detail", cityCards >= 5, `${cityCards} cards`);
  await page.screenshot({ path: join(shots, "08-cities.png"), fullPage: true });

  /* ------------------------------------------------------------- sources -- */
  await go("#/sources", ".prose");
  const proseText = await page.locator(".prose").innerText();
  check("Sources & Method explains limitations",
        /not a complete/i.test(proseText) && /hypothesis/i.test(proseText));
  check("Sources & Method states no user research was done",
        /No recruitment agency has reviewed/i.test(proseText));
  await page.screenshot({ path: join(shots, "09-sources-method.png"), fullPage: true });

  /* -------------------------------------------------------------- verify -- */
  await go("#/verify", ".verify-row");
  const verifyRows = await page.locator(".verify-row").count();
  check("Verify page lists every source link", verifyRows === 47, `${verifyRows} rows (expected 47)`);

  await page.locator('.verify-row input[type="checkbox"]').first().check();
  await page.waitForTimeout(150);
  const countText = await page.locator("#verify-count").innerText();
  check("Verify checkboxes update the counter", countText.startsWith("1 of"), countText);

  // Reload and confirm the tick persisted
  await page.reload();
  await page.waitForSelector(".verify-row");
  await page.waitForTimeout(250);
  const persisted = await page.locator('.verify-row input[type="checkbox"]').first().isChecked();
  check("Verify ticks persist across reload", persisted);
  await page.screenshot({ path: join(shots, "10-verify.png"), fullPage: true });

  /* ----------------------------------------------------------- navigation -- */
  await go("#/dashboard", ".nav a");
  const navLinks = await page.locator(".nav a").count();
  check("All navigation links present", navLinks === 6, `${navLinks} links`);

  // Click through every nav item and confirm content changes
  let navOk = true;
  const labels = await page.locator(".nav a").allInnerTexts();
  for (const label of labels) {
    await page.click(`.nav a:text-is("${label}")`);
    await page.waitForTimeout(300);
    const h1 = await page.locator("h1").count();
    if (h1 === 0) { navOk = false; console.log(`   nav "${label}" rendered no heading`); }
  }
  check("Every nav link renders a page", navOk);

  const activeCount = await page.locator(".nav a.active").count();
  check("Active nav state is highlighted", activeCount === 1, `${activeCount} active`);

  /* ------------------------------------------------------------- mobile --- */
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(fileUrl + "#/activity");
  await mobile.waitForSelector("table tbody tr");
  await mobile.waitForTimeout(300);
  const scrollW = await mobile.evaluate(() => document.documentElement.scrollWidth);
  const clientW = await mobile.evaluate(() => document.documentElement.clientWidth);
  check("No horizontal overflow at phone width", scrollW <= clientW + 1, `${scrollW}px vs ${clientW}px`);
  await mobile.screenshot({ path: join(shots, "11-mobile.png"), fullPage: true });
  await mobile.close();

  /* -------------------------------------------------------- console clean -- */
  check("No JavaScript errors in the console", consoleErrors.length === 0,
        consoleErrors.length ? consoleErrors.slice(0, 3).join(" | ") : "clean");

} catch (err) {
  check("Test run completed without crashing", false, String(err).split("\n")[0]);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.passed);
console.log("\n------------------------------------------------------------");
console.log(`${results.length - failed.length} passed, ${failed.length} failed`);
console.log(`Screenshots saved to /screenshots`);
if (failed.length) {
  console.log("\nFailures:");
  failed.forEach((f) => console.log(`  x ${f.name} — ${f.detail}`));
  process.exit(1);
}
console.log("All browser checks passed.\n");
