# START HERE — Akshaya

Complete setup guide, written for someone who has never set up a project before.

**Good news first:** there is nothing to install. No Node.js, no Python, no Git, no
accounts, no API keys, nothing to pay for. The whole thing runs from a folder on
your own computer.

**Total time: about 5 minutes.**

---

## What you are getting

A folder called `gcc-atlas` containing two deliverables:

1. **A working web app** — a research tool covering 20 publicly reported Global
   Capability Centre (GCC) events in India
2. **A PowerPoint deck** — 18 slides presenting the project

Plus the documents that explain it all.

---

# PART 1 — Get the files onto your computer

## Step 1: Save the ZIP file

You should have received a file called **`gcc-atlas.zip`** (about 4 MB).

1. Download it.
2. It will go to your **Downloads** folder by default. That is fine.

## Step 2: Move it somewhere you'll find again

1. Open **File Explorer** (the yellow folder icon on your taskbar).
2. Click **Downloads** on the left.
3. Find `gcc-atlas.zip`.
4. Drag it onto **Desktop** on the left-hand list. (Or anywhere you like — Documents
   is fine too. Just remember where.)

## Step 3: EXTRACT the ZIP — this step matters most

> ### ⚠️ Read this bit carefully
> A ZIP file is a box. Windows lets you *peek inside* the box by double-clicking it,
> and everything looks normal — but the app **will not work** from inside the box.
> You have to **unpack** it first.
>
> **If you skip this step, the app will open as a blank or broken page.** This is the
> single most common mistake, and it looks like the project is broken when it isn't.

Do this:

1. **Right-click** on `gcc-atlas.zip`
2. Click **Extract All…**
3. A window appears showing a destination path. **Don't change it.**
4. Make sure **"Show extracted files when complete"** is ticked
5. Click **Extract**
6. Wait a few seconds. A new window opens.

### How to tell it worked

You should now have a regular folder called **`gcc-atlas`** sitting next to the ZIP
file. A folder icon, not a zip icon with a zipper on it.

Open that folder. You should see:

```
assets          (folder)
data            (folder)
deck            (folder)
screenshots     (folder)
tools           (folder)
index.html      ← this is the app
README.md
NOTES.md
DEMO-SCRIPT.md
START-HERE.md   ← this file
```

If you see those, you're done with setup. Seriously — that's it.

> **Note:** some folders have an extra `gcc-atlas` folder inside them after
> extracting (so `gcc-atlas/gcc-atlas/index.html`). If that happens, just open the
> inner one. That's the real folder.

---

# PART 2 — Open the app

## Step 4: Double-click `index.html`

1. In the `gcc-atlas` folder, find **`index.html`**
2. **Double-click it**
3. It opens in your web browser

That is the entire launch process. There is no server to start and no command to type.

### What you should see

A page headed **"India GCC activity, with every claim traced to a source"**, with a
navigation bar across the top (Overview · Activity · Ask · Cities · Sources & Method ·
Verify) and five boxes showing: 20 records, 5 cities, 19 industries, 15 operational,
47 source links.

The address bar will show something like
`file:///C:/Users/Akshaya/Desktop/gcc-atlas/index.html` — that's correct. The app runs
from your computer, not from a website.

### If it opened in Notepad instead of a browser

1. Right-click `index.html`
2. Hover over **Open with**
3. Choose **Google Chrome**, **Microsoft Edge**, or **Firefox**

(To make this permanent: right-click → **Open with** → **Choose another app** →
pick your browser → tick **Always use this app**.)

---

## Step 5: Check everything works — 60 seconds

Click through these to confirm it's all running:

| # | Do this | You should see |
|---|---|---|
| 1 | Click **Activity** in the top bar | A table of 20 companies |
| 2 | Type `Chennai` in the Search box | The table narrows to 3 rows |
| 3 | Clear the search, click any company name | A detail page with sources at the bottom |
| 4 | Click **Ask** in the top bar | A question box with grey suggestion buttons |
| 5 | Click the button *"What are typical salaries at these GCCs?"* | A message saying it **cannot** answer, and why |
| 6 | Click **Cities** | Bar charts |
| 7 | Click **Verify** | A long checklist of 47 source links |

If all seven work, the project is fully running on your system. ✅

> **Step 5 is not a bug.** The app deliberately refuses questions it has no data for,
> instead of making something up. It's one of the best things to show off.

---

# PART 3 — Open the presentation

## Step 6: Open the deck

The deck is inside the `deck` folder:

```
gcc-atlas → deck → GCC-Atlas-Flexiple-Assignment.pptx
```

**If you have PowerPoint:** double-click it. If a yellow bar says "Protected View",
click **Enable Editing** — that's normal for downloaded files.

