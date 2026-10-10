# GCC Atlas

A source-backed view of India's Global Capability Centre (GCC) activity, built for
recruitment and staffing teams.

Built as the Product Intern assignment for Flexiple. Research date: **10 October 2026**.

---

## The short version

**To use the app: double-click `index.html`. That is the whole setup.**

No installation. No Node.js. No Python. No account. No API key. No internet
connection needed (except to click through to source articles). Nothing to pay for.

---

## Table of contents

1. [What you need to install](#1-what-you-need-to-install)
2. [How to open the app](#2-how-to-open-the-app)
3. [How to open the presentation deck](#3-how-to-open-the-presentation-deck)
4. [What is in each file](#4-what-is-in-each-file)
5. [What the app does](#5-what-the-app-does)
6. [What the app does NOT do](#6-what-the-app-does-not-do)
7. [Optional: developer tools](#7-optional-developer-tools)
8. [Optional: putting it online for free](#8-optional-putting-it-online-for-free)
9. [How to update the dataset](#9-how-to-update-the-dataset)
10. [Common problems and fixes](#10-common-problems-and-fixes)
11. [Before you submit](#11-before-you-submit)

---

## 1. What you need to install

### To use the app and the deck: **nothing new**

| What | Do you need it? | Why |
|---|---|---|
| A web browser | You already have one | Chrome, Edge or Firefox all work. Edge comes with Windows. |
| PowerPoint, or a free alternative | For the deck only | See section 3 if you don't have PowerPoint. |

That is genuinely it. This was a deliberate design decision, not a shortcut —
see `NOTES.md` for the reasoning, because it is worth being able to explain.

### Only if you want to run the developer tools (completely optional)

The app works perfectly without these. They are for checking the data and
re-generating the deck.

- **Node.js (version 20 or newer)** — runs the data validation script
  Download: <https://nodejs.org/en/download> (choose the Windows Installer, LTS version)
- **Python (version 3.10 or newer)** — rebuilds the PowerPoint deck
  Download: <https://www.python.org/downloads/windows/>
  When installing, tick **"Add Python to PATH"** on the first screen.

---

## 2. How to open the app

### The simple way

1. Open the `gcc-atlas` folder in File Explorer.
2. Double-click **`index.html`**.
3. It opens in your default browser. You are done.

The address bar will show something like
`file:///C:/Users/YourName/Downloads/gcc-atlas/index.html`.
That is correct — the app runs from your own computer, not a website.

> **Keep the folder together.** The app reads `data/records.js` and
> `assets/`. If you move `index.html` out on its own, it will show a
> "Dataset did not load" message.

### To stop it

Close the browser tab. There is nothing running in the background, and nothing
to shut down.

### To restart it

Double-click `index.html` again. Or press **F5** in the browser to reload.

### If you'd rather run it on a local address

Not required, but if you want it at `http://localhost:8000` instead of a
`file:///` address, and you have Python installed:

1. Open the `gcc-atlas` folder.
2. Click in the address bar at the top of File Explorer, type `cmd`, press Enter.
3. Type this and press Enter:
   ```
   python -m http.server 8000
   ```
4. Open <http://localhost:8000> in your browser.
5. To stop it, click the black window and press **Ctrl + C**.

---

## 3. How to open the presentation deck

The deck is at:

```
deck/GCC-Atlas-Flexiple-Assignment.pptx
```

**18 slides, 16:9 widescreen.**

| If you have | Do this |
|---|---|
| Microsoft PowerPoint | Double-click the file |
| No PowerPoint | Go to <https://slides.google.com>, click **Blank**, then **File → Import slides**, and upload the `.pptx`. Free with any Google account. |
| Prefer not to use Google | Install LibreOffice (free): <https://www.libreoffice.org/download/download-libreoffice/> — it opens `.pptx` files |

**To present:** press **F5** in PowerPoint (or **Ctrl+F5** in Google Slides).

**To send it to Flexiple:** upload it to Google Drive or Google Slides, set sharing
to "Anyone with the link can view", and paste that link into your email. The
assignment asks for links with access enabled, so check the link works in a
private/incognito browser window before sending.

A slide-by-slide speaking guide is in **`DEMO-SCRIPT.md`**.

---

## 4. What is in each file

```
gcc-atlas/
│
├── index.html              The app. Double-click this.
│
├── data/
│   └── records.js          THE DATASET — all 20 researched records, with
│                           sources, dates, confidence levels and caveats.
│                           This is the most important file in the project.
│
├── assets/
│   ├── styles.css          All the visual design
│   └── app.js              All the app logic, including the Ask feature
│
├── deck/
│   └── GCC-Atlas-Flexiple-Assignment.pptx     The presentation
│
├── screenshots/            Screenshots of the real app, used in the deck
│
├── tools/                  Optional developer scripts (see section 7)
│   ├── validate.mjs        Checks the dataset for mistakes
│   ├── smoke-test.mjs      Drives the app in a browser and tests it
│   └── build-deck.py       Rebuilds the PowerPoint file
│
├── README.md               This file
├── NOTES.md                Interview preparation — read this one
└── DEMO-SCRIPT.md          How to demo the prototype in ~4 minutes
```

---

## 5. What the app does

Six screens, all working:

| Screen | What it does |
|---|---|
| **Overview** | Summary of the dataset. Every number is counted from the records when the page loads — none of it is typed in by hand. |
| **Activity** | All 20 records in a table. Search as you type; filter by city, activity type and confidence. Click a company to open its record. |
| **Company detail** | The full record: what the sources state, what is my own interpretation (clearly labelled and styled differently), why it might matter to a recruiter, caveats, and every source as a clickable link. |
| **Ask** | Type a question in plain English. It searches the 20 records and shows the supporting records with their sources. If it cannot answer, it says so and explains what is missing. |
| **Cities** | Breakdowns by city, industry and year — counted only from these 20 records, with a warning that this is not market share. |
| **Sources & Method** | How records were chosen, how confidence is assigned, what the dataset excludes and why, and known problems in the data. |
| **Verify** | All 47 source links in one checklist so each can be opened and confirmed. Ticks are saved in your browser. |

### About the "Ask" feature — read this before you demo it

**It is a local keyword search, not AI.** It does not use ChatGPT, Claude, or any
language model. It does not connect to the internet. There is no API key and no cost.

How it actually works, in order:
1. Takes your question and removes common filler words ("the", "how", "many"…).
2. Looks for patterns it recognises — a city name, counting words, "announced",
   "expansion", "primary source".
3. Checks whether you asked about something the dataset deliberately excludes
   (salaries, costs, incentives, contacts, provider ratings, predictions). If so,
   it refuses and names what is missing.
4. Otherwise it scores all 20 records by keyword overlap, weighting company names
   and cities more heavily, and describes what it found.
5. If nothing scores highly enough, it says so rather than guessing.

The app states all of this on the Ask page itself. **Do not describe it as AI** —
being straight about this is a strength, not a weakness.

---

## 6. What the app does NOT do

Stated plainly, because claiming otherwise would be the fastest way to lose credibility:

- **It is not live.** The dataset is a fixed snapshot in a file. Nothing updates
  automatically. There is no database and no server.
- **It is not complete.** 20 records. The assignment brief cites 2,000+ GCCs in India.
  This is a curated sample for a prototype.
- **It does not predict.** It reports what has already been publicly announced.
- **It has not been validated by users.** No recruitment professional has reviewed
  or tested it. Everything about what such firms need is a hypothesis.
- **The source links have not been confirmed first-hand yet.** They were found via
  web search; the build environment blocked opening pages directly. See section 11.

---

## 7. Optional: developer tools

You never need these to use or demo the app.

Open a command window in the `gcc-atlas` folder (click the File Explorer address
bar, type `cmd`, press Enter), then:

### Check the dataset for mistakes

```
node tools/validate.mjs
```

Checks that every record has its required fields, that dates are real, that URLs
are well-formed, that no record claims "High confidence" without a primary source,
and that the stated record count matches reality. Prints a summary and exits with
an error if anything is wrong.

### Test the app in a real browser

```
npm install playwright
npx playwright install chromium
node tools/smoke-test.mjs
```

Opens the app in a real browser and runs 30 checks — every screen renders, filters
work, the Ask feature refuses what it should, verification ticks persist, there are
no JavaScript errors, and nothing overflows on a phone screen. It also re-saves the
screenshots used in the deck.

*(Last run: 30 passed, 0 failed.)*

### Rebuild the deck

```
pip install python-pptx pillow
python tools/build-deck.py
```

Regenerates `deck/GCC-Atlas-Flexiple-Assignment.pptx` from scratch, including fresh
crops of the screenshots. Only needed if you change the slides.

---

## 8. Optional: putting it online for free

The app runs fine from your laptop and you do **not** need to do this. But a link
is easier to share than a zip file, and GitHub Pages is free.

1. Create a free account at <https://github.com>.
2. Create a new repository called `gcc-atlas`. Make it **Public**.
3. On the new repository page, click **uploading an existing file**.
4. Drag in the contents of the `gcc-atlas` folder (including the `data`, `assets`
   and `deck` folders). Click **Commit changes**.
5. Go to **Settings → Pages**.
6. Under "Branch", choose `main` and `/ (root)`. Click **Save**.
7. Wait 1–2 minutes, then refresh. GitHub shows your link, which looks like
   `https://yourusername.github.io/gcc-atlas/`.

That link works on any device and costs nothing. Test it in a private browser
window before sending it to anyone.

---

## 9. How to update the dataset

All 20 records live in **`data/records.js`**. You can edit it in Notepad, though
VS Code (free, <https://code.visualstudio.com/>) is much easier to read.

Each record looks like this:

```javascript
{
  id: "company-city",            // lowercase, hyphens only, must be unique
  company: "Company Name",
  parentHq: "United States",
  industry: "Pharmaceuticals",
  city: "Hyderabad",
  state: "Telangana",
  category: "New GCC",           // or "Expansion", "Announced / Planned",
                                 //    "Hiring / Investment"
  status: "Operational",         // or "Announced"
  eventDate: "2025-09-24",       // YYYY-MM-DD
  datePrecision: "day",          // or "month" if you only know the month
  dateLabel: "Inaugurated 24 Sep 2025",
  facility: "...",               // or null
  investment: "...",             // or null
  focusAreas: ["IT", "Finance"],
  headcountClaim: {              // or null if no figure was published
    value: "3,000 by end of 2026",
    basis: "Where this number came from",
    note: "Anything the sources disagree on"
  },
  summary: "What the sources actually state.",
  interpretation: "Your own reading — must be different from summary.",
  whyItMatters: "Why a recruiter might care.",
  sources: [
    { name: "Publication name",
      type: "primary",           // or "trade" or "news"
      url: "https://...",
      date: "2025-09" }
  ],
  confidence: "Medium",          // "High", "Medium" or "Low"
  confidenceBasis: "Why you chose that level.",
  caveats: ["Anything unresolved."]
}
```

**If you add or remove records**, also update `recordCount` in the `GCC_META` block
at the top of the file. The validation script will tell you if you forget.

**Rules worth keeping:**
- `confidence: "High"` requires at least one `type: "primary"` source. The
  validator enforces this.
- `summary` is what the source says. `interpretation` is what you think. Never
  blur them.
- Never add a record you cannot point to a real, named source for.

After editing, save the file and refresh the browser (**F5**). If you have Node.js,
run `node tools/validate.mjs` to check for mistakes.

---

## 10. Common problems and fixes

**The page is blank, or says "Dataset did not load"**
The folder got split up. `index.html`, `data/` and `assets/` must stay together in
the same folder. Re-download or re-extract the whole folder.

**I edited `records.js` and now the app is blank**
There is almost certainly a typo — a missing comma, quote or bracket. In your
browser press **F12**, click the **Console** tab, and reload. The error message
names the line number. If you have Node.js, `node tools/validate.mjs` gives a
clearer message.

**Nothing happens when I double-click `index.html`**
Right-click it → **Open with** → choose Chrome, Edge or Firefox.

**It opened in Notepad instead of a browser**
Same fix: right-click → **Open with** → pick a browser.

**The source links don't open**
Those go to real websites, so you need an internet connection for them — that is
the only part of the app that does. Everything else works offline.

**My ticks on the Verify page disappeared**
They are saved in your browser's storage for this exact file location. Moving the
folder, switching browsers, or using a private window will lose them. The checklist
still works; you just start fresh.

**`node` or `python` is not recognised**
That tool isn't installed, or wasn't added to PATH. You do not need either one to
use the app — see section 1. If you do want them, reinstall and make sure
"Add to PATH" is ticked.

**PowerPoint says the file may be unsafe**
Normal for a file downloaded from the internet. Click **Enable Editing**.

---

## 11. Before you submit

**Please do these yourself. They matter.**

### 1. Check the sources — this is the important one

The dataset was built from web search results. The environment it was built in
**blocked opening web pages directly**, so the 47 source links were identified but
have **not been opened and read first-hand**.

Open the app, go to the **Verify** page, and work through the list. For each one:
open the link, read it, and confirm it actually says what the record claims. Tick
the box. If a link is broken or doesn't support the claim, fix or remove that record.

Start with the 8 records that cite a company press release — those are the strongest
and quickest to confirm. Budget around half a day for all 47.

**Do not present this as verified research until you have done this.** It is the
one thing in this project that only you can do, and it is also the thing most
likely to come up in an interview.

### 2. Read `NOTES.md`

It explains every decision in plain English — why this user, why these features,
why no framework, what was cut and why. Being able to explain your own project is
most of what you are being assessed on.

### 3. Check the deck matches the app

If you change the dataset, the numbers on slides 2, 9 and 13 (20 records, 47
sources, 5 cities, 8 with primary sources) will need updating too.

### 4. Check the assignment's own requirements

Re-read the original assignment email and confirm you are sending what it asks
for — the deck link and the prototype link, with access enabled, to all three
recipients listed in it.

---

## A note on honesty

This project deliberately makes its limitations visible rather than hiding them.
The Sources & Method page, the Verify page, the confidence labels, and the
separation of fact from interpretation are all there for the same reason: a
research tool that cannot be checked is not worth much.

If you are asked in an interview what is wrong with this project, you should have
plenty to say. That is intentional.
