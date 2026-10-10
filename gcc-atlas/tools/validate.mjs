/* ==========================================================================
   Dataset validation
   --------------------------------------------------------------------------
   Checks the dataset for mistakes before you present it. Run with:

       node tools/validate.mjs

   It does NOT open the source URLs (that requires the internet and is your
   job — see the Verify page in the app). It checks internal consistency:
   required fields present, dates sensible, URLs well-formed, no duplicates,
   confidence labels valid, and that stated counts match reality.
   ========================================================================== */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "..", "data", "records.js");

// The dataset is a browser script, so evaluate it with a fake `window`.
const source = readFileSync(dataPath, "utf8");
const sandbox = { window: {}, module: { exports: {} } };
const run = new Function("window", "module", source + "\nreturn { GCC_RECORDS, GCC_META };");
const { GCC_RECORDS: records, GCC_META: meta } = run(sandbox.window, sandbox.module);

const errors = [];
const warnings = [];

const VALID_CONFIDENCE = ["High", "Medium", "Low"];
const VALID_CATEGORY = ["New GCC", "Expansion", "Announced / Planned", "Hiring / Investment"];
const VALID_STATUS = ["Operational", "Announced"];
const VALID_SRC_TYPE = ["primary", "trade", "news"];

const REQUIRED = [
  "id", "company", "parentHq", "industry", "city", "state", "category",
  "status", "dateLabel", "summary", "interpretation", "whyItMatters",
  "sources", "confidence", "confidenceBasis"
];

const seenIds = new Set();
const seenCompanyCity = new Set();

records.forEach((r, i) => {
  const where = `record ${i + 1} (${r.id || r.company || "unnamed"})`;

  REQUIRED.forEach((field) => {
    const v = r[field];
    if (v === undefined || v === null || v === "" ||
        (Array.isArray(v) && v.length === 0)) {
      errors.push(`${where}: missing required field "${field}"`);
    }
  });

  if (seenIds.has(r.id)) errors.push(`${where}: duplicate id "${r.id}"`);
  seenIds.add(r.id);

  const cc = `${r.company}|${r.city}`;
  if (seenCompanyCity.has(cc)) warnings.push(`${where}: another record already covers ${r.company} in ${r.city}`);
  seenCompanyCity.add(cc);

  if (!/^[a-z0-9-]+$/.test(r.id || "")) {
    errors.push(`${where}: id must be lowercase letters, numbers and hyphens only`);
  }

  if (!VALID_CONFIDENCE.includes(r.confidence)) {
    errors.push(`${where}: confidence "${r.confidence}" is not one of ${VALID_CONFIDENCE.join(", ")}`);
  }
  if (!VALID_CATEGORY.includes(r.category)) {
    errors.push(`${where}: category "${r.category}" is not one of ${VALID_CATEGORY.join(", ")}`);
  }
  if (!VALID_STATUS.includes(r.status)) {
    errors.push(`${where}: status "${r.status}" is not one of ${VALID_STATUS.join(", ")}`);
  }

  // Dates
  if (r.eventDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.eventDate)) {
      errors.push(`${where}: eventDate "${r.eventDate}" must look like YYYY-MM-DD`);
    } else {
      const d = new Date(r.eventDate + "T00:00:00Z");
      if (Number.isNaN(d.getTime())) {
        errors.push(`${where}: eventDate "${r.eventDate}" is not a real date`);
      }
      const year = Number(r.eventDate.slice(0, 4));
      if (year < 2024 || year > 2027) {
        warnings.push(`${where}: eventDate year ${year} is outside the expected 2024-2027 window`);
      }
    }
    if (!["day", "month"].includes(r.datePrecision)) {
      errors.push(`${where}: datePrecision must be "day" or "month" when eventDate is set`);
    }
  } else {
    warnings.push(`${where}: no eventDate — it will sort last and show as "Date unknown"`);
  }

  // Sources
  (r.sources || []).forEach((s, j) => {
    const sw = `${where} source ${j + 1}`;
    if (!s.name) errors.push(`${sw}: missing source name`);
    if (!s.url) {
      errors.push(`${sw}: missing url`);
    } else if (!/^https:\/\/[^\s"']+$/.test(s.url)) {
      errors.push(`${sw}: url must be a single https:// URL — got "${s.url}"`);
    } else if (/^https:\/\/[^/]+\/?$/.test(s.url)) {
      warnings.push(`${sw}: url points at a site root or landing page, not an article — "${s.url}"`);
    }
    if (!VALID_SRC_TYPE.includes(s.type)) {
      errors.push(`${sw}: type "${s.type}" is not one of ${VALID_SRC_TYPE.join(", ")}`);
    }
  });

  // Honesty checks: an "Announced" record should not be described as operational.
  if (r.status === "Announced" && r.category === "New GCC") {
    warnings.push(`${where}: status is Announced but category is "New GCC" — consider "Announced / Planned"`);
  }

  // A High-confidence record should have a primary source behind it.
  if (r.confidence === "High" && !(r.sources || []).some((s) => s.type === "primary")) {
    errors.push(`${where}: confidence is High but no primary source is cited`);
  }

  // Headcount claims must say where they came from.
  if (r.headcountClaim && !r.headcountClaim.basis) {
    errors.push(`${where}: headcountClaim is missing a "basis" explaining where the figure came from`);
  }

  // Interpretation must not be identical to the summary.
  if (r.summary && r.interpretation && r.summary.trim() === r.interpretation.trim()) {
    errors.push(`${where}: interpretation is identical to summary — they must be different`);
  }
});

// Metadata consistency
if (meta.recordCount !== records.length) {
  errors.push(`GCC_META.recordCount says ${meta.recordCount} but there are ${records.length} records`);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.researchDate || "")) {
  errors.push(`GCC_META.researchDate "${meta.researchDate}" must look like YYYY-MM-DD`);
}

// Report
const cities = [...new Set(records.map((r) => r.city))];
const industries = [...new Set(records.map((r) => r.industry))];
const sourceTotal = records.reduce((n, r) => n + r.sources.length, 0);
const withPrimary = records.filter((r) => r.sources.some((s) => s.type === "primary")).length;

console.log("GCC Atlas — dataset validation");
console.log("------------------------------------------------------------");
console.log(`Records:            ${records.length}`);
console.log(`Cities:             ${cities.length}  (${cities.join(", ")})`);
console.log(`Industries:         ${industries.length}`);
console.log(`Source links:       ${sourceTotal}`);
console.log(`With primary source:${String(withPrimary).padStart(3)} of ${records.length} records`);
console.log(`Operational:        ${records.filter((r) => r.status === "Operational").length}`);
console.log(`Announced:          ${records.filter((r) => r.status === "Announced").length}`);
console.log("Confidence:         " + VALID_CONFIDENCE
  .map((c) => `${c} ${records.filter((r) => r.confidence === c).length}`).join(" · "));
console.log("------------------------------------------------------------");

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s) — worth a look, not necessarily wrong:`);
  warnings.forEach((w) => console.log(`  ~ ${w}`));
}

if (errors.length) {
  console.log(`\n${errors.length} ERROR(S) — these must be fixed:`);
  errors.forEach((e) => console.log(`  x ${e}`));
  console.log("\nValidation FAILED.\n");
  process.exit(1);
}

console.log("\nAll checks passed. No errors found.");
console.log("Reminder: this does not confirm the source URLs say what the records claim.");
console.log("Open the app's Verify page and check each link yourself.\n");
