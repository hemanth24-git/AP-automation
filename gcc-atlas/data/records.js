/* ============================================================================
   GCC Atlas — curated dataset
   ----------------------------------------------------------------------------
   HOW TO READ THIS FILE

   Every record below describes ONE publicly reported Global Capability Centre
   (GCC) event in India. Nothing here is invented. Each record carries:

     summary          - what the cited sources state (facts as reported)
     interpretation   - OUR reading of it, clearly separated from the facts
     whyItMatters     - why a recruitment/staffing professional might care
     sources          - real URLs, with the publication name and source type
     confidence       - High / Medium / Low, with a written basis
     caveats          - anything the sources disagree on or leave unclear

   IMPORTANT HONESTY NOTE
   This dataset was compiled from web search results on 2026-10-10. The URLs
   below are the pages those results cited. The build environment blocked
   direct page fetching, so each URL has NOT yet been opened and read
   first-hand. Before submitting or presenting this work, open every link and
   confirm it says what the record claims. The app has a built-in
   "Verify" page that walks through this.

   This is a CURATED SAMPLE, not a complete register of Indian GCCs.
   ========================================================================== */

var GCC_META = {
  datasetName: "GCC Atlas — India GCC Activity Sample",
  researchDate: "2026-10-10",
  recordCount: 20,
  coverageStatement:
    "20 publicly reported GCC events in India, drawn from company press releases and business/trade media published between January 2025 and October 2026. Selected to cover a range of cities and industries.",
  notACompleteRegister:
    "This is a hand-curated sample for a product prototype. It is NOT a complete list of Indian GCCs. The assignment brief cites 2,000+ GCCs in India; this dataset covers 20 events.",
  verificationStatus:
    "Sources were identified through web search. Each URL still requires first-hand confirmation — see the Verify page.",
  methodSummary:
    "Records were included only where a named publication reported the event. Company-issued press releases were preferred. Records resting only on aggregator blogs or social posts were excluded.",
  excludedExamples: [
    "Several companies that appeared only in LinkedIn posts or 'top 10 GCC' roundup blogs were left out, because no named publication or company release could be found for them.",
    "Headcount figures quoted only by aggregator sites, without a company or major publication behind them, were left out of the record even where the company itself was included.",
    "Southwest Airlines (Hyderabad) and Rolls-Royce (Bengaluru) were researched but excluded: the first had no primary or major-publication source, the second had no confirmable date."
  ]
};

/* Source type meanings:
   primary = the company's own newsroom, investor site, or official wire release
   trade   = established trade/industry publication
   news    = mainstream business or general news publication
*/

