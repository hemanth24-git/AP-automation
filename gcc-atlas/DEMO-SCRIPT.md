# Demo script — GCC Atlas

A four-minute walkthrough of the prototype. Practise it twice out loud before the
interview; it should feel like showing someone round, not reading.

**Before you start:** open `index.html` in your browser, go to the **Overview**
page, and close other tabs. Make the browser window reasonably wide.

---

## The 15-second opening

> "This is GCC Atlas. It's a record of 20 publicly reported GCC events in India,
> where every single claim can be traced back to its source. I'll show you the
> loop, then the part I'm most pleased with."

---

## 1. Overview (30 seconds)

**Point at the banner under the heading.**

> "First thing you see is what this actually is — 20 records, not a complete
> register. The brief says there are 2,000+ GCCs in India. I'm showing you 20 and
> saying so up front."

**Point at the stat cards.**

> "Every one of these numbers is counted from the records when the page loads.
> Nothing is typed in by hand, so the figures can't drift away from the data."

**Scroll to the charts.**

> "Activity by city, by type, and by evidence strength. That third one matters —
> it's how well-sourced each record is, not how big the event is."

---

## 2. Activity table (40 seconds)

**Click "Activity" in the nav.**

> "All 20 records. Search filters as you type —"

**Type `pharma` in the search box. Pause so they see it narrow.**

> "— and the filters work on city, activity type and confidence."

**Clear the search. Select "Chennai" from the City dropdown.**

> "Three records in Chennai."

**Click "Clear".**

> "One thing worth noticing: announced-but-not-yet-open is a separate category from
> operational. A lot of GCC lists mix those together, which makes the market look
> bigger than it is."

---

## 3. Company detail — the important screen (60 seconds)

**Click any company. Vontier is a good one — it has a primary source.**

> "This is where the product earns its keep."

**Point at the blue-marked block.**

> "This is what the sources actually say. I've kept it close to their wording."

**Point at the purple block below.**

> "And this is labelled 'our interpretation — not from the sources'. It's styled
> differently so you can't mistake one for the other. That separation is the whole
> design principle."

**Point at the Headcount claim card on the right.**

> "Headcount figures get their own box with where the number came from. That matters
> more than it sounds — JPMorgan's Mumbai campus gets reported as '30,000 employees',
> but that's building capacity for 2029, and the reporting says it's consolidating
> teams they already have in India. It's not 30,000 new jobs. The record says so."

**Point at the Sources section.**

> "Every source is tagged — company press release, trade press, or news — dated, and
> clickable. This one's a press release on Vontier's own investor site, which is why
> it's rated High confidence. The reason for that rating is written out, there."

---

## 4. Ask — the best moment (60 seconds)

**Click "Ask".**

> "You can ask it a question in plain English."

**Type: `Which companies have announced but not opened yet?` and press Enter.**

> "It answers from the 20 records and shows which ones support the answer, with
> their sources underneath."

**Now the important bit. Click the suggestion chip: "What are typical salaries at these GCCs?"**

**Let them read it.**

> "That's the part I'd want you to see. It doesn't have salary data, so it says
> exactly that, names what's missing, and cites nothing — because it has nothing.
> A chatbot would have produced a confident paragraph of made-up numbers."

**Point at the grey panel at the bottom.**

> "And I'm explicit about what this is. It's keyword search in plain JavaScript —
> it is not AI, there's no language model, no API key, nothing to pay for. I chose
> that deliberately. A language model would give fluent, unverifiable answers, which
> is the exact problem this product exists to solve."

*(If you have time, also click "Which company will open a GCC next year?" — it
refuses to predict, which reinforces the positioning.)*

---

## 5. Sources & Method (20 seconds)

**Click "Sources & Method". Scroll briefly.**

> "How records were chosen, how confidence is assigned, what I deliberately left
> out and why, and the known problems in the data — including that companies use
> six different names for the same thing, which means any search-based method misses
> centres."

---

## 6. Verify — close on the honest note (30 seconds)

**Click "Verify".**

> "And this is the page I'd most want you to see. All 47 source links in one
> checklist. The dataset was built from search results, and the environment I built
> it in blocked opening pages directly — so these links were identified but not yet
> read first-hand. Rather than hide that, the product ships the checklist to fix it."

**Tick one box.**

> "Ticks are saved as you work through them."

---

## Closing line

> "So: 20 records, 47 sources, five cities. It's small on purpose. Everything in it
> points at something you can open, everything I've interpreted is labelled as mine,
> and everything it doesn't know is written down."

---

## Quick facts to have ready

| Question | Answer |
|---|---|
| How many records? | 20 |
| How many sources? | 47 |
| Cities | 5 — Hyderabad (6), Bengaluru (7), Pune (3), Chennai (3), Mumbai (1) |
| Industries | 19 |
| Operational vs announced | 15 operational, 5 announced |
| Records with a primary source | 8 of 20 |
| Confidence split | 4 High, 14 Medium, 2 Low |
| Research date | 10 October 2026 |
| Tech | Plain HTML, CSS, JavaScript. No framework, server, database or API key. |
| Tests | 30 browser checks, all passing |

---

## If something goes wrong mid-demo

**The page won't load** — the folder got split up. Have a backup: either the
GitHub Pages link (README section 8) or screenshots in the `screenshots/` folder.

**You're asked something you don't know** — say so, then say how you'd find out.
"I don't know — I'd check it against the source" is a better answer than a guess.
It's also exactly the behaviour the product is built around.

**You're short on time** — cut sections 1, 2 and 5. The company detail page and the
Ask refusal are the two that matter.
