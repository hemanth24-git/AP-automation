# GCC Atlas — the thinking behind it

This is your interview preparation. It explains every significant decision in
plain English so you can discuss the project confidently and honestly.

Read it once before the interview. Do not memorise it — understand it, then say
it in your own words.

---

## 1. The problem I chose, and why

### The obvious framing (which I rejected)

The assignment says information about India's GCC ecosystem is "scattered" and
there is "substantial information asymmetry". The obvious reading is: *the
information is missing, so go collect it.*

I don't think that's right. Quite a lot of this information is public. What is
missing is something different.

### The framing I used

**The information exists but cannot be checked.**

The clearest demonstration is the simplest possible question — how many GCCs are
there in India? Three credible sources give three different answers:

| Source | Figure |
|---|---|
| The Flexiple assignment brief | 2,000+ |
| Flexiple's own website (city directory page) | 1,800+ |
| Vestian Research, reported via IANS (July 2025) | ~1,700 |

None of them is lying. They use different definitions, different dates and
different counting methods — and none of them shows its working. So you cannot
reconcile them, and you cannot tell which to trust.

That is the real problem: **not absence of information, but absence of provenance.**

### Evidence I gathered myself

While researching the 20 records I hit five specific obstacles. These are my own
findings from doing the work — not quoted from any report:

1. **Six different names for the same thing.** Within my 20 records: GCC, Global
   Capability Centre, Global Value Centre, Global Innovation Centre, capability
   center, Global Business Solutions. Any keyword search misses centres purely
   because of vocabulary.

2. **The same event, different dates.** ICE's Pune lease is dated 29 December 2025
   by one source (registration) and February 2026 by another (reporting). Both are
   probably right about different events — but nothing says which is which.

3. **The same event, different headcounts.** Eli Lilly's Hyderabad centre: 1,000+
   at announcement, 1,500 at inauguration. HCA Healthcare: ~1,100 in one report,
   ~1,200 in another.

4. **Headline numbers that mean something else entirely.** JPMorgan Chase's Mumbai
   campus is widely reported as "30,000 employees". That is *building capacity* for
   a campus targeted at 2029, and the reporting says it will "consolidate" existing
   India operations. It is not 30,000 new jobs. A staffing firm sizing that
   opportunity from the headline would be sizing something that does not exist.

5. **Most coverage has no primary source.** Only 8 of my 20 records cite a company
   press release. Much of what circulates is LinkedIn posts and "Top 10 GCCs"
   roundups with nothing underneath them.

**If asked "how do you know this is a real problem?" — these five things are your
answer.** You ran into them personally.

---

## 2. Who the first user is, and why

**Business development leads at recruitment and staffing firms** that sell into GCCs.

I picked them using a filter, not a preference:

| Test | Why they pass |
|---|---|
| **Frequency** | They need this weekly, not once a decade. Frequency is what makes a tool stick. |
| **Existing budget** | They already pay for market data and sales intelligence. No new budget to create — just a better option to argue for. |
| **Reachable** | Thousands of such firms, no procurement committee, decision in one conversation. |
| **Serveable honestly** | Their question — *who is building, and when* — can genuinely be answered from public evidence. |
| **Flexiple fit** | Flexiple runs a GCC recruitment and staffing business. It is itself this user, and could use the tool internally. |

### Who I considered and did not choose

- **The global company deciding to set up a GCC.** Big prize, but very few buyers,
  decade-long decision cycles, unreachable from a student project, and serving them
  properly needs verified cost and incentive data I could not source reliably.
- **Service providers more broadly** (real estate, legal, EOR). Same logic applies,
  but recruitment is the segment closest to Flexiple's actual business, so the
  product has a user inside the building.

**If asked "why not target the companies setting up?"** — say: fewer buyers, longer
cycles, and the data they need (costs, incentives, provider quality) is exactly the
data I could not verify. I would have had to invent it.

---

## 3. What I built, and the three rules behind it

**GCC Atlas**: a curated record of publicly reported GCC activity in India where
every claim can be traced, questioned and checked.

Three rules shape every screen:

1. **Every claim carries its source.** 47 source links across 20 records, each
   tagged as a company release, trade press or news, each dated, all clickable.

2. **Facts and interpretation never blur.** Each record shows *what the sources
   state*, then — separately, differently styled, and explicitly labelled "our
   interpretation — not from the sources" — what I read into it.