**If you don't have PowerPoint** (free, no installation):

1. Go to **https://slides.google.com**
2. Sign in with any Google account
3. Click the **Blank** presentation
4. Click **File** → **Import slides**
5. Click **Upload**, then drag in the `.pptx` file
6. Click **Select all** → **Import slides**

**To present:** press **F5** in PowerPoint, or **Ctrl + F5** in Google Slides.

There are 18 slides. A word-for-word speaking guide is in `DEMO-SCRIPT.md`.

---

# PART 4 — If you're on a Mac instead

Everything works the same, with three differences:

| Windows | Mac |
|---|---|
| Right-click → Extract All | **Double-click** the ZIP — it unzips automatically |
| File Explorer | **Finder** |
| Right-click → Open with | **Right-click → Open With** (same) |

So on a Mac: double-click `gcc-atlas.zip`, open the folder that appears, double-click
`index.html`. Done.

For the deck, Mac users can use Keynote (double-click the `.pptx`) or Google Slides.

---

# PART 5 — Optional: put it online with a free link

**You do not need to do this.** The app works perfectly from your folder. But a link
is easier to share than a 4 MB file, and it's free.

1. Create a free account at **https://github.com** (just an email and password)
2. Click the **+** at the top right → **New repository**
3. Name it `gcc-atlas`, choose **Public**, click **Create repository**
4. On the next page click the link **uploading an existing file**
5. Open your `gcc-atlas` folder, select everything inside it (**Ctrl + A**), and drag
   it all into the browser window
6. Wait for the upload bar to finish, then click **Commit changes**
7. Click **Settings** (top of the page) → **Pages** (left sidebar)
8. Under "Branch", choose **main**, leave the folder as **/ (root)**, click **Save**
9. Wait 2 minutes, refresh the page. GitHub shows your link:
   `https://yourusername.github.io/gcc-atlas/`

Test that link in a private/incognito window before sending it to anyone.

---

# PART 6 — Problems and fixes

### The page is blank, or says "Dataset did not load"

**Almost always the ZIP wasn't extracted.** Go back to Step 3 and use
**Right-click → Extract All**. Opening `index.html` from inside the ZIP preview
does not work.

Second possibility: `index.html` was moved out on its own. It needs the `data` and
`assets` folders sitting beside it in the same place.

### Double-clicking does nothing

Right-click `index.html` → **Open with** → pick Chrome, Edge or Firefox.

### The source links don't open

Those go to real news sites and company pages, so they need an internet connection.
That's the only part of the app that does — everything else works offline.

### My ticks on the Verify page disappeared

The browser saves them for that exact folder location. If you move the folder, switch
browsers, or use a private window, they reset. The checklist still works; you just
start fresh.

### Windows says "Windows protected your PC"

Click **More info** → **Run anyway**. This only appears for installers, so you
shouldn't see it here at all.

### PowerPoint won't let me edit

Click **Enable Editing** in the yellow bar. Normal for downloaded files.

---

# PART 7 — Before this gets submitted anywhere

**One job needs a human. Please read this.**

The 20 records in this dataset came from real web searches, and all 47 source links
are real URLs from real publications. **But the links have not been opened and read
one by one.** The computer that built this project was blocked from loading web pages,
so it could search but not click through.

So before anyone presents this as finished research:

1. Open the app, click **Verify** in the top bar
2. Work down the list. For each one: click **Open source**, read the page, and check
   it really says what the record claims
3. Tick the box
4. If a link is broken or doesn't support the claim, that record needs fixing or
   removing

**Start with the 8 strongest ones** — records sourced from a company's own press
release (Vontier, Aon, Sirva, Genpact/Nestlé, Magnum Ice Cream, Lexitas, Illumia).
They're quickest to confirm. Allow about half a day for all 47.

The app says this limitation out loud on its own pages rather than hiding it — which
is the right thing to do — but the checking still has to happen.

---

# What to read next

| File | What's in it | Who needs it |
|---|---|---|
| **`DEMO-SCRIPT.md`** | A 4-minute walkthrough, almost word for word | Anyone presenting it |
| **`NOTES.md`** | Why every decision was made, plus likely interview questions and answers | Essential before an interview |
| **`README.md`** | Fuller technical detail, how to edit the data | If you want to change something |

---

# The one-paragraph summary

GCC Atlas is a research tool covering 20 publicly reported Global Capability Centre
events in India across 5 cities and 19 industries, backed by 47 source links. Every
claim shows where it came from, how confident it is, and keeps reported facts visibly
separate from interpretation. The "Ask" feature is a local keyword search — **not AI**
— and it refuses questions it has no data for instead of guessing. It's built from
plain HTML, CSS and JavaScript with no framework, no server and no database, which is
why it runs by double-clicking a file.
