/* ==========================================================================
   GCC Atlas — application logic
   --------------------------------------------------------------------------
   Plain JavaScript. No framework, no build step, no server, no API keys.
   Runs by opening index.html directly in a browser.

   Why no framework: the dataset is 20 records held in memory. A framework
   would add install steps and concepts without changing what the app can do.

   Structure of this file:
     1. Helpers           - small utilities (escaping, formatting, DOM)
     2. Derived data      - counts computed from the real records
     3. Router            - maps the URL hash to a page
     4. Pages             - one render function per screen
     5. Ask engine        - local keyword search over the dataset
     6. Startup
   ========================================================================== */

(function () {
  "use strict";

  var RECORDS = window.GCC_RECORDS || [];
  var META = window.GCC_META || {};

  /* ========================================================== 1. HELPERS === */

  /* Escape text before putting it into HTML, so a stray < or & can't break
     the page. Everything user-visible goes through this. */
  function esc(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function el(id) { return document.getElementById(id); }

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function yearOf(rec) {
    return rec.eventDate ? parseInt(rec.eventDate.slice(0, 4), 10) : null;
  }

  function shortDate(rec) {
    if (!rec.eventDate) return "Date unknown";
    var parts = rec.eventDate.split("-");
    var y = parts[0];
    var m = MONTHS[parseInt(parts[1], 10) - 1] || "";
    if (rec.datePrecision === "month") return m + " " + y;
    var d = parseInt(parts[2], 10);
    return d + " " + m + " " + y;
  }

  function confChip(level) {
    return '<span class="chip chip-' + esc(String(level).toLowerCase()) + '">' +
           esc(level) + ' confidence</span>';
  }

  function catChip(cat) {
    return '<span class="chip chip-cat" data-cat="' + esc(cat) + '">' + esc(cat) + '</span>';
  }

  function srcChip(type) {
    var labels = { primary: "Primary source", trade: "Trade press", news: "News" };
    return '<span class="chip chip-src" data-type="' + esc(type) + '">' +
           esc(labels[type] || type) + '</span>';
  }

  /* Count how many times each value appears, and return it sorted high-to-low.
     Used for the city and industry breakdowns — all figures come from the
     records themselves, never from an outside claim. */
  function countBy(records, keyFn) {
    var map = {};
    records.forEach(function (r) {
      var k = keyFn(r);
      if (!k) return;
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map)
      .map(function (k) { return { key: k, count: map[k] }; })
      .sort(function (a, b) { return b.count - a.count || a.key.localeCompare(b.key); });
  }

  function barChart(rows, opts) {
    opts = opts || {};
    if (!rows.length) return '<p style="color:var(--ink-3);font-size:13px;">No data.</p>';
    var max = rows.reduce(function (m, r) { return Math.max(m, r.count); }, 0);
    return '<div class="bars">' + rows.map(function (r) {
      var pct = max ? Math.round((r.count / max) * 100) : 0;
      return '<div class="bar-row">' +
        '<div class="bar-label">' + esc(r.key) + '</div>' +
        '<div class="bar-track"><div class="bar-fill' + (opts.alt ? ' alt' : '') +
          '" style="width:' + pct + '%"></div></div>' +
        '<div class="bar-value">' + r.count + '</div>' +
      '</div>';
    }).join("") + '</div>';
  }

  /* ===================================================== 2. DERIVED DATA === */
  /* Every number shown anywhere in the app is computed here from RECORDS.
     Nothing is hardcoded, so the figures can never drift from the data. */

  var D = {
    total: RECORDS.length,
    byCity: countBy(RECORDS, function (r) { return r.city; }),
    byCategory: countBy(RECORDS, function (r) { return r.category; }),
    byIndustry: countBy(RECORDS, function (r) { return r.industry; }),
    byConfidence: countBy(RECORDS, function (r) { return r.confidence; }),
    byYear: countBy(RECORDS, function (r) { var y = yearOf(r); return y ? String(y) : null; }),
    operational: RECORDS.filter(function (r) { return r.status === "Operational"; }).length,
    announced: RECORDS.filter(function (r) { return r.status === "Announced"; }).length,
    withPrimary: RECORDS.filter(function (r) {
      return r.sources.some(function (s) { return s.type === "primary"; });
    }).length,
    sourceCount: RECORDS.reduce(function (n, r) { return n + r.sources.length; }, 0)
  };

  var CITIES = D.byCity.map(function (c) { return c.key; });
  var CATEGORIES = D.byCategory.map(function (c) { return c.key; });

  /* ========================================================== 3. ROUTER === */

  var state = {
    filters: { q: "", city: "", category: "", confidence: "" },
    askQuestion: "",
    askResult: null
  };

  var ROUTES = [
    { path: "dashboard", label: "Overview",  render: renderDashboard },
    { path: "activity",  label: "Activity",  render: renderActivity },
    { path: "ask",       label: "Ask",       render: renderAsk },
    { path: "cities",    label: "Cities",    render: renderCities },
    { path: "sources",   label: "Sources & Method", render: renderSources },
    { path: "verify",    label: "Verify",    render: renderVerify }
  ];

  function currentRoute() {
    var hash = (location.hash || "#/dashboard").replace(/^#\/?/, "");
    var segments = hash.split("/");
    return { name: segments[0] || "dashboard", param: segments[1] || null };
  }

  function navigate() {
    var route = currentRoute();

    if (route.name === "company" && route.param) {
      renderCompany(route.param);
    } else {
      var match = ROUTES.filter(function (r) { return r.path === route.name; })[0];
      (match ? match.render : renderDashboard)();
    }

    // Highlight the active nav item.
    var navName = route.name === "company" ? "activity" : route.name;
    Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === navName);
    });

    window.scrollTo(0, 0);
  }

  function renderNav() {
    el("nav").innerHTML = ROUTES.map(function (r) {
      return '<a href="#/' + r.path + '" data-route="' + r.path + '">' + esc(r.label) + '</a>';
    }).join("");
  }

  function footer() {
    return '<div class="foot">' +
      '<div>GCC Atlas — curated sample of ' + D.total + ' records. Research date ' +
        esc(META.researchDate) + '.</div>' +
      '<div>Not a complete register of Indian GCCs. <a href="#/sources">Method &amp; limitations</a></div>' +
    '</div>';
  }

  function paint(html) {
    el("view").innerHTML = html + footer();
  }

  /* =========================================================== 4. PAGES === */

  function renderDashboard() {
    var recent = RECORDS.slice().sort(function (a, b) {
      return (b.eventDate || "").localeCompare(a.eventDate || "");
    }).slice(0, 6);

    paint(
      '<div class="page-head">' +
        '<div class="eyebrow">Overview</div>' +
        '<h1>India GCC activity, with every claim traced to a source</h1>' +
        '<p>A curated sample of publicly reported Global Capability Centre activity in India, ' +
        'built for recruitment and staffing teams who need to know which companies are ' +
        'standing up or growing centres — and want to check the evidence themselves.</p>' +
      '</div>' +

      '<div class="callout">' +
        '<div class="callout-title">What this is, stated plainly</div>' +
        '<p>' + esc(META.coverageStatement) + ' This is a prototype dataset of ' + D.total +
        ' records, not a complete register. The assignment brief cites 2,000+ GCCs in India.</p>' +
      '</div>' +

      '<div class="stat-grid">' +
        stat("Records", D.total, "Hand-curated events") +
        stat("Cities covered", D.byCity.length, CITIES.slice(0, 3).join(", ") + (CITIES.length > 3 ? "…" : "")) +
        stat("Industries", D.byIndustry.length, "Across sectors") +
        stat("Operational", D.operational, D.announced + " announced but not yet open") +
        stat("Source links", D.sourceCount, D.withPrimary + " records have a primary source") +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head">' +
          '<h2>Activity by city</h2>' +
          '<span class="hint">Counts from these ' + D.total + ' records only</span>' +
        '</div>' +
        barChart(D.byCity) +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head">' +
          '<h2>Activity by type</h2>' +
          '<span class="hint">Announced events are kept separate from operational ones</span>' +
        '</div>' +
        barChart(D.byCategory, { alt: true }) +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head">' +
          '<h2>Evidence strength</h2>' +
          '<span class="hint">How well-sourced each record is</span>' +
        '</div>' +
        barChart(D.byConfidence) +
        '<p style="font-size:13px;color:var(--ink-3);margin-top:12px;max-width:640px;">' +
        'Confidence reflects the quality of the sources behind a record, not how ' +
        'important the event is. A company press release scores higher than a ' +
        'property-sector blog. <a href="#/sources">How confidence is assigned</a></p>' +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head">' +
          '<h2>Most recent activity</h2>' +
          '<span class="hint"><a href="#/activity">See all ' + D.total + ' records</a></span>' +
        '</div>' +
        recordTable(recent) +
      '</div>'
    );
  }

  function stat(label, value, note) {
    return '<div class="stat">' +
      '<div class="stat-label">' + esc(label) + '</div>' +
      '<div class="stat-value">' + esc(value) + '</div>' +
      (note ? '<div class="stat-note">' + esc(note) + '</div>' : '') +
    '</div>';
  }

  /* ------------------------------------------------------- activity table -- */

  function applyFilters() {
    var f = state.filters;
    var q = f.q.trim().toLowerCase();

    return RECORDS.filter(function (r) {
      if (f.city && r.city !== f.city) return false;
      if (f.category && r.category !== f.category) return false;
      if (f.confidence && r.confidence !== f.confidence) return false;
      if (!q) return true;

      var haystack = [
        r.company, r.city, r.state, r.industry, r.category, r.parentHq,
        r.summary, r.interpretation, r.whyItMatters, r.facility || "",
        (r.focusAreas || []).join(" ")
      ].join(" ").toLowerCase();

      return haystack.indexOf(q) !== -1;
    }).sort(function (a, b) {
      return (b.eventDate || "").localeCompare(a.eventDate || "");
    });
  }

  function recordTable(records) {
    if (!records.length) {
      return '<div class="empty">' +
        '<div class="empty-title">No records match these filters</div>' +
        '<p>This dataset holds ' + D.total + ' records across ' + D.byCity.length +
        ' cities. Try removing a filter, or clearing the search box.</p>' +
        '<button class="btn" id="clear-filters-empty">Clear all filters</button>' +
      '</div>';
    }

    return '<div class="table-scroll"><table>' +
      '<thead><tr>' +
        '<th>Company</th><th>City</th><th>Type</th><th>Date</th><th>Evidence</th>' +
      '</tr></thead><tbody>' +
      records.map(function (r) {
        return '<tr>' +
          '<td class="cell-company">' +
            '<a href="#/company/' + esc(r.id) + '">' + esc(r.company) + '</a>' +
            '<div class="cell-meta">' + esc(r.industry) + ' · HQ ' + esc(r.parentHq) + '</div>' +
          '</td>' +
          '<td>' + esc(r.city) + '<div class="cell-meta">' + esc(r.state) + '</div></td>' +
          '<td>' + catChip(r.category) + '</td>' +
          '<td class="cell-date">' + esc(shortDate(r)) + '</td>' +
          '<td>' + confChip(r.confidence) +
            '<div class="cell-meta">' + r.sources.length + ' source' +
            (r.sources.length === 1 ? '' : 's') + '</div></td>' +
        '</tr>';
      }).join("") +
      '</tbody></table></div>';
  }

  function renderActivity() {
    var results = applyFilters();
    var f = state.filters;

    function options(list, selected) {
      return ['<option value="">All</option>'].concat(list.map(function (v) {
        return '<option value="' + esc(v) + '"' +
          (v === selected ? ' selected' : '') + '>' + esc(v) + '</option>';
      })).join("");
    }

    paint(
      '<div class="page-head">' +
        '<div class="eyebrow">Activity</div>' +
        '<h1>GCC activity table</h1>' +
        '<p>Search and filter the full dataset. Click any company to see the evidence ' +
        'behind its record and open the original sources.</p>' +
      '</div>' +

      '<div class="toolbar">' +
        '<div class="field grow">' +
          '<label for="f-q">Search</label>' +
          '<input id="f-q" type="text" placeholder="Company, city, industry, function…" value="' + esc(f.q) + '">' +
        '</div>' +
        '<div class="field"><label for="f-city">City</label>' +
          '<select id="f-city">' + options(CITIES, f.city) + '</select></div>' +
        '<div class="field"><label for="f-cat">Activity type</label>' +
          '<select id="f-cat">' + options(CATEGORIES, f.category) + '</select></div>' +
        '<div class="field"><label for="f-conf">Confidence</label>' +
          '<select id="f-conf">' + options(["High", "Medium", "Low"], f.confidence) + '</select></div>' +
        '<button class="btn" id="clear-filters">Clear</button>' +
      '</div>' +

      '<div class="result-count">Showing ' + results.length + ' of ' + D.total + ' records</div>' +
      recordTable(results)
    );

    // Wire up the controls. Search filters as you type.
    el("f-q").addEventListener("input", function (e) {
      state.filters.q = e.target.value;
      var results = applyFilters();
      var countEl = document.querySelector(".result-count");
      if (countEl) countEl.textContent = "Showing " + results.length + " of " + D.total + " records";
      var old = document.querySelector(".table-scroll") || document.querySelector(".empty");
      if (old) {
        var temp = document.createElement("div");
        temp.innerHTML = recordTable(results);
        old.replaceWith(temp.firstElementChild);
        bindEmptyClear();
      }
    });

    ["f-city|city", "f-cat|category", "f-conf|confidence"].forEach(function (pair) {
      var bits = pair.split("|");
      el(bits[0]).addEventListener("change", function (e) {
        state.filters[bits[1]] = e.target.value;
        renderActivity();
      });
    });

    el("clear-filters").addEventListener("click", function () {
      state.filters = { q: "", city: "", category: "", confidence: "" };
      renderActivity();
    });

    bindEmptyClear();
  }

  function bindEmptyClear() {
    var b = el("clear-filters-empty");
    if (b) b.addEventListener("click", function () {
      state.filters = { q: "", city: "", category: "", confidence: "" };
      renderActivity();
    });
  }

  /* ------------------------------------------------------- company detail -- */

  function renderCompany(id) {
    var r = RECORDS.filter(function (x) { return x.id === id; })[0];

    if (!r) {
      paint('<div class="empty">' +
        '<div class="empty-title">Record not found</div>' +
        '<p>There is no record with that identifier in this dataset.</p>' +
        '<a class="btn" href="#/activity">Back to the activity table</a>' +
      '</div>');
      return;
    }

    var hc = r.headcountClaim;

    paint(
      '<a class="back-link" href="#/activity">&larr; Back to activity table</a>' +

      '<div class="detail-grid">' +
        '<div>' +
          '<div class="eyebrow">' + esc(r.city) + ', ' + esc(r.state) + '</div>' +
          '<h1 class="detail-title">' + esc(r.company) + '</h1>' +
          '<div class="detail-chips">' +
            catChip(r.category) +
            '<span class="chip chip-cat">' + esc(r.status) + '</span>' +
            confChip(r.confidence) +
          '</div>' +

          '<div class="block">' +
            '<div class="label-inline fact">What the sources state</div>' +
            '<div class="block-quote"><p>' + esc(r.summary) + '</p></div>' +
          '</div>' +

          '<div class="block">' +
            '<div class="label-inline">Our interpretation — not from the sources</div>' +
            '<div class="block-interp"><p>' + esc(r.interpretation) + '</p></div>' +
          '</div>' +

          '<div class="block">' +
            '<h3>Why this may matter to a recruitment or staffing professional</h3>' +
            '<p>' + esc(r.whyItMatters) + '</p>' +
          '</div>' +

          (r.caveats && r.caveats.length ?
            '<div class="block">' +
              '<h3>Caveats and open questions</h3>' +
              '<ul class="caveat-list">' + r.caveats.map(function (c) {
                return '<li>' + esc(c) + '</li>';
              }).join("") + '</ul>' +
            '</div>' : '') +

          '<div class="block">' +
            '<h3>Sources — open these and check them yourself</h3>' +
            '<ul class="source-list">' + r.sources.map(function (s) {
              return '<li class="source-item">' +
                '<div class="source-row">' +
                  '<span class="source-name">' + esc(s.name) + '</span>' +
                  srcChip(s.type) +
                  (s.date ? '<span style="font-size:12px;color:var(--ink-3);">' + esc(s.date) + '</span>' : '') +
                '</div>' +
                '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">Open source &nearr;</a>' +
                '<span class="source-url">' + esc(s.url) + '</span>' +
              '</li>';
            }).join("") + '</ul>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div class="card">' +
            '<h3 style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.09em;color:var(--ink-3);margin-bottom:11px;">Record details</h3>' +
            '<dl class="kv">' +
              kv("Industry", r.industry) +
              kv("Parent HQ", r.parentHq) +
              kv("City", r.city) +
              kv("Date", shortDate(r) + (r.datePrecision === "month" ? " (month only)" : "")) +
              kv("As reported", r.dateLabel) +
              (r.facility ? kv("Facility", r.facility) : "") +
              (r.investment ? kv("Investment", r.investment) : "") +
              ((r.focusAreas && r.focusAreas.length) ? kv("Focus areas", r.focusAreas.join(", ")) : "") +
            '</dl>' +
          '</div>' +

          (hc ?
            '<div class="card" style="margin-top:12px;">' +
              '<h3 style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.09em;color:var(--ink-3);margin-bottom:9px;">Headcount claim</h3>' +
              '<p style="margin:0 0 8px;font-weight:600;">' + esc(hc.value) + '</p>' +
              '<p style="margin:0 0 6px;font-size:13px;color:var(--ink-2);"><strong>Basis:</strong> ' + esc(hc.basis) + '</p>' +
              (hc.note ? '<p style="margin:0;font-size:13px;color:var(--ink-3);">' + esc(hc.note) + '</p>' : '') +
            '</div>'
            :
            '<div class="card" style="margin-top:12px;">' +
              '<h3 style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.09em;color:var(--ink-3);margin-bottom:9px;">Headcount claim</h3>' +
              '<p style="margin:0;font-size:13.5px;color:var(--ink-3);">No headcount figure was disclosed in the sources found. We have not estimated one.</p>' +
            '</div>') +

          '<div class="card" style="margin-top:12px;">' +
            '<h3 style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.09em;color:var(--ink-3);margin-bottom:9px;">Why this confidence level</h3>' +
            '<div style="margin-bottom:8px;">' + confChip(r.confidence) + '</div>' +
            '<p style="margin:0;font-size:13px;color:var(--ink-2);">' + esc(r.confidenceBasis) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function kv(k, v) {
    return '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>';
  }

  /* ------------------------------------------------------------- cities ---- */

  function renderCities() {
    var cityRows = D.byCity;
    var catsByCity = {};
    CITIES.forEach(function (c) {
      catsByCity[c] = countBy(
        RECORDS.filter(function (r) { return r.city === c; }),
        function (r) { return r.category; }
      );
    });

    paint(
      '<div class="page-head">' +
        '<div class="eyebrow">Cities</div>' +
        '<h1>City breakdown</h1>' +
        '<p>Every figure on this page is a count of the ' + D.total + ' records in this ' +
        'dataset. These are not market-share figures and they do not show which city ' +
        'is "best" — they show where the activity we were able to source happens to be.</p>' +
      '</div>' +

      '<div class="callout warn">' +
        '<div class="callout-title">Read this before using these numbers</div>' +
        '<p>This sample is small and was assembled by searching public news and company ' +
        'releases. Cities with more active government communications and more trade-press ' +
        'coverage are likely over-represented. A count here is evidence of reporting ' +
        'volume, not of true market size.</p>' +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head"><h2>Records per city</h2></div>' +
        barChart(cityRows) +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head"><h2>Industries represented</h2>' +
          '<span class="hint">' + D.byIndustry.length + ' distinct industries across ' + D.total + ' records</span>' +
        '</div>' +
        barChart(D.byIndustry, { alt: true }) +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head"><h2>Activity by year</h2>' +
          '<span class="hint">Based on the main event date of each record</span></div>' +
        barChart(D.byYear) +
      '</div>' +

      '<div class="section">' +
        '<div class="section-head"><h2>What kind of activity, by city</h2></div>' +
        cityRows.map(function (c) {
          return '<div class="card" style="margin-bottom:10px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;flex-wrap:wrap;gap:8px;">' +
              '<h3 style="font-size:15px;">' + esc(c.key) + '</h3>' +
              '<span style="font-size:13px;color:var(--ink-3);">' + c.count +
                ' record' + (c.count === 1 ? '' : 's') + '</span>' +
            '</div>' +
            '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
              catsByCity[c.key].map(function (x) {
                return '<span class="chip chip-cat" data-cat="' + esc(x.key) + '">' +
                  esc(x.key) + ' · ' + x.count + '</span>';
              }).join("") +
            '</div>' +
            '<div style="margin-top:11px;font-size:13px;">' +
              RECORDS.filter(function (r) { return r.city === c.key; })
                .map(function (r) {
                  return '<a href="#/company/' + esc(r.id) + '">' + esc(r.company) + '</a>';
                }).join(" · ") +
            '</div>' +
          '</div>';
        }).join("") +
      '</div>'
    );
  }

  /* ================================================== 5. ASK ENGINE ======== */
  /* This is a LOCAL keyword search. It is not an AI model and makes no network
     calls. It works in three steps:
       1. Normalise the question and pull out words.
       2. Detect simple intents (counting, listing, city, type, company).
       3. Score every record by keyword overlap, then describe what it found.
     If nothing scores above zero, it says so instead of guessing. */

  var STOPWORDS = {
    "the":1,"a":1,"an":1,"is":1,"are":1,"was":1,"were":1,"in":1,"on":1,"at":1,
    "of":1,"for":1,"to":1,"and":1,"or":1,"what":1,"which":1,"who":1,"how":1,
    "many":1,"me":1,"show":1,"tell":1,"list":1,"give":1,"any":1,"there":1,
    "that":1,"this":1,"it":1,"do":1,"does":1,"did":1,"have":1,"has":1,"i":1,
    "my":1,"about":1,"with":1,"from":1,"by":1,"can":1,"you":1,"all":1,"be":1,
    "been":1,"their":1,"they":1,"we":1,"us":1,"please":1,"india":1,"indian":1,
    "gcc":1,"gccs":1,"centre":1,"center":1,"centres":1,"centers":1
  };

  function tokenise(text) {
    return String(text).toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, " ")
      .split(/\s+/)
      .filter(function (w) { return w.length > 1 && !STOPWORDS[w]; });
  }

  /* Build one searchable string per record, once. */
  var SEARCH_INDEX = RECORDS.map(function (r) {
    return {
      rec: r,
      text: [
        r.company, r.city, r.state, r.industry, r.category, r.status, r.parentHq,
        r.summary, r.interpretation, r.whyItMatters, r.facility || "",
        r.investment || "", (r.focusAreas || []).join(" "),
        (r.headcountClaim ? r.headcountClaim.value : ""),
        (r.caveats || []).join(" ")
      ].join(" ").toLowerCase()
    };
  });

  /* Topics this dataset deliberately does not hold. If a question is about one
     of these, we refuse even if some words happen to match a record — because
     answering would mean implying we have data we do not have. Each entry
     names the gap so the refusal is specific rather than a shrug. */
  var OUT_OF_SCOPE = [
    { test: /\bsalar|\bcompensation\b|\bpay\b|\bpackage|\bctc\b|\bwage/,
      missing: "salary or compensation data" },
    { test: /\battrition\b|\bturnover\b|\bretention\b/,
      missing: "attrition or retention data" },
    { test: /\brent\b|\bcost per|\boffice cost|\bper seat\b|\bcheaper\b|\bcost of living\b/,
      missing: "office cost or cost-per-seat benchmarks" },
    { test: /\bincentive|\bsubsid|\btax break|\bstate polic|\bsez\b/,
      missing: "state incentive or policy data" },
    { test: /\bcontact\b|\bemail\b|\bphone\b|\bwho should i call\b|\bdecision maker\b/,
      missing: "contact details for people at these companies" },
    { test: /\bbest provider|\brating|\breview|\bwhich (agency|vendor|provider|firm) is (good|best)/,
      missing: "service-provider ratings or track records" },
    { test: /\bwill\b|\bpredict|\bforecast|\bnext year\b|\bgoing to (open|set up)\b|\blikely to\b/,
      missing: "any ability to predict future activity — this tool reports only what has already been publicly announced" },
    { test: /\ball gccs?\b|\btotal number\b|\bhow many gccs? (are|in) (there|india)\b|\b2000\b|\b2,000\b/,
      missing: "coverage of all Indian GCCs — this is a 20-record sample" }
  ];

  /* A single incidental word match is not an answer. "What is the capital of
     France?" matches one record only because a parent company is French.
     Requiring a stronger match stops that from looking like a real result. */
  var MIN_SCORE = 3;

  function askEngine(question) {
    var q = String(question || "").trim();
    if (!q) return null;

    var lower = q.toLowerCase();
    var words = tokenise(q);

    /* Out-of-scope topics are refused before any searching happens. */
    var gaps = OUT_OF_SCOPE.filter(function (o) { return o.test.test(lower); });
    if (gaps.length) {
      return {
        matched: false,
        answer: "This dataset does not hold " + gaps[0].missing + ", so that question " +
                "cannot be answered honestly here.",
        detail: "GCC Atlas holds " + D.total + " records of publicly reported GCC activity: " +
                "company, city, date, activity type, focus areas, any headcount figure the " +
                "sources stated, and the source links. It deliberately excludes salary data, " +
                "cost benchmarks, state incentives, contact details, provider ratings and any " +
                "forecast of future activity. Those were left out because reliable public " +
                "evidence for them could not be gathered, and a confident-sounding guess " +
                "would be worse than no answer. See Sources & Method for the full list of " +
                "what is and is not covered.",
        records: []
      };
    }

    /* --- Step 2: detect what kind of question this is ------------------- */
    var detected = {
      city: CITIES.filter(function (c) { return lower.indexOf(c.toLowerCase()) !== -1; }),
      counting: /\bhow many\b|\bcount\b|\bnumber of\b/.test(lower),
      wantsAnnounced: /\bannounc|\bplanned\b|\bupcoming\b|\bnot yet\b|\bfuture\b/.test(lower),
      wantsExpansion: /\bexpand|\bexpansion\b|\bgrow/.test(lower),
      wantsNew: /\bnew\b|\bsetting up\b|\bset up\b|\bfirst\b/.test(lower),
      wantsHiring: /\bhir|\brecruit|\bjobs?\b|\bheadcount\b|\bemploy/.test(lower),
      wantsPrimary: /\bprimary source|\bpress release|\bverified\b|\breliable\b|\bhigh confidence\b/.test(lower)
    };

    /* --- Step 3: score every record ------------------------------------ */
    var scored = SEARCH_INDEX.map(function (entry) {
      var score = 0;
      var matchedWords = [];

      words.forEach(function (w) {
        if (entry.text.indexOf(w) !== -1) {
          // Company-name and city matches are worth more than body-text matches.
          var weight = 1;
          if (entry.rec.company.toLowerCase().indexOf(w) !== -1) weight = 6;
          else if (entry.rec.city.toLowerCase().indexOf(w) !== -1) weight = 4;
          else if (entry.rec.industry.toLowerCase().indexOf(w) !== -1) weight = 3;
          else if ((entry.rec.focusAreas || []).join(" ").toLowerCase().indexOf(w) !== -1) weight = 2;
          score += weight;
          matchedWords.push(w);
        }
      });

      // Intent bonuses.
      if (detected.wantsAnnounced && entry.rec.status === "Announced") score += 4;
      if (detected.wantsExpansion && entry.rec.category === "Expansion") score += 4;
      if (detected.wantsNew && entry.rec.category === "New GCC") score += 3;
      if (detected.wantsHiring && entry.rec.headcountClaim) score += 2;
      if (detected.wantsPrimary && entry.rec.sources.some(function (s) { return s.type === "primary"; })) score += 4;

      return { rec: entry.rec, score: score, matched: matchedWords };
    }).filter(function (x) { return x.score >= MIN_SCORE; })
      .sort(function (a, b) { return b.score - a.score; });

    /* --- Nothing matched: say so honestly ------------------------------ */
    if (!scored.length) {
      return {
        matched: false,
        answer: "This dataset cannot answer that. Nothing in the " + D.total +
          " records matches the words in your question.",
        detail: "GCC Atlas only searches its own curated records. It holds " + D.total +
          " GCC events across " + D.byCity.length + " cities (" + CITIES.join(", ") +
          ") and " + D.byIndustry.length + " industries, dated between 2025 and 2026. " +
          "It has no information about anything outside that sample, and it does not " +
          "search the internet or use a language model, so it cannot fill the gap by guessing.",
        records: []
      };
    }

    var top = scored.slice(0, 6);
    var cityFilterApplied = detected.city.length === 1 ? detected.city[0] : null;

    if (cityFilterApplied) {
      var cityOnly = scored.filter(function (x) { return x.rec.city === cityFilterApplied; });
      if (cityOnly.length) top = cityOnly.slice(0, 8);
    }

    /* --- Compose a sentence that describes what was actually found ----- */
    var answer;
    var n = top.length;
    var scopeNote = cityFilterApplied ? " in " + cityFilterApplied : "";

    if (detected.counting) {
      var pool = cityFilterApplied
        ? RECORDS.filter(function (r) { return r.city === cityFilterApplied; })
        : null;
      if (pool) {
        var ops = pool.filter(function (r) { return r.status === "Operational"; }).length;
        var ann = pool.filter(function (r) { return r.status === "Announced"; }).length;
        answer = "This dataset holds " + pool.length + " record" + (pool.length === 1 ? "" : "s") +
          " for " + cityFilterApplied + " — " + ops + " operational and " + ann +
          " announced but not yet open. Remember this is a 20-record sample, " +
          "not a count of all GCCs in " + cityFilterApplied + ".";
      } else {
        answer = n + " record" + (n === 1 ? "" : "s") + " in this dataset match your question. " +
          "The dataset holds " + D.total + " records in total, so this is not a market-wide count.";
      }
    } else if (detected.wantsAnnounced) {
      var annList = top.filter(function (x) { return x.rec.status === "Announced"; });
      answer = annList.length
        ? annList.length + " matching record" + (annList.length === 1 ? " is" : "s are") +
          " announced but not yet operational" + scopeNote + ": " +
          annList.map(function (x) { return x.rec.company; }).join(", ") + "."
        : "No matching records are at the announced-but-not-open stage" + scopeNote +
          ". The closest matches are shown below.";
    } else {
      answer = n + " record" + (n === 1 ? "" : "s") + scopeNote +
        " match your question, ranked by how closely they fit: " +
        top.slice(0, 4).map(function (x) { return x.rec.company; }).join(", ") +
        (n > 4 ? ", and others below." : ".");
    }

    return {
      matched: true,
      answer: answer,
      detail: null,
      records: top.map(function (x) { return x.rec; })
    };
  }

  var SUGGESTIONS = [
    "How many records in Hyderabad?",
    "Which companies have announced but not opened yet?",
    "Show me expansions in Bengaluru",
    "Which records have a primary source?",
    "Any pharma or healthcare companies?",
    "What is happening in Chennai?",
    "What are typical salaries at these GCCs?",
    "Which company will open a GCC next year?"
  ];

  function renderAsk() {
    var res = state.askResult;

    paint(
      '<div class="page-head">' +
        '<div class="eyebrow">Ask</div>' +
        '<h1>Ask GCC Atlas</h1>' +
        '<p>Ask a question in plain English and get an answer built only from the ' +
        '' + D.total + ' records in this dataset, with the supporting records and ' +
        'their sources shown underneath.</p>' +
      '</div>' +

      '<div class="ask-box">' +
        '<input id="ask-input" type="text" placeholder="e.g. which companies announced a GCC in Chennai?" value="' + esc(state.askQuestion) + '">' +
        '<button class="btn btn-primary" id="ask-go">Search dataset</button>' +
      '</div>' +

      '<div class="suggestions">' +
        SUGGESTIONS.map(function (s) {
          return '<button class="suggestion" data-q="' + esc(s) + '">' + esc(s) + '</button>';
        }).join("") +
      '</div>' +

      (res ?
        '<div class="answer' + (res.matched ? '' : ' no-match') + '">' +
          '<div class="answer-head">' + (res.matched ? 'Answer from the dataset' : 'Cannot answer from this dataset') + '</div>' +
          '<div class="answer-text">' + esc(res.answer) + '</div>' +
          (res.detail ? '<p style="margin:12px 0 0;font-size:13.5px;color:var(--ink-2);">' + esc(res.detail) + '</p>' : '') +
        '</div>' +
        (res.records.length ?
          '<div class="evidence-head">Supporting records (' + res.records.length + ')</div>' +
          res.records.map(function (r) {
            return '<div class="evidence-item">' +
              '<div class="evidence-top">' +
                '<span class="evidence-company"><a href="#/company/' + esc(r.id) + '">' +
                  esc(r.company) + '</a></span>' +
                '<span style="display:flex;gap:6px;flex-wrap:wrap;">' +
                  catChip(r.category) + confChip(r.confidence) +
                '</span>' +
              '</div>' +
              '<div style="font-size:13px;color:var(--ink-3);">' + esc(r.city) + ' · ' +
                esc(shortDate(r)) + ' · ' + esc(r.industry) + '</div>' +
              '<div class="evidence-why">' + esc(r.whyItMatters) + '</div>' +
              '<div class="evidence-sources">' +
                r.sources.map(function (s) {
                  return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
                    esc(s.name) + ' &nearr;</a>';
                }).join("") +
              '</div>' +
            '</div>';
          }).join("")
          : '')
        : '') +

      '<div class="disclosure">' +
        '<strong>How this works — and what it is not.</strong> This feature is a local ' +
        'keyword search written in plain JavaScript. It normalises your question, removes ' +
        'common filler words, detects a few simple patterns (counting, cities, activity ' +
        'type, source quality), then scores each of the ' + D.total + ' records by keyword ' +
        'overlap and describes what it found. ' +
        '<strong>It is not a language model and it is not AI.</strong> It makes no network ' +
        'requests, needs no API key, and costs nothing to run. It cannot answer anything ' +
        'outside this dataset, and when it finds no match it says so rather than ' +
        'generating a plausible-sounding guess. It also refuses questions about topics the ' +
        'dataset deliberately excludes — salaries, costs, state incentives, contacts, ' +
        'provider ratings, or predictions about the future. Try either of the last two ' +
        'suggested questions above to see that behaviour.' +
      '</div>'
    );

    function runAsk() {
      var v = el("ask-input").value;
      state.askQuestion = v;
      state.askResult = askEngine(v);
      renderAsk();
    }

    el("ask-go").addEventListener("click", runAsk);
    el("ask-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") runAsk();
    });
    Array.prototype.forEach.call(document.querySelectorAll(".suggestion"), function (b) {
      b.addEventListener("click", function () {
        el("ask-input").value = b.getAttribute("data-q");
        runAsk();
      });
    });
  }

  /* ---------------------------------------------------- sources & method --- */

  function renderSources() {
    paint(
      '<div class="page-head">' +
        '<div class="eyebrow">Sources &amp; Method</div>' +
        '<h1>How this dataset was built, and what it does not cover</h1>' +
        '<p>This page exists because a research tool that will not explain its own ' +
        'method cannot be trusted. Everything below describes what was actually done.</p>' +
      '</div>' +

      '<div class="prose">' +
        '<div class="callout warn">' +
          '<div class="callout-title">The most important limitation</div>' +
          '<p>' + esc(META.verificationStatus) + ' Use the <a href="#/verify">Verify</a> ' +
          'page to work through the links one by one.</p>' +
        '</div>' +

        '<h2>What is in the dataset</h2>' +
        '<p>' + esc(META.coverageStatement) + '</p>' +
        '<ul>' +
          '<li><strong>' + D.total + ' records</strong> across <strong>' + D.byCity.length +
            ' cities</strong>: ' + esc(CITIES.join(", ")) + '</li>' +
          '<li><strong>' + D.byIndustry.length + ' industries</strong>, from pharmaceuticals ' +
            'and banking to apparel retail and legal services</li>' +
          '<li><strong>' + D.sourceCount + ' source links</strong> in total; ' +
            '<strong>' + D.withPrimary + ' records</strong> cite at least one primary ' +
            'company source</li>' +
          '<li><strong>' + D.operational + ' operational</strong> centres and <strong>' +
            D.announced + ' announced</strong> but not yet open</li>' +
          '<li>Research date: <strong>' + esc(META.researchDate) + '</strong></li>' +
        '</ul>' +

        '<h2>What is explicitly not in it</h2>' +
        '<p>' + esc(META.notACompleteRegister) + '</p>' +
        '<ul>' +
          '<li>No live data. The dataset is a fixed snapshot in a file; nothing updates automatically.</li>' +
          '<li>No prediction. This tool reports what has been publicly announced. It does ' +
            'not forecast which companies will set up a GCC next, because the evidence ' +
            'available here does not support that claim.</li>' +
          '<li>No service-provider ratings or performance data. That information is not public.</li>' +
          '<li>No state incentive comparisons or office-cost benchmarks. These were considered ' +
            'and deliberately left out — getting them wrong would be worse than omitting them.</li>' +
          '<li>No user research. No recruitment agency has reviewed, tested, or validated ' +
            'this product. Every statement about what such firms need is a hypothesis.</li>' +
        '</ul>' +

        '<h2>How records were selected</h2>' +
        '<p>' + esc(META.methodSummary) + '</p>' +
        '<p>Examples of what was left out, and why:</p>' +
        '<ul>' + (META.excludedExamples || []).map(function (e) {
          return '<li>' + esc(e) + '</li>';
        }).join("") + '</ul>' +

        '<h2>Source types</h2>' +
        '<p>Each source link is tagged with what kind of source it is:</p>' +
        '<ul>' +
          '<li>' + srcChip("primary") + ' — the company\'s own newsroom, investor site, ' +
            'or an official wire release it issued. The strongest evidence available ' +
            'without speaking to the company.</li>' +
          '<li>' + srcChip("trade") + ' — an established industry or trade publication.</li>' +
          '<li>' + srcChip("news") + ' — a mainstream business or general news publication.</li>' +
        '</ul>' +

        '<h2>How confidence is assigned</h2>' +
        '<p>Confidence describes <strong>how well-evidenced a record is</strong> — not how ' +
        'big or important the event is. A small expansion with a company press release ' +
        'scores higher than a huge announcement reported only by a blog.</p>' +
        '<ul>' +
          '<li>' + confChip("High") + ' — a primary company source with a specific date, ' +
            'normally with independent corroboration.</li>' +
          '<li>' + confChip("Medium") + ' — multiple independent publications agreeing on ' +
            'the core facts, or a primary source with no corroboration found.</li>' +
          '<li>' + confChip("Low") + ' — a single weak source, or sources that contradict ' +
            'each other on material details such as the date.</li>' +
        '</ul>' +
        '<p>Current distribution across the ' + D.total + ' records:</p>' +
        barChart(D.byConfidence) +

        '<h2>Facts versus interpretation</h2>' +
        '<p>Every company page separates two things, visually and in the text:</p>' +
        '<ul>' +
          '<li><strong>What the sources state</strong> — reported facts only, kept close to ' +
            'the wording of the source.</li>' +
          '<li><strong>Our interpretation</strong> — reasoning added on top. This is ' +
            'labelled on every record and is not supported by the sources.</li>' +
        '</ul>' +
        '<p>Headcount figures are treated with particular care. Where a number describes ' +
        'building capacity or a long-range plan rather than committed hiring, the record ' +
        'says so. For example, the JPMorgan Chase record carries a reported capacity of ' +
        'around 30,000 — that is floor space, not a hiring target, and the record states ' +
        'that explicitly.</p>' +

        '<h2>Known problems in the data</h2>' +
        '<ul>' +
          '<li><strong>Terminology is inconsistent across the industry.</strong> Companies ' +
            'use "GCC", "Global Capability Centre", "Global Value Centre", "Global ' +
            'Innovation Centre", "capability center" and "Global Business Solutions" to ' +
            'describe broadly similar things. Any search-based method will miss records ' +
            'because of this.</li>' +
          '<li><strong>Dates can mean different things.</strong> An announcement date, a ' +
            'lease registration date, an inauguration date and a press-coverage date are ' +
            'all different events. Where sources conflict, the record shows both.</li>' +
          '<li><strong>Reporting is geographically skewed.</strong> States with active ' +
            'investment-promotion communications generate more coverage, which inflates ' +
            'their apparent share of activity.</li>' +
          '<li><strong>Consolidations look like growth.</strong> Several records describe ' +
            'companies bringing existing India teams together under a new centre. The ' +
            'headline numbers look like hiring but may involve little external recruitment.</li>' +
        '</ul>' +

        '<h2>What would make this materially better</h2>' +
        '<ul>' +
          '<li>Open and confirm every source link first-hand, then record who checked it and when.</li>' +
          '<li>Interview recruitment and staffing professionals to test whether any of this is ' +
            'actually useful to them. None of that has been done.</li>' +
          '<li>Add company registry data (MCA/ROC) to tie each centre to a legal entity.</li>' +
          '<li>Track state MoU announcements systematically, to test whether they reliably ' +
            'precede openings — one record here suggests a gap of roughly 17 months, which ' +
            'is an observation, not a finding.</li>' +
          '<li>Expand coverage well beyond ' + D.total + ' records, with a repeatable ' +
            'collection process rather than manual searching.</li>' +
        '</ul>' +
      '</div>'
    );
  }

  /* ------------------------------------------------------------- verify ---- */

  function renderVerify() {
    var allSources = [];
    RECORDS.forEach(function (r) {
      r.sources.forEach(function (s) {
        allSources.push({ rec: r, src: s });
      });
    });

    paint(
      '<div class="page-head">' +
        '<div class="eyebrow">Verify</div>' +
        '<h1>Source verification checklist</h1>' +
        '<p>Every source link in the dataset, in one list, so each one can be opened and ' +
        'confirmed. Tick a box once you have read the page and agree it supports the ' +
        'record. Ticks are remembered in this browser only.</p>' +
      '</div>' +

      '<div class="callout warn">' +
        '<div class="callout-title">Why this page exists</div>' +
        '<p>The dataset was compiled from search results. The environment it was built in ' +
        'blocked direct page fetching, so these ' + D.sourceCount + ' links were identified ' +
        'but not opened and read first-hand. Until that is done, treat every record as ' +
        'unconfirmed. This is a real limitation, not a formality.</p>' +
      '</div>' +

      '<div class="result-count" id="verify-count">0 of ' + allSources.length + ' sources checked</div>' +

      allSources.map(function (item, i) {
        var key = "gccatlas-verify-" + item.rec.id + "-" + i;
        return '<div class="verify-row">' +
          '<input type="checkbox" data-key="' + esc(key) + '" aria-label="Mark source as checked">' +
          '<div>' +
            '<div class="verify-company">' + esc(item.rec.company) +
              ' <span style="font-weight:400;color:var(--ink-3);font-size:13px;">— ' +
              esc(item.rec.city) + ' · ' + esc(shortDate(item.rec)) + '</span></div>' +
            '<div class="source-row" style="margin-bottom:5px;">' +
              '<span style="font-size:13px;font-weight:600;">' + esc(item.src.name) + '</span>' +
              srcChip(item.src.type) +
              confChip(item.rec.confidence) +
            '</div>' +
            '<div class="verify-links">' +
              '<a href="' + esc(item.src.url) + '" target="_blank" rel="noopener noreferrer">Open source &nearr;</a>' +
              '<span class="source-url">' + esc(item.src.url) + '</span>' +
              '<a href="#/company/' + esc(item.rec.id) + '">See what this record claims</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join("")
    );

    // Restore and persist tick state. Wrapped in try/catch because storage can
    // be unavailable in private windows or when site data is blocked.
    var boxes = document.querySelectorAll('.verify-row input[type="checkbox"]');

    function updateCount() {
      var done = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) done++; });
      var c = el("verify-count");
      if (c) c.textContent = done + " of " + boxes.length + " sources checked";
    }

    Array.prototype.forEach.call(boxes, function (b) {
      var key = b.getAttribute("data-key");
      try {
        if (localStorage.getItem(key) === "1") b.checked = true;
      } catch (e) { /* storage unavailable — checklist still works for this visit */ }

      b.addEventListener("change", function () {
        try {
          if (b.checked) localStorage.setItem(key, "1");
          else localStorage.removeItem(key);
        } catch (e) { /* ignore */ }
        updateCount();
      });
    });

    updateCount();
  }

  /* ========================================================= 6. STARTUP === */

  function init() {
    if (!RECORDS.length) {
      el("view").innerHTML = '<div class="empty">' +
        '<div class="empty-title">Dataset did not load</div>' +
        '<p>The file <code>data/records.js</code> could not be read. Make sure the whole ' +
        'project folder was kept together, then reload this page.</p></div>';
      return;
    }
    renderNav();
    window.addEventListener("hashchange", navigate);
    navigate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