3. **Confidence describes evidence, not importance.** A small expansion backed by
   a company press release outranks a huge announcement carried only by a blog.
   The reason for each rating is written out on the record.

A fourth behaviour follows from these: **it refuses rather than guesses.** Ask it
about salaries, office costs, state incentives, contacts, provider ratings or the
future, and it names exactly what it does not hold instead of producing something
plausible.

---

## 4. Why I dropped the original "prediction" idea

The earlier concept was a tool that spots GCC expansion *before* it's announced.
That's a better-sounding pitch. I dropped it.

**Reason:** I looked for evidence that public signals give reliable early warning.
I couldn't find enough to support the claim. Almost everything publicly findable is
*already announced*. Keeping the prediction framing would have meant building a
product whose central claim the evidence didn't back — and the first interview
question would have been "show me one company you flagged before it was public",
with no answer.

So the product consolidates and evidences instead of predicting. Same product
thinking, honest claim.

**This is a good thing to volunteer in an interview.** Changing direction because
the evidence didn't support the original idea is exactly what product work is.

---

## 5. The four options, and why I built this one

| Option | Verdict | Why |
|---|---|---|
| Provider track records ("which advisor actually delivers?") | **Rejected** | The most-felt pain in the market, but the data is private outcomes. Building it honestly is impossible; building it dishonestly means inventing performance data. |
| Setup decision copilot (city, entity, cost) | **Rejected** | Very few buyers, decade-long cycles, and it depends on verified cost and incentive figures I could not source. |
| **Source-backed activity record** | **Built** | Fully buildable from public evidence. Serves a user who feels the need weekly. Honest about its gaps. |
| Expansion prediction | **Rejected** | See section 4. |

**The deciding question each time: can this be built honestly from evidence I can
actually obtain?** Only one of the four could. The other three would have made a
more impressive slide and a less defensible product.

---

## 6. Technical decisions, in plain English

### Plain HTML, CSS and JavaScript — no framework

**What that means:** the app is three files (a page, a stylesheet, a script) plus a
data file. You open it by double-clicking. There is no build step, no installation,
no server, no database.

**Why:** the dataset is 20 records held in memory. A framework like React would add
installation steps, a build process, and concepts — without changing a single thing
the app can do. For this size of problem it is the wrong tool.

**The honest version of this answer:** "I chose the simplest thing that fully solved
the problem, partly because I can explain every line of it. If the dataset grew to
thousands of records with multiple editors, I'd need a real database and a framework
— but it doesn't, so I didn't."

### Data in a `.js` file, not `.json`

**Why:** browsers block reading `.json` files when a page is opened directly from
your computer (a security rule called CORS). Storing the data as a JavaScript file
sidesteps it entirely, which is what lets the app work with zero setup. A small
technical choice that delivers the biggest usability win in the project.

### No database

20 records, read-only, version-controlled alongside the code. A database would add
installation, configuration and a running service — and let you do nothing extra.

### The "Ask" feature is keyword search, not AI

**Be completely clear about this. It is not AI.**

How it works:
1. Strips filler words from your question.
2. Detects simple patterns — city names, counting words, "announced", "expansion".
3. Checks whether you've asked about an excluded topic (salaries, costs, incentives,
   contacts, ratings, predictions) and refuses with a specific explanation if so.
4. Otherwise scores all 20 records by keyword overlap, weighting company names and
   cities more heavily.
5. If nothing scores above a threshold, it says so instead of guessing.

**Why not use a real language model?** Two reasons, and both are good answers:
- **Cost.** It would need a paid API key. A prototype that stops working when
  credits run out is not a working prototype.
- **Honesty.** A language model answering from memory would produce fluent,
  confident, unverifiable answers. That is precisely the problem this product
  exists to fix. A keyword search over cited records is a *better fit* for the
  product's purpose, not just a cheaper one.

**A detail worth mentioning:** during testing, "What is the capital of France?"
returned a match — because L'Oréal's parent HQ is France. One incidental word match
was being treated as an answer. I fixed it by adding a minimum relevance threshold
and a list of topics the dataset explicitly doesn't cover. That's a small example of
testing changing the design.

---

## 7. What I cut, and why

| Cut | Why |
|---|---|
| State incentive comparison | The most error-prone data in this market. Getting it wrong is worse than not having it. |
| Office cost benchmarks | Could not source reliably enough to publish. |
| Contact details | A data-protection question I shouldn't answer casually. |
| Live data ingestion | Real engineering; not demonstrable in the time, and I won't fake it. |
| Login and user accounts | Nothing here is private. |
| Service-provider ratings | The data does not exist publicly. |