var GCC_RECORDS = [
  /* ---------------------------------- HYDERABAD -------------------------- */
  {
    id: "eli-lilly-hyderabad",
    company: "Eli Lilly and Company",
    parentHq: "United States",
    industry: "Pharmaceuticals",
    city: "Hyderabad",
    state: "Telangana",
    category: "New GCC",
    status: "Operational",
    eventDate: "2025-08-01",
    datePrecision: "month",
    dateLabel: "Announced Jan 2025 · Inaugurated Aug 2025",
    facility: "LCCI Hyderabad, Gachibowli — approx. 220,000 sq ft",
    investment: null,
    focusAreas: ["Automation", "Artificial intelligence", "Software product engineering", "Cloud computing"],
    headcountClaim: {
      value: "1,000+ planned at announcement; 1,500 cited as a later target",
      basis: "Reported by trade press covering the company's announcement",
      note: "The January 2025 announcement cited 1,000+ hires; later coverage of the August inauguration cited a 1,500 target. The two figures differ."
    },
    summary:
      "In January 2025, Eli Lilly announced plans to establish a new global capability centre in Hyderabad, described as its second Indian centre after Bengaluru (opened 2016). The centre, LCCI Hyderabad, was reported to focus initially on automation, artificial intelligence, software product engineering and cloud computing. Trade press reported the facility was inaugurated in Gachibowli in August 2025 at approximately 220,000 sq ft.",
    interpretation:
      "A second Indian centre for an existing India employer suggests the company found its first centre worked well enough to repeat. For staffing firms this reads as a maturing relationship rather than a first-time entrant.",
    whyItMatters:
      "A stated target in the 1,000-1,500 range across AI, cloud and software engineering roles implies sustained technical hiring in Hyderabad over several years. Pharma-sector engineering talent is a narrower pool than general IT, which usually means more external recruiting support.",
    sources: [
      { name: "Indian Pharma Post", type: "trade", url: "https://www.indianpharmapost.com/news/lilly-to-establish-new-global-capability-centre-in-hyderabad-16647", date: "2025-01" },
      { name: "BioSpectrum India", type: "trade", url: "https://www.biospectrumindia.com/news/73/25527/eli-lilly-to-establish-new-global-capability-centre-in-hyderabad.html", date: "2025-01" },
      { name: "Indian Pharma Post (inauguration)", type: "trade", url: "https://www.indianpharmapost.com/digitisation/eli-lilly-inaugurates-global-capability-centre-in-hyderabad-to-advance-ai-initiatives-17540", date: "2025-08" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Multiple independent pharma trade publications report the same core facts. No copy of Lilly's own press release was located, so exact wording is unconfirmed.",
    caveats: [
      "Headcount target differs between the announcement (1,000+) and inauguration coverage (1,500).",
      "No primary company press release found."
    ]
  },

  {
    id: "hca-healthcare-hyderabad",
    company: "HCA Healthcare",
    parentHq: "United States",
    industry: "Healthcare",
    city: "Hyderabad",
    state: "Telangana",
    category: "New GCC",
    status: "Operational",
    eventDate: "2025-09-24",
    datePrecision: "day",
    dateLabel: "Inaugurated 24 Sep 2025",
    facility: "HITEC City, Sattva Knowledge Park — approx. 400,000 sq ft across four floors",
    investment: "Approx. USD 75 million planned by end of 2025 (as reported)",
    focusAreas: ["IT", "Supply chain", "Procurement", "Human resources", "Finance and accounting"],
    headcountClaim: {
      value: "India workforce expected to reach 3,000 by end of 2026",
      basis: "Reported by trade press covering the inauguration",
      note: "Reports differ on headcount at launch: one cited ~1,100 employees with 1,300 targeted by year-end; another cited ~1,200 roles filled."
    },
    summary:
      "HCA Healthcare inaugurated its first Global Capability Centre in Hyderabad on 24 September 2025. Reports describe a facility of roughly 400,000 sq ft across four floors in HITEC City's Sattva Knowledge Park, a planned investment of about USD 75 million by the end of 2025, and an expected India workforce of 3,000 by the end of 2026. Hiring was reported across IT, supply chain, procurement, human resources, and finance and accounting. Telangana IT and Industries Minister D. Sridhar Babu opened the facility.",
    interpretation:
      "The function list is unusually broad for a first centre — it spans technology and corporate back-office rather than engineering alone. That pattern tends to indicate a shared-services build rather than a pure tech hub.",
    whyItMatters:
      "A 3,000-person target across five distinct function families is a large, multi-skill hiring programme. Finance, procurement and HR roles at this volume are commonly filled with staffing-firm involvement, and a first-time India operator usually has less in-house recruiting capacity.",
    sources: [
      { name: "BioSpectrum India", type: "trade", url: "https://www.biospectrumindia.com/news/16/26722/hca-healthcare-sets-up-global-capability-centre-in-hyderabad.html", date: "2025-09" },
      { name: "Outlook Business", type: "news", url: "https://www.outlookbusiness.com/corporate/hca-healthcare-sets-up-global-capability-center-in-hyderabad", date: "2025-09" },
      { name: "Digital Health News", type: "trade", url: "https://www.digitalhealthnews.com/hca-healthcare-opens-first-global-capability-center-in-hyderabad", date: "2025-09" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Reported consistently by a mainstream business publication and multiple trade outlets. No primary HCA press release located; details come from coverage of the company's announcement.",
    caveats: [
      "Sources disagree on headcount at launch (~1,100 vs ~1,200).",
      "The USD 75 million figure is described as planned, not confirmed spend."
    ]
  },

  {
    id: "vanguard-hyderabad",
    company: "The Vanguard Group",
    parentHq: "United States",
    industry: "Asset management",
    city: "Hyderabad",
    state: "Telangana",
    category: "New GCC",
    status: "Operational",
    eventDate: "2025-11-03",
    datePrecision: "day",
    dateLabel: "Inaugurated 3 Nov 2025",
    facility: "Knowledge Park, Hyderabad — approx. 165,000 sq ft",
    investment: null,
    focusAreas: ["Engineering", "Cloud modernisation", "Data analytics", "Artificial intelligence", "Machine learning", "Cybersecurity"],
    headcountClaim: {
      value: "Expected to exceed 2,000 within four years",
      basis: "Reported by Business Standard",
      note: "Other reports cite ~300 professionals by end-2025 scaling to 2,300+ by 2029, and an earlier announcement of 2,300-2,500 hires over four years. Figures vary by source."
    },
    summary:
      "Vanguard's Global Value Centre in Hyderabad was inaugurated in early November 2025 by Telangana IT and Industries Minister D. Sridhar Babu. Business Standard reported a 165,000 sq ft facility with headcount expected to exceed 2,000 within four years. Reported focus areas include engineering excellence, cloud modernisation, data analytics, artificial intelligence, machine learning and cybersecurity. At the inauguration the minister stated Telangana had anchored over 70 GCCs in the previous year and aimed to anchor 120 new GCCs the following year.",
    interpretation:
      "Vanguard calls this a 'Global Value Centre' rather than a GCC. The naming varies across the industry; the underlying model looks the same. Worth noting that terminology differences make this market genuinely hard to search.",
    whyItMatters:
      "Financial-services engineering talent in Hyderabad is in direct competition with several other large BFSI centres in the same city. A 2,000+ ramp in that specific talent pool suggests sustained competition for the same candidates — useful context for a staffing firm pricing a mandate.",
    sources: [
      { name: "Business Standard", type: "news", url: "https://www.business-standard.com/companies/news/vanguard-global-value-center-hyderabad-125110301174_1.html", date: "2025-11-03" },
      { name: "The Siasat Daily", type: "news", url: "https://www.siasat.com/hyderabad-minister-sridhar-babu-inaugurates-vanguard-global-value-centre-3291621/", date: "2025-11" },
      { name: "People Matters", type: "trade", url: "https://www.peoplematters.in/news/economy-policy/telangana-to-create-12-lakh-jobs-with-120-global-capability-centres-by-2026-47075", date: "2025-11" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Covered by a major Indian business daily plus regional and trade press, with a named government official present. Headcount projections differ between sources.",
    caveats: [
      "Headcount and timeline figures vary across sources (2,000 in four years vs 2,300+ by 2029).",
      "Company uses 'Global Value Centre', not 'GCC'."
    ]
  },

  {
    id: "heineken-hyderabad",
    company: "HEINEKEN",
    parentHq: "Netherlands",
    industry: "Beverages / FMCG",
    city: "Hyderabad",
    state: "Telangana",
    category: "New GCC",
    status: "Operational",
    eventDate: "2026-04-29",
    datePrecision: "day",
    dateLabel: "Announced Jul 2025 · Opened 29 Apr 2026",
    facility: "HEINEKEN Business Services India (HBS India), Financial District — approx. 76,000 sq ft",
    investment: null,
    focusAreas: ["Finance", "Digital and technology", "Data and analytics", "Global business process transformation"],
    headcountClaim: {
      value: "300+ roles in the initial phase, projected to scale to 1,600",
      basis: "Reported by trade and sector press covering the opening",
      note: "The 1,600 figure is described as a projection over coming years, not a current headcount."
    },
    summary:
      "HEINEKEN officially opened HEINEKEN Business Services India (HBS India) in Hyderabad's Financial District on 29 April 2026, described as its first multifunctional business services hub in Asia and its fourth globally. Reported scope covers finance, digital and technology, data and analytics, and global business process transformation, supporting Asia Pacific and selected markets in Africa, the Middle East and Eastern Europe. The centre was reported as expected to create over 300 roles initially, scaling to 1,600. Earlier, in July 2025, trade press reported that TeamLease Digital was supporting HEINEKEN in setting up the centre.",
    interpretation:
      "The July 2025 report naming a staffing partner is the most directly relevant detail in this record: it is a concrete, published example of a GCC entrant using an external staffing firm to stand up a centre.",
    whyItMatters:
      "This is a documented case of exactly the commercial relationship a staffing firm would want to win. It is also a consumer-goods company rather than a technology firm, which widens the plausible customer set beyond tech.",
    sources: [
      { name: "Storyboard18", type: "news", url: "https://www.storyboard18.com/brand-makers/heineken-sets-up-its-first-global-capability-center-in-hyderabad-77842.htm", date: "2025-07-30" },
      { name: "People Matters", type: "trade", url: "https://www.peoplematters.in/news/business/heineken-to-set-up-its-first-global-capability-center-in-hyderabad-42281", date: "2025-07" },
      { name: "inside.beer", type: "trade", url: "https://www.inside.beer/news/detail/india-heineken-opens-hyderabad-tech-hub", date: "2026-04" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Two-stage reporting (2025 announcement, 2026 opening) from multiple independent outlets, with consistent core facts. No primary HEINEKEN release located.",
    caveats: [
      "The 1,600 headcount figure is a forward projection.",
      "The TeamLease Digital involvement is reported by trade press, not confirmed by either company directly in sources found."
    ]
  },

  {
    id: "loreal-hyderabad",
    company: "L'Oréal",
    parentHq: "France",
    industry: "Beauty / FMCG",
    city: "Hyderabad",
    state: "Telangana",
    category: "Announced / Planned",
    status: "Announced",
    eventDate: "2026-01-21",
    datePrecision: "day",
    dateLabel: "Announced 21 Jan 2026 (Davos) · Opening expected Nov 2026",
    facility: "Hyderabad — described as a beauty-tech global capability centre",
    investment: "More than INR 3,500 crore planned through 2030 (as reported)",
    focusAreas: ["Artificial intelligence", "Data", "Digital engineering", "Beauty-tech innovation"],
    headcountClaim: {
      value: "Around 2,000 highly skilled technology jobs expected",
      basis: "Reported by national press covering the Davos announcement",
      note: "A projection tied to a facility not yet open at the time of research."
    },
    summary:
      "Reports dated 21 January 2026 state that a Telangana government delegation announced at the World Economic Forum in Davos that L'Oréal would set up a beauty-tech global capability centre in Hyderabad, with CEO Nicolas Hieronimus making the decision known on the sidelines. Reported plans include investment of more than INR 3,500 crore through 2030 and around 2,000 technology jobs, with inauguration expected in November 2026. The project was first reported in November 2025 as one of L'Oréal's largest GCCs.",
    interpretation:
      "This is an announcement, not an operating centre. We have deliberately kept it in a separate category so it is never counted alongside centres that are actually running.",
    whyItMatters:
      "Announced-but-not-open is arguably the most commercially useful state for a staffing firm, because hiring has not yet been contracted. The stated November 2026 opening gives a concrete window.",
    sources: [
      { name: "Free Press Journal", type: "news", url: "https://www.freepressjournal.in/business/loral-to-open-worlds-first-beauty-tech-global-capability-centre-in-hyderabad-pouring-3500-crore-creating-2000-ai-jobs", date: "2026-01-21" },
      { name: "The South First", type: "news", url: "https://thesouthfirst.com/telangana/telangana-at-wef-loreal-to-set-up-worlds-first-beauty-tech-gcc-in-hyderabad/", date: "2026-01" },
      { name: "Storyboard18", type: "news", url: "https://www.storyboard18.com/how-it-works/loreal-picks-hyderabad-for-one-of-its-biggest-gccs-84284.htm", date: "2025-11" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Multiple national publications report the Davos announcement consistently, and it is attributed to a state government delegation plus the company CEO. However, no primary L'Oréal release was located and the centre was not open at the time of research.",
    caveats: [
      "Not yet operational — all figures are plans.",
      "Announcement was made by a state delegation; framing varies between 'world's first beauty-tech GCC' and 'proposed hub'."
    ]
  },

  {
    id: "nestle-hyderabad",
    company: "Nestlé Business Services (with Genpact)",
    parentHq: "Switzerland",
    industry: "Food and beverage / FMCG",
    city: "Hyderabad",
    state: "Telangana",
    category: "Announced / Planned",
    status: "Announced",
    eventDate: "2026-07-09",
    datePrecision: "day",
    dateLabel: "Announced 9 Jul 2026",
    facility: "Hyderabad — new GCC, delivered in partnership with Genpact",
    investment: null,
    focusAreas: ["Finance", "Procurement", "Human resources", "IT", "Business process improvement"],
    headcountClaim: null,
    summary:
      "On 9 July 2026, Genpact issued a press release announcing a partnership with Nestlé Business Solutions (Nestlé's shared-services arm) to establish a new Global Capability Center based in Hyderabad, intended to advance continuous improvement of business processes. Coverage describes the centre as consolidating shared services spanning finance, procurement, HR and IT, with Genpact acting as an innovation centre to improve digital adoption and operational consistency across Nestlé's network. Quotes were issued by Genpact's Tarun Chopra and NBS head Luca Fichera.",
    interpretation:
      "This is a partner-delivered GCC rather than a wholly captive one. That distinction matters commercially: the hiring relationship may sit with Genpact rather than with Nestlé directly.",
    whyItMatters:
      "A partner-led model changes who a staffing firm should actually approach. Treating this as a 'Nestlé' opportunity would likely target the wrong buyer — a useful illustration of why ownership structure belongs in the data.",
    sources: [
      { name: "Genpact (press release)", type: "primary", url: "https://genpact.gcs-web.com/node/22206", date: "2026-07-09" },
      { name: "Genpact media centre", type: "primary", url: "https://media.genpact.com/2026-07-09-Genpact-Partners-with-Nestle-Business-Solutions-to-Establish-New-Global-Capability-Center", date: "2026-07-09" },
      { name: "TechMarketView", type: "trade", url: "https://www.techmarketview.com/ukhotviews/archive/2026/07/15/genpact-lands-nestl-gcc-partnership", date: "2026-07-15" }
    ],
    confidence: "High",
    confidenceBasis:
      "Primary source: a dated press release on Genpact's own investor and media sites, with named executives quoted, plus independent analyst coverage.",
    caveats: [
      "No headcount or investment figure disclosed in the sources found.",
      "One outlet projected operational savings of 100-150 bps; that is the outlet's own estimate, not a company figure, and is excluded from this record."
    ]
  },

  /* ---------------------------------- BENGALURU --------------------------- */
  {
    id: "vontier-bengaluru",
    company: "Vontier Corporation",
    parentHq: "United States",
    industry: "Industrial technology",
    city: "Bengaluru",
    state: "Karnataka",
    category: "New GCC",
    status: "Operational",
    eventDate: "2025-01-29",
    datePrecision: "day",
    dateLabel: "Opened 29 Jan 2025",
    facility: "Bengaluru Capability Center — expands an engineering centre opened in 2024",
    investment: null,
    focusAreas: ["Innovation", "Artificial intelligence", "Technology development"],
    headcountClaim: {
      value: "70 employees at opening, with plans to grow to as many as 500",
      basis: "Company press release",
      note: "An earlier engineering hub had brought in about 250 staff, per the same release."
    },
    summary:
      "Vontier issued a press release dated 29 January 2025 announcing the grand opening of a new Capability Center in Bengaluru, adding space and capabilities to an engineering centre the company had opened in Bengaluru in 2024. The release states the new centre adds 70 employees with plans to grow to as many as 500, and that staff support Vontier's businesses on innovation, AI and technology work. CEO Mark Morelli described India as central to the company's growing global software needs. The release cites approximately 8,100 employees globally and strategic technology centres in Houston, Auckland, Tel Aviv, Florence, Buenos Aires and Bengaluru.",
    interpretation:
      "A 70-to-500 growth plan on an already-established base is a staged expansion, not a greenfield entry. Staged ramps tend to produce recurring hiring demand over time rather than one large burst.",
    whyItMatters:
      "The explicit 70-to-500 trajectory gives a rare published growth path. For a staffing firm this is directly usable: the gap between current and target headcount is the addressable hiring.",
    sources: [
      { name: "Vontier investor relations (press release)", type: "primary", url: "https://investors.vontier.com/press-releases/press-releases-details/2025/Vontier-Expands-India-Innovation-and-Technology-Footprint-Opens-New-State-Of-The-Art-Capability-Center-in-Bengaluru/default.aspx", date: "2025-01-29" },
      { name: "Business Wire", type: "primary", url: "https://www.businesswire.com/news/home/20250129890010/en/Vontier-Expands-India-Innovation-and-Technology-Footprint-Opens-New-State-Of-The-Art-Capability-Center-in-Bengaluru", date: "2025-01-29" }
    ],
    confidence: "High",
    confidenceBasis:
      "Primary source: dated press release on the company's own investor relations site, additionally distributed via Business Wire. Named CEO quote included.",
    caveats: [
      "The 500 figure is a stated plan, not current headcount."
    ]
  },

  {
    id: "merck-bengaluru",
    company: "Merck (Merck KGaA, Darmstadt)",
    parentHq: "Germany",
    industry: "Life sciences / pharmaceuticals",
    city: "Bengaluru",
    state: "Karnataka",
    category: "New GCC",
    status: "Operational",
    eventDate: "2026-06-29",
    datePrecision: "day",
    dateLabel: "Reported 29 Jun 2026",
    facility: "Merck Global Capability Centre, Electronic City, Bengaluru",
    investment: null,
    focusAreas: ["Technology", "Business services"],
    headcountClaim: {
      value: "Campus designed to house approximately 3,300 professionals",
      basis: "Reported by trade press",
      note: "Describes designed capacity, not confirmed current headcount."
    },
    summary:
      "Trade press reported on 29 June 2026 that Merck opened its Global Capability Centre in Electronic City, Bengaluru, bringing together its existing India technology and services operations. The campus was reported as designed to house approximately 3,300 professionals.",
    interpretation:
      "The phrase 'bringing together existing operations' suggests consolidation of teams the company already had in India, rather than a net addition of 3,300 new roles. We have not found a figure for how many of those seats are new hires.",
    whyItMatters:
      "Consolidations can look like large hiring events in headline numbers while producing far less external recruiting. Distinguishing consolidation from greenfield growth is exactly the kind of judgement a directory listing would miss.",
    sources: [
      { name: "BioSpectrum India", type: "trade", url: "https://www.biospectrumindia.com/news/16/28039/merck-inaugurates-global-capability-centre-in-bengaluru.html", date: "2026-06-29" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Single established trade publication, with a specific date and location. No primary company release located and no independent second source found.",
    caveats: [
      "Rests on one publication.",
      "3,300 is designed capacity; the share representing new hiring is unknown."
    ]
  },

  {
    id: "abercrombie-fitch-bengaluru",
    company: "Abercrombie & Fitch Co.",
    parentHq: "United States",
    industry: "Retail / apparel",
    city: "Bengaluru",
    state: "Karnataka",
    category: "New GCC",
    status: "Operational",
    eventDate: "2026-08-06",
    datePrecision: "day",
    dateLabel: "Announced 6 Aug 2026",
    facility: "Bengaluru Global Capability Center — new office in India",
    investment: null,
    focusAreas: ["Enterprise capabilities"],
    headcountClaim: null,
    summary:
      "A PR Newswire release dated 6 August 2026, carried by The Wire, announced that Abercrombie & Fitch Co. had opened a Global Capability Center in Bengaluru, establishing a new office in India, to support continued global growth and strengthen enterprise capabilities.",
    interpretation:
      "A specialty apparel retailer opening an India capability centre is a signal that GCC adoption has moved well beyond technology and financial services into mid-size consumer brands.",
    whyItMatters:
      "Retail and consumer brands are typically less equipped with India recruiting infrastructure than technology firms, which may make them more reliant on external partners when standing up a first centre.",
    sources: [
      { name: "PR Newswire via The Wire", type: "primary", url: "https://m.thewire.in/article/ptiprnews/abercrombie-fitch-co-opens-global-capability-center-in-bengaluru-to-support-continued-global-growth-and-strengthen-enterprise-capabilities", date: "2026-08-06" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "A company-issued wire release (primary in origin) carried by a news platform. However, it was seen only via that carrier, and the release contains limited operational detail.",
    caveats: [
      "No headcount, facility size, or function detail in the source found.",
      "Seen via a syndication carrier rather than the company's own newsroom."
    ]
  },

  {
    id: "the-standard-bengaluru",
    company: "The Standard (StanCorp Global Services India)",
    parentHq: "United States",
    industry: "Insurance and retirement",
    city: "Bengaluru",
    state: "Karnataka",
    category: "New GCC",
    status: "Operational",
    eventDate: "2026-04-21",
    datePrecision: "day",
    dateLabel: "Inaugurated 21 Apr 2026",
    facility: "Embassy Tech Village, Bengaluru — operating as StanCorp Global Services India Private Limited",
    investment: null,
    focusAreas: ["AI engineering", "Cloud platform development", "Data and analytics", "Digital transformation", "Insurance operations"],
    headcountClaim: {
      value: "Plans to nearly double to almost 400 employees by end of 2026",
      basis: "Reported by a single trade publication",
      note: "India presence began with approximately 175 employees inherited through an acquisition in November 2025."
    },
    summary:
      "The Standard, a US insurance and retirement firm, formally opened its global capability centre at Embassy Tech Village, Bengaluru, on 21 April 2026. It was inaugurated by Karnataka's Minister for Electronics, IT and Biotechnology, Priyank Kharge, and operates under the legal name StanCorp Global Services India Private Limited. Reported focus areas are AI engineering, cloud platform development, data and analytics, digital transformation and insurance operations. Coverage describes a shift of selected technology work from vendor-led models to in-house engineering teams. The India presence began in November 2025 with the acquisition of Allstate's Employer Voluntary Benefits business, which brought approximately 175 employees in Bengaluru. Mohua Sengupta was named senior vice president and country head for India.",
    interpretation:
      "The reported move from vendor-led delivery to in-house engineering is the notable detail. It implies work transferring away from IT service providers and toward direct employment.",
    whyItMatters:
      "An insourcing shift creates direct-hire demand in place of vendor contracts, and the named country head is a concrete point of contact. The acquisition origin also means the entity existed before the centre did — relevant when searching company registries.",
    sources: [
      { name: "HRKatha", type: "trade", url: "https://www.hrkatha.com/expansion/the-standard-launches-new-gcc-in-bengaluru/", date: "2026-04" },
      { name: "Reinsurance Asia", type: "trade", url: "https://reinasia.com/us-insurance-firm-the-standard-opens-global-capability-centre-in-india/", date: "2026-04" },
      { name: "People Matters", type: "trade", url: "https://www.peoplematters.in/news/business/the-standard-grows-india-gcc-to-400-positioning-bengaluru-at-the-centre-of-its-innovation-strategy-51594", date: "2026" },
      { name: "Analytics India Magazine", type: "trade", url: "https://analyticsindiamag.com/gcc/the-standard-launches-new-gcc-in-india", date: "2026-04" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Four independent trade publications agree on date, location, legal entity and focus areas, and a named state minister inaugurated it. The headcount target comes from a single report and is a company projection.",
    caveats: [
      "The ~400 by end-2026 figure rests on one publication.",
      "Sources describe the centre as spanning Bengaluru and Pune; this record covers the Bengaluru inauguration."
    ]
  },

  {
    id: "aon-bengaluru",
    company: "Aon plc",
    parentHq: "Ireland / United States",
    industry: "Insurance brokerage and professional services",
    city: "Bengaluru",
    state: "Karnataka",
    category: "Expansion",
    status: "Operational",
    eventDate: "2026-06-03",
    datePrecision: "day",
    dateLabel: "Announced 3 Jun 2026",
    facility: "The Earth Centre by Vista Spaces, Whitefield, Bengaluru — LEED-certified",
    investment: null,
    focusAreas: ["Capability centre operations"],
    headcountClaim: null,
    summary:
      "Aon announced on 3 June 2026 that it had expanded its Bengaluru capability centre with a new site at The Earth Centre by Vista Spaces in Whitefield. The company describes the site as a collaborative workplace with meeting rooms, training spaces and shared areas, and cites LEED certification as part of its sustainability commitments. Aon's Indian capability centres are located in Bengaluru, Noida and Gurgaon, with client-facing offices in 17 other cities. Aon named Shiney Prasad as head of its Global Capability Centres in March 2026, and later appointed Nayana Mitter as head of strategy and programme management for its GCCs.",
    interpretation:
      "Two senior GCC-specific leadership appointments inside a few months is, in our reading, a stronger indicator of intent than the office itself. Companies do not usually build out that function unless the portfolio is growing.",
    whyItMatters:
      "Leadership hires in GCC strategy roles are a published, checkable signal that does not require guessing at headcount. The named individuals are also identifiable points of contact.",
    sources: [
      { name: "Aon newsroom (press release)", type: "primary", url: "https://www.aon.com/apac/in-the-press/asia-newsroom/2026/aon-reinforces-india-as-key-global-hub", date: "2026-06-03" },
      { name: "Reinsurance News", type: "trade", url: "https://www.reinsurancene.ws/aon-expands-bengalurus-global-capability-centre-with-new-facility/", date: "2026-06" },
      { name: "Insurance Business Asia", type: "trade", url: "https://www.insurancebusinessmag.com/asia/news/breaking-news/aon-adds-to-growing-list-of-india-capability-centres-577945.aspx", date: "2026-06" }
    ],
    confidence: "High",
    confidenceBasis:
      "Primary source: Aon's own newsroom, corroborated by two independent trade publications.",
    caveats: [
      "No headcount or investment figure disclosed.",
      "A separate report of a ~2 lakh sq ft Bengaluru lease by 'Aon Consulting' could not be clearly linked to this facility and is therefore excluded from this record."
    ]
  },

  {
    id: "sirva-bengaluru",
    company: "Sirva",
    parentHq: "United States",
    industry: "Relocation and moving services",
    city: "Bengaluru",
    state: "Karnataka",
    category: "Expansion",
    status: "Operational",
    eventDate: "2026-08-04",
    datePrecision: "day",
    dateLabel: "Announced 4 Aug 2026",
    facility: "Prestige Shantiniketan, Whitefield, Bengaluru — 250+ seats, up from 170",
    investment: null,
    focusAreas: ["Finance", "Customer experience", "Procurement", "Project management", "Technology"],
    headcountClaim: {
      value: "More than 250 seats, up from 170 at the previous site",
      basis: "Company press release",
      note: "Stated as seat capacity rather than filled headcount."
    },
    summary:
      "Sirva issued a press release dated 4 August 2026 stating it had opened a larger global capability centre at Prestige Shantiniketan in Whitefield, Bengaluru, providing more than 250 seats, up from 170 at the previous site. The company refers to the project as 'Project Vistar' and describes Bengaluru as a cornerstone of its global operations. Sirva first established operations in India in 1999 through its household goods business under the Allied brand. Bengaluru teams are described as handling finance, customer experience, procurement, project management and technology work.",
    interpretation:
      "A move from 170 to 250+ seats is a modest expansion by GCC standards. We have included it deliberately: most published GCC activity is small, and a dataset showing only large announcements would misrepresent the market.",
    whyItMatters:
      "Smaller expansions are more numerous than headline ones and are usually ignored by market reports. For a staffing firm, a 80-seat increment is still a real mandate — and far less contested than a marquee account.",
    sources: [
      { name: "Sirva newsroom (press release)", type: "primary", url: "https://www.sirva.com/company/news/2026/08/04/sirva-expands-global-capability-center-bengaluru-india", date: "2026-08-04" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Primary source: the company's own dated press release. However, no independent coverage was found, so the claims rest solely on the company's own account.",
    caveats: [
      "Single source, company-issued, with no independent corroboration found.",
      "Seat capacity is not the same as headcount."
    ]
  },

  {
    id: "smartsheet-bengaluru",
    company: "Smartsheet",
    parentHq: "United States",
    industry: "Software (SaaS)",
    city: "Bengaluru",
    state: "Karnataka",
    category: "Hiring / Investment",
    status: "Operational",
    eventDate: "2026-03-09",
    datePrecision: "day",
    dateLabel: "Announced 9 Mar 2026",
    facility: "Bengaluru Global Capabilities Center — opened 2025",
    investment: null,
    focusAreas: ["Engineering", "Data science", "DevSecOps", "Product management", "UX design", "Customer support", "Marketing", "Sales", "Talent acquisition"],
    headcountClaim: {
      value: "Plans to add more than 200 employees in 2026",
      basis: "Company announcement distributed via Business Wire India",
      note: "Sources differ slightly on phrasing: 'in 2026' versus 'over the next year'."
    },
    summary:
      "An announcement carried by Business Wire India around 9 March 2026 states that Smartsheet is investing in its Bengaluru Global Capabilities Center, which it opened in 2025, and plans to add more than 200 employees there in 2026. Reported hiring targets data scientists, DevSecOps engineers, product managers and UX designers, and the company states the site will take on customer support, marketing, sales, talent acquisition and G&A work in addition to engineering. Madhusudan Krishnapuram, vice president of engineering and site lead, is quoted saying the team had exceeded its first-year targets.",
    interpretation:
      "The expansion from engineering into sales, marketing and talent acquisition is the most interesting element. A centre taking on its own talent acquisition function may become less reliant on external recruiters over time, not more.",
    whyItMatters:
      "A stated +200 for a single year is a clear, dated hiring number. The note about in-housing talent acquisition is a genuine counter-signal worth knowing before pitching — it suggests a narrowing window.",
    sources: [
      { name: "CXOToday (Business Wire India release)", type: "trade", url: "https://cxotoday.com/media-coverage/smartsheet-investing-in-global-capabilities-center-in-india-to-accelerate-innovation/", date: "2026-03-09" },
      { name: "VARINDIA", type: "trade", url: "https://www.varindia.com/public/news/smartsheet-investing-in-global-capabilities-center-in-india-to-accelerate-innovation", date: "2026-03" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Originates from a company announcement via Business Wire India, with a named company executive quoted. The outlets carrying it are largely reprints of the same release rather than independent reporting.",
    caveats: [
      "Available sources are reprints of one release, not independent confirmation.",
      "Timing phrased differently across sources."
    ]
  },

  /* ------------------------------------- PUNE ----------------------------- */
  {
    id: "magnum-ice-cream-pune",
    company: "The Magnum Ice Cream Company",
    parentHq: "Netherlands / United Kingdom",
    industry: "Food and beverage / FMCG",
    city: "Pune",
    state: "Maharashtra",
    category: "New GCC",
    status: "Operational",
    eventDate: "2026-09-04",
    datePrecision: "day",
    dateLabel: "Inaugurated 4 Sep 2026",
    facility: "Pune — 67,000 sq ft Global Capability Centre",
    investment: null,
    focusAreas: ["Finance", "Procurement", "Supply chain", "Marketing", "Master data"],
    headcountClaim: {
      value: "Over 1,000 direct jobs expected",
      basis: "Reported by news coverage, not stated in the company release reviewed",
      note: "The company's own release does not carry this figure in the text located; it appears in secondary coverage."
    },
    summary:
      "The Magnum Ice Cream Company's own newsroom published a release dated 4 September 2026 announcing it had opened a 67,000 sq ft Global Capability Centre in Pune, with Maharashtra Chief Minister Devendra Fadnavis as chief guest. The release states the centre follows a Memorandum of Understanding signed with the Government of Maharashtra in April 2025 and describes it as the company's most advanced Global Business Solutions location worldwide. Trade coverage reports the centre will support finance, procurement, supply chain, marketing and master data work. Separate news coverage reports the facility will generate over 1,000 direct jobs.",
    interpretation:
      "The April 2025 state MoU preceding a September 2026 opening gives a roughly 17-month gap between government commitment and operational centre. State MoUs may therefore be a usefully early, and publicly checkable, indicator.",
    whyItMatters:
      "If state MoU announcements reliably precede openings by over a year, they are a far earlier signal than the opening itself. This single record is not enough to establish that pattern — it is a hypothesis worth testing across more cases.",
    sources: [
      { name: "The Magnum Ice Cream Company newsroom (press release)", type: "primary", url: "https://news.magnumicecream.com/the-magnum-ice-cream-company-inaugurates-new-global-capability-centre-in-pune/", date: "2026-09-04" },
      { name: "FoodBev Media", type: "trade", url: "https://www.foodbev.com/post301/magnum-ice-cream-company-opens-67-000-sq-ft-global-capability-centre-in-pune", date: "2026-09-08" },
      { name: "Food Business MEA", type: "trade", url: "https://www.foodbusinessmea.com/magnum-ice-cream-company-opens-67000-square-foot-capability-centre-in-india/", date: "2026-09" }
    ],
    confidence: "High",
    confidenceBasis:
      "Primary source: the company's own newsroom, with a dated release and a named state Chief Minister present, corroborated by two independent trade publications.",
    caveats: [
      "The 1,000+ jobs figure comes from secondary coverage, not the company release text located.",
      "Sources use different names for the facility (GCC vs Global Business Solutions centre)."
    ]
  },

  {
    id: "ice-pune",
    company: "Intercontinental Exchange (ICE MT India)",
    parentHq: "United States",
    industry: "Financial infrastructure / mortgage technology",
    city: "Pune",
    state: "Maharashtra",
    category: "New GCC",
    status: "Operational",
    eventDate: "2026-02-01",
    datePrecision: "month",
    dateLabel: "Lease registered Dec 2025 · Reported Feb 2026",
    facility: "Tower S3, Magarpatta Cybercity, Pune — approx. 1.93 lakh sq ft (chargeable), nine-year term",
    investment: "Total rent reported at approx. INR 217 crore over nine years",
    focusAreas: ["Product engineering", "Technology services", "Back-end operations"],
    headcountClaim: null,
    summary:
      "Property and business coverage reports that ICE MT India Private Limited leased approximately 1.93 lakh sq ft (chargeable area; 1.54 lakh sq ft carpet) across nine floors in Tower S3 of Magarpatta Cybercity, Pune, on a nine-year tenure, with Axis Max Life Insurance as lessor. Reported terms include total rent of about INR 217 crore over nine years, monthly rent of about INR 1.73 crore, 15% escalation every 36 months and a security deposit of about INR 10.42 crore. The space is reported to become a GCC for product engineering, technology services and back-end operations for ICE's platforms.",
    interpretation:
      "This record is included partly as an example of a common data problem: one source dates the transaction to 29 December 2025 (registration) while another reports it in February 2026. These are probably the registration date and the public reporting date, but we cannot confirm that, so both are shown.",
    whyItMatters:
      "A registered commercial lease is a harder commitment than a press statement, and lease registrations are a matter of public record. Office-leasing news may therefore be a more reliable early indicator than company announcements.",
    sources: [
      { name: "Dwello", type: "news", url: "https://dwello.in/news/217-crore-deal-mortgage-technology-takes-193-lakh-sq-ft-in-punes-magarpatta-cyber-city", date: "2026" },
      { name: "The Realty Today", type: "trade", url: "https://therealtytoday.com/news/commercial/ice-expands-india-presence-with-large-scale-office-lease-in-pune/", date: "2026-02" }
    ],
    confidence: "Low",
    confidenceBasis:
      "Reported only by property-sector outlets, with a direct conflict between sources on the date (29 Dec 2025 registration vs Feb 2026 report) and a discrepancy on area (1.93 lakh vs ~200,000 sq ft). No company release or major publication located. Included with this label rather than excluded, because the underlying lease detail is specific and checkable.",
    caveats: [
      "Date conflict between sources, unresolved.",
      "Area figures differ depending on carpet vs chargeable measurement.",
      "No company confirmation located; GCC purpose is as characterised by the property press."
    ]
  },

  {
    id: "accenture-pune",
    company: "Accenture",
    parentHq: "Ireland",
    industry: "IT and professional services",
    city: "Pune",
    state: "Maharashtra",
    category: "Announced / Planned",
    status: "Announced",
    eventDate: "2026-05-01",
    datePrecision: "month",
    dateLabel: "Reported May 2026",
    facility: "Phoenix Millennium Towers, Baner, Pune — reported 6 lakh+ sq ft on a 15-year-plus lease",
    investment: "Reported as an INR 325 crore office deal",
    focusAreas: ["Global capability centre operations"],
    headcountClaim: null,
    summary:
      "Trade coverage reported in May 2026 that Accenture signed a lease of more than 6 lakh sq ft at Phoenix Millennium Towers in Baner, Pune, on a term of 15 years or more, described as an INR 325 crore deal, to set up a global capability centre. Reports state the company planned to move in progressively, with full operations likely by mid-year.",
    interpretation:
      "Accenture is itself a service provider rather than a typical GCC parent company, so this record sits awkwardly in the 'GCC' category. We have kept it because the sources describe it as a GCC, and flagged the ambiguity rather than quietly reclassifying it.",
    whyItMatters:
      "Large service-provider facilities compete for the same candidates as captive centres in the same city. For a staffing firm, that competition matters regardless of how the facility is labelled.",
    sources: [
      { name: "People Matters", type: "trade", url: "https://www.peoplematters.in/news/business/accenture-signs-indian-rupee325-crore-pune-office-deal-to-set-up-global-capability-centre-49508", date: "2026-05" },
      { name: "Trak.in", type: "news", url: "https://trak.in/stories/accenture-leases-600000-sq-feet-office-space-in-pune-for-new-gcc/", date: "2026-05" }
    ],
    confidence: "Low",
    confidenceBasis:
      "No company release or major business daily was located, the exact date is not pinned down, and the 'GCC' characterisation is the publications' framing for a company that is itself an IT services provider. A follow-up check also found reports that disagree on the basic terms of the lease, which is why this record carries the lowest confidence in the dataset.",
    caveats: [
      "Classification as a GCC is contestable given Accenture's business model.",
      "Only month-level dating available.",
      "No primary source located; reporting attributes details to unnamed sources.",
      "Sources disagree on the deal itself. The figures here (6 lakh sq ft, Baner, approx. INR 325 crore, 15-year term) are the most widely reported, but a separate report describes 345,872 sq ft at Phoenix Millennium Towers in Wakad for approx. INR 355.4 crore over 10 years. These may be two different transactions or a reporting error; we could not resolve it.",
      "A source originally cited here (SightsIn Plus) would not load during verification on 12 Oct 2026 and has been replaced."
    ]
  },

  /* ------------------------------------ MUMBAI ---------------------------- */
  {
    id: "jpmorgan-mumbai",
    company: "JPMorgan Chase",
    parentHq: "United States",
    industry: "Banking and financial services",
    city: "Mumbai",
    state: "Maharashtra",
    category: "Announced / Planned",
    status: "Announced",
    eventDate: "2025-12-24",
    datePrecision: "day",
    dateLabel: "Lease registered 24 Dec 2025 · Completion targeted 2029",
    facility: "One Forest Avenue, Powai, Mumbai — reported 2 million sq ft, built-to-suit, 20-year lease",
    investment: null,
    focusAreas: ["BFSI support", "Back-office technology", "Global analytics"],
    headcountClaim: {
      value: "Capacity reported for around 30,000 employees",
      basis: "Reported capacity of a planned campus, not a hiring commitment",
      note: "This is building capacity for a campus targeted for completion in 2029. Several outlets describe the plan as 'reported' or 'planned' rather than finalised."
    },
    summary:
      "Reports in mid-December 2025 state that JPMorgan Chase plans a large global capability centre in Mumbai, committing 2 million sq ft of office space in Powai with capacity for around 30,000 employees, to be developed in phases and targeted for completion by 2029. Brookfield Properties was reported to have confirmed a built-to-suit lease agreement with JPMorgan Chase, with JPMorgan as sole tenant on a 20-year term at One Forest Avenue, Powai; registration of the deal was reported as completed on 24 December 2025. The centre is described as consolidating and expanding JPMorgan's existing India operations, particularly in BFSI support, back-office technology and global analytics.",
    interpretation:
      "The 30,000 figure is building capacity, not a hiring plan, and the word 'consolidating' appears in the reporting. A large share of those seats may be filled by people the company already employs in India. We have deliberately not presented this as 30,000 new jobs.",
    whyItMatters:
      "This is the clearest example in the dataset of a headline number that could easily be misread. A staffing firm sizing an opportunity from '30,000 employees' would be sizing something that does not exist.",
    sources: [
      { name: "People Matters", type: "trade", url: "https://www.peoplematters.in/news/business/jpmorgan-plans-asias-largest-gcc-in-mumbai-with-30000-employees-47772", date: "2025-12" },
      { name: "Kotak Securities (market news)", type: "news", url: "https://www.kotaksecurities.com/news/market-news/jp-morgan-asia-largest-gcc-mumbai-powai", date: "2025-12" },
      { name: "The Realty Today", type: "trade", url: "https://therealtytoday.com/news/commercial/jp-morgans-powai-lease-becomes-one-of-indias-biggest-single-tenant-office-deals", date: "2025-12" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Multiple independent outlets report consistent details including a specific registration date and a named developer counterparty. However, no primary JPMorgan or Brookfield release was located, and sources themselves hedge the plan as reported rather than confirmed.",
    caveats: [
      "30,000 is capacity, not a hiring target.",
      "Completion date varies by source (2029 in most, 2030 in one).",
      "Not operational; a building targeted for 2029."
    ]
  },

  /* ------------------------------------ CHENNAI --------------------------- */
  {
    id: "starbucks-chennai",
    company: "Starbucks",
    parentHq: "United States",
    industry: "Food and beverage retail",
    city: "Chennai",
    state: "Tamil Nadu",
    category: "Announced / Planned",
    status: "Announced",
    eventDate: "2026-09-21",
    datePrecision: "day",
    dateLabel: "MoU signed 21 Sep 2026",
    facility: "Chennai — first India GCC, per MoU with the Tamil Nadu government",
    investment: null,
    focusAreas: ["Technology"],
    headcountClaim: {
      value: "Expected to create about 800 technology jobs",
      basis: "Reported by national and regional press covering the MoU",
      note: "A projection stated at MoU stage, before any facility exists."
    },
    summary:
      "Reports dated 21 September 2026 state that Starbucks signed a Memorandum of Understanding with the Tamil Nadu government for its first India global capability centre in Chennai, expected to create about 800 technology jobs. Coverage notes the centre will operate separately from the company's retail joint venture with Tata Consumer Products.",
    interpretation:
      "The separation from the existing Tata joint venture is the detail worth noting: the GCC is a distinct corporate entity from the retail business. Anyone approaching this opportunity through the existing India retail relationship would likely reach the wrong organisation.",
    whyItMatters:
      "An MoU is the earliest publicly documented stage in this dataset — no building, no entity necessarily in place. That makes it the longest lead time available from public information, and also the least certain.",
    sources: [
      { name: "Deccan Chronicle", type: "news", url: "https://www.deccanchronicle.com/southern-states/tamil-nadu/starbucks-to-open-global-capability-centre-in-chennai-1989247", date: "2026-09-21" },
      { name: "TimesLIVE (Reuters-sourced)", type: "news", url: "https://www.timeslive.co.za/news/world/2026-09-21-us-coffee-chain-starbucks-plans-global-tech-centre-in-india/", date: "2026-09-21" },
      { name: "New Kerala", type: "news", url: "https://www.newkerala.com/news/a/starbucks-open-global-capability-centre-chennai-800-plus-jobs-454.htm", date: "2026-09" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Reported by multiple mainstream publications on the same date, including one carrying international wire coverage, and tied to a government MoU. No primary Starbucks release located, and the project is at MoU stage only.",
    caveats: [
      "MoU stage: no facility, timeline, or confirmed entity.",
      "The 800-jobs figure is a projection."
    ]
  },

  {
    id: "lexitas-chennai",
    company: "Lexitas",
    parentHq: "United States",
    industry: "Legal services and litigation support",
    city: "Chennai",
    state: "Tamil Nadu",
    category: "Expansion",
    status: "Operational",
    eventDate: "2026-09-07",
    datePrecision: "day",
    dateLabel: "Opened 7 Sep 2026",
    facility: "Chennai — houses GCC, AI Innovation Hub and Strategic Operations Center",
    investment: null,
    focusAreas: ["AI innovation", "Strategic operations", "Litigation support services"],
    headcountClaim: null,
    summary:
      "Lexitas, a Houston-based litigation support company, announced it opened a Chennai facility on 7 September 2026 to house its global capability centre, AI Innovation Hub and Strategic Operations Center. The company states the office expands on India operations first established in July 2024.",
    interpretation:
      "A two-year gap between first establishing India operations and opening a named capability centre fits a pattern visible elsewhere in this dataset: companies often arrive small and formalise later.",
    whyItMatters:
      "Legal services is an uncommon GCC sector, and the roles involved differ substantially from standard IT hiring. Sector-specific demand like this is easy to miss in general market reports.",
    sources: [
      { name: "Lexitas newsroom (press release)", type: "primary", url: "https://www.lexitaslegal.com/news/lexitas-expands-operations-with-india-center", date: "2026-09-07" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Primary source: the company's own newsroom with a specific date. No independent corroboration located, so the claims rest on the company's own account.",
    caveats: [
      "Single, company-issued source.",
      "No headcount or facility size disclosed."
    ]
  },

  {
    id: "illumia-chennai",
    company: "Illumia (formerly Transact + CBORD)",
    parentHq: "United States",
    industry: "Education technology and payments",
    city: "Chennai",
    state: "Tamil Nadu",
    category: "Expansion",
    status: "Operational",
    eventDate: "2026-04-28",
    datePrecision: "day",
    dateLabel: "Announced 28 Apr 2026 · Inaugurated 27 Apr 2026",
    facility: "International Tech Park, Chennai",
    investment: null,
    focusAreas: ["Technology", "Product innovation"],
    headcountClaim: null,
    summary:
      "Illumia, formed from Transact and CBORD, announced on 28 April 2026 a new office in the International Tech Park, Chennai, for its global capability centre, with the inauguration having taken place on 27 April 2026. The company states it has spent nearly 14 years in Chennai.",
    interpretation:
      "A 14-year presence being newly described as a capability centre suggests some of what is reported as GCC growth is existing operations being renamed or reframed, rather than new arrivals.",
    whyItMatters:
      "This matters directly for how a staffing firm reads the market: a long-established site reclassifying itself does not necessarily mean new hiring. Distinguishing new entrants from relabelled incumbents is a genuine analytical task.",
    sources: [
      { name: "Illumia newsroom (press release)", type: "primary", url: "https://illumiatech.com/about/news-press/2026/04/29/illumia-invests-in-chennai-global-capability-center-to-drive-technology-and-product-innovation", date: "2026-04-28" }
    ],
    confidence: "Medium",
    confidenceBasis:
      "Primary source: the company's own news page with specific dates. No independent corroboration located.",
    caveats: [
      "Single, company-issued source.",
      "The URL path date (29 Apr) differs slightly from the announcement date reported (28 Apr); confirm during verification.",
      "No headcount disclosed."
    ]
  }
];

/* Make available to the app whether loaded via file:// or a local server. */
if (typeof window !== "undefined") {
  window.GCC_RECORDS = GCC_RECORDS;
  window.GCC_META = GCC_META;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GCC_RECORDS: GCC_RECORDS, GCC_META: GCC_META };
}