**Say this if asked about scope:** "I had three days. I chose a small set of things
that work completely over a large set that half-work. Everything I cut, I cut for a
reason I can give you."

---

## 8. What is NOT true about this yet

Volunteer these. Being asked about a weakness you've already named is a much better
position than being caught by one.

1. **The source links have not been confirmed first-hand.** They were identified
   via web search; the build environment blocked opening pages directly. The app
   ships a Verify page listing all 47 for exactly this reason. *You must do this
   before submitting.*

2. **No user research exists.** I have not interviewed a single recruitment or
   staffing professional. Every statement about what they need is reasoning, not a
   finding. The "current alternatives" slide marks which claims I tested myself and
   which I assumed.

3. **20 records is a sample, not a market.** Coverage skews toward cities and states
   with active press communications. A count here measures reporting volume, not
   real activity.

4. **It cannot predict.** See section 4.

5. **"Ask" is not AI.** See section 6.

---

## 9. What I'd do next, in order

1. **Confirm all 47 sources** (half a day) — open each link, confirm it supports the
   record, log who checked it and when. Nothing else matters until this is done.
2. **Interview eight people who do this job** (one week) — one question above all:
   *what do you use today, and what would make you stop using it?* This is the
   assumption the whole product rests on.
3. **Test whether state MoUs are an early signal** (one week) — one record here shows
   roughly 17 months between a state MoU (Magnum Ice Cream, Maharashtra, April 2025)
   and the centre opening (September 2026). If that gap holds across 20 more cases,
   it's a genuinely earlier signal than anything in the dataset today. One case is an
   observation, not a finding.
4. **Widen coverage with a repeatable method** (two weeks) — move from manual
   searching to a defined process, recording why each candidate was included or
   excluded.
5. **Add company registry data** (later) — tie each centre to its Indian legal entity
   so the same company is never counted twice under two names.

---

## 10. Likely interview questions

**"Walk me through what you built."**
> A source-backed record of 20 publicly reported GCC events in India. Every claim
> carries its source, a confidence label based on evidence quality, and a clear
> separation between what the source says and what I think. It's for recruitment
> and staffing firms who need to know who's building a centre and want to check it
> before acting.

**"Why should I trust this data?"**
> You shouldn't, just because I say so — that's the point. Every record links to its
> source, tagged by type and dated. There's a Verify page listing all 47 links so you
> can audit it. And I'll be straight with you: I identified those links through search
> but couldn't open each page in the environment I built this in, so they still need
> first-hand confirmation. That's stated in the app.

**"Is this AI?"**
> No. The Ask feature is keyword search in plain JavaScript. The app says so on the
> page. I chose that deliberately — a language model would give fluent unverifiable
> answers, which is the problem I'm trying to solve.

**"Why no React / database / backend?"**
> 20 records, read-only. A framework and database would add installation steps and
> concepts without changing what the app does. It opens by double-clicking and works
> offline. If it grew to thousands of records with multiple editors, that calculation
> changes.

**"What's wrong with it?"**
> Three things. The sources need first-hand confirmation. There's no user research,
> so everything about what recruiters need is a hypothesis. And 20 records measures
> reporting volume, not the market.

**"Flexiple already has GCC directory pages. Why is this different?"**
> I looked at those — they're good directories and they rank well. The difference is
> provenance: each entry here carries its source, date, confidence and caveats, so a
> list becomes checkable evidence. I'd see this as the research layer underneath
> those pages, not a replacement for them.

**"How would you make money from this?"**
> I haven't tested willingness to pay, so I'd be guessing. The honest answer is that's
> interview question two, after I've talked to eight people about whether they'd use
> it at all. The plausible shape is a subscription for firms already buying sales
> intelligence — but that's a hypothesis.

**"What did you learn?"**
> That the first version of an idea is usually over-claimed. I started with a
> prediction tool, went looking for evidence that public signals give early warning,
> couldn't find it, and changed the product rather than the claim.

---

## 11. One-line summary

> **This market does not lack information. It lacks information you can check.**

GCC Atlas is 20 records, 47 sources and five cities. Small on purpose. Every claim
points at something you can open, every interpretation is labelled as mine, and
everything it does not know is written down.
