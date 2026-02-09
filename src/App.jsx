import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════
// CONFIGURATION & CONSTANTS
// ═══════════════════════════════════════════════════════
const gold = "#c9a227";
const sans = "'DM Sans', sans-serif";
const serif = "'Playfair Display', Georgia, serif";
const mono = "'JetBrains Mono', monospace";

const TYPE_COLORS = {
  contact: { bg: "#1a3a5c", border: "#3b82f6", label: "Contact" },
  visit: { bg: "#3b1a1a", border: "#ef4444", label: "Visit" },
  financial: { bg: "#1a3b2a", border: "#22c55e", label: "Financial" },
  document: { bg: "#3b3b1a", border: "#eab308", label: "Document/Photo" },
  claim: { bg: "#2a1a3b", border: "#a855f7", label: "Statement" },
  travel: { bg: "#1a2a3b", border: "#06b6d4", label: "Flight/Travel" },
  allegation: { bg: "#3b1a2a", border: "#f43f5e", label: "Allegation" },
  government: { bg: "#1a2a2a", border: "#14b8a6", label: "Govt Action" },
  consequence: { bg: "#2a2a1a", border: "#f59e0b", label: "Consequence" },
};
const CONF = { "primary": { c: "#22c55e", l: "Primary Source" }, "corroborated": { c: "#3b82f6", l: "Corroborated" }, "single-source": { c: "#f59e0b", l: "Single Source" }};
const CY = 2008; // conviction year

// Photo URLs — replace with actual URLs when deploying
// Using Wikipedia Commons or public domain images where available
const PHOTOS = {
  "donald-trump": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg",
  "bill-clinton": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/220px-Bill_Clinton.jpg",
  "bill-gates": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/220px-Bill_Gates_2018.jpg",
  "elon-musk": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
  "howard-lutnick": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Howard_Lutnick_official_photo.jpg/220px-Howard_Lutnick_official_photo.jpg",
  "andrew-mw": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Prince_Andrew_August_2014_%28cropped%29.jpg/220px-Prince_Andrew_August_2014_%28cropped%29.jpg",
  "larry-summers": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Lawrence_Summers_2012.jpg/220px-Lawrence_Summers_2012.jpg",
  "mehmet-oz": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dr._Oz_headshot_%28cropped%29.jpg/220px-Dr._Oz_headshot_%28cropped%29.jpg",
  "peter-mandelson": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Official_portrait_of_Lord_Mandelson_crop_2.jpg/220px-Official_portrait_of_Lord_Mandelson_crop_2.jpg",
  "steve-bannon": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Steve_Bannon_official_portrait_%28cropped%29.jpg/220px-Steve_Bannon_official_portrait_%28cropped%29.jpg",
  "peter-thiel": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Peter_Thiel_by_Gage_Skidmore_%28cropped%29.jpg/220px-Peter_Thiel_by_Gage_Skidmore_%28cropped%29.jpg",
  "sergey-brin": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Sergey_Brin_cropped.jpg/220px-Sergey_Brin_cropped.jpg",
  "richard-branson": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Richard_Branson_March_2015_%28cropped%29.jpg/220px-Richard_Branson_March_2015_%28cropped%29.jpg",
  "john-phelan": "",
  "steven-tisch": "",
  "alexander-acosta": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Alexander_Acosta_official_photo.jpg/220px-Alexander_Acosta_official_photo.jpg",
  "leslie-wexner": "",
  "ghislaine-maxwell": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ghislaine_Maxwell_cropped.jpg/220px-Ghislaine_Maxwell_cropped.jpg",
  "leon-black": "",
  "noam-chomsky": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Noam_Chomsky%2C_2004.jpg/220px-Noam_Chomsky%2C_2004.jpg",
  "alan-dershowitz": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Alan_Dershowitz_2009.jpg/220px-Alan_Dershowitz_2009.jpg",
  "jes-staley": "",
  "eric-schmidt": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Eric_Schmidt_at_the_37th_G8_Summit_in_Deauville_037.jpg/220px-Eric_Schmidt_at_the_37th_G8_Summit_in_Deauville_037.jpg",
  "jeff-bezos": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg/220px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg",
  "george-stephanopoulos": "",
  "jean-luc-brunel": "",
  "kathryn-ruemmler": "",
  "josh-harris": "",
  "david-copperfield": "",
  "bill-richardson": "",
  "al-gore": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg/220px-Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg",
  "george-mitchell": "",
  "reid-hoffman": "",
  "stephen-hawking": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/220px-Stephen_Hawking.StarChild.jpg",
  "henry-kissinger": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Henry_Kissinger.jpg/220px-Henry_Kissinger.jpg",
  "mick-jagger": "",
  "deepak-chopra": "",
  "casey-wasserman": "",
  "brett-ratner": "",
  "dean-kamen": "",
};

// ═══════════════════════════════════════════════════════
// MASTER DATA — PROFILES
// ═══════════════════════════════════════════════════════
const P = {
  "donald-trump": {
    name: "Donald Trump", cat: "Politician / Government", role: "47th U.S. President", prev: "45th President, Real Estate Developer", init: "DT",
    sum: "Mentioned over 3,000 times in the files. Flight logs show 7-8 flights on Epstein's jet (1993-1997), four with Maxwell aboard. Friendship well-documented from late 1980s through ~2004. FBI compiled list of unverified allegations. House manager testified Trump 'never' stayed at Epstein's home. DOJ called specific claims 'unfounded and false.' Signed the Epstein Files Transparency Act.",
    resp: "DOJ stated some material contains 'untrue information' about Trump. White House: 'The claims are unfounded and false.' Trump: 'What this whole thing is with Epstein is a way of trying to deflect from the tremendous success that the Republican Party has.'",
    respDate: "Jan 2026",
    tax: [
      { type: "Presidential Salary", detail: "President of the United States ($400K/yr) — donated salary in first term", source: "White House records", status: "Active", amount: "$400,000/yr", verified: true },
      { type: "Executive Authority", detail: "Commander-in-chief with full federal budget authority ($6.75T FY2025)", source: "OMB", status: "Active", amount: "Full executive authority", verified: true },
      { type: "Post-Presidency (1st term)", detail: "Former Presidents Act — office, staff, travel, Secret Service (~$1.2M/yr between terms)", source: "CRS Reports", status: "Historical", amount: "$1.2M/yr (between terms)", verified: true },
      { type: "Mar-a-Lago / Secret Service", detail: "Secret Service protection costs at Mar-a-Lago estimated $2-3M/yr", source: "GAO reports", status: "Active", amount: "$2-3M/yr estimated", verified: true },
    ],
    conn: ["elon-musk", "howard-lutnick", "steve-bannon", "mehmet-oz", "john-phelan", "alexander-acosta", "bill-clinton"],
    tl: [
      { date: "Late 1980s", year: 1988, title: "Friendship Begins", desc: "Trump and Epstein became friends as Palm Beach neighbors. Epstein frequently visited Mar-a-Lago. They moved in the same social circles of New York and Florida wealth.", source: "Multiple media, Rolling Stone timeline", url: "https://www.rollingstone.com/politics/politics-features/donald-trump-jeffrey-epstein-timeline-1235464225/", type: "contact", confidence: "corroborated" },
      { date: "Nov 1992", year: 1992, title: "Mar-a-Lago Party Video", desc: "NBC filmed Trump hosting party at Mar-a-Lago with NFL cheerleaders. Footage shows Trump and Epstein assessing women, whispering, and laughing together. Trump seen patting a woman's buttocks.", source: "NBC archival footage, Rolling Stone", url: "https://www.rollingstone.com/politics/politics-features/donald-trump-jeffrey-epstein-timeline-1235464225/", type: "document", confidence: "primary" },
      { date: "1993", year: 1993, title: "Epstein at Trump's Wedding", desc: "Epstein attended Trump's wedding to Marla Maples at the Plaza Hotel.", source: "Photos, Rolling Stone", url: "https://www.rollingstone.com/politics/politics-features/donald-trump-jeffrey-epstein-timeline-1235464225/", type: "contact", confidence: "corroborated" },
      { date: "Apr 23, 1993", year: 1993, title: "Flight: Only Two Passengers", desc: "Flight log: Trump and Epstein are the only two listed passengers on this flight.", source: "DOJ Files — flight logs, ABC News", url: "https://abcnews.go.com/US/times-trumps-appeared-epstein-files-doj-released/story?id=123848078", type: "travel", confidence: "primary" },
      { date: "Oct 1993", year: 1993, title: "Two More Flights", desc: "Oct 11: Flight with Epstein. Oct 17: Flight with Epstein, Maxwell, and three others from Palm Beach to Teterboro, NJ.", source: "Flight logs, ABC News", url: "https://abcnews.go.com/US/times-trumps-appeared-epstein-files-doj-released/story?id=123848078", type: "travel", confidence: "primary" },
      { date: "Nov 1993", year: 1993, title: "'Calendar Girl' Event at Mar-a-Lago", desc: "George Houraney said he brought 28 'girls' to Mar-a-Lago at Trump's request for a private event exclusively for Trump and Epstein.", source: "Houraney court filing, Wikipedia", url: "https://en.wikipedia.org/wiki/Relationship_of_Donald_Trump_and_Jeffrey_Epstein", type: "contact", confidence: "corroborated" },
      { date: "May 15, 1994", year: 1994, title: "Flight with Family", desc: "Palm Beach to DC to Teterboro with Epstein, Marla Trump, baby Tiffany Trump, and a nanny.", source: "Flight logs, ABC News", url: "https://abcnews.go.com/US/times-trumps-appeared-epstein-files-doj-released/story?id=123848078", type: "travel", confidence: "primary" },
      { date: "~1994", year: 1994, title: "14-Year-Old at Mar-a-Lago (Jane Doe Filing)", desc: "Court filing: A 14-year-old girl said Epstein brought her to Mar-a-Lago and introduced her to Trump. Epstein allegedly said 'This is a good one, right?' Trump smiled and nodded.", source: "DOJ Files — civil complaint, PBS", url: "https://www.pbs.org/newshour/show/what-the-latest-epstein-files-release-reveals-and-where-trump-is-mentioned", type: "allegation", confidence: "primary" },
      { date: "1995", year: 1995, title: "Maria Farmer Encounter", desc: "First person to report Epstein to law enforcement encountered Trump late at night in Epstein's Manhattan office. Epstein warned Trump off, saying 'She's not here for you.' Trump allegedly assumed Farmer was a teenager (she was mid-20s).", source: "Farmer testimony, Wikipedia", url: "https://en.wikipedia.org/wiki/Relationship_of_Donald_Trump_and_Jeffrey_Epstein", type: "document", confidence: "corroborated" },
      { date: "Aug 13, 1995", year: 1995, title: "Flight with Eric Trump & Maxwell", desc: "Palm Beach to Teterboro with Epstein, Maxwell, Eric Trump, and four others.", source: "Flight logs, ABC News", url: "https://abcnews.go.com/US/times-trumps-appeared-epstein-files-doj-released/story?id=123848078", type: "travel", confidence: "primary" },
      { date: "1997", year: 1997, title: "Signed Book to Epstein", desc: "Inscribed a copy of 'The Art of the Comeback' to Epstein: 'You are the greatest!'", source: "Photo of inscription, Rolling Stone", url: "https://www.rollingstone.com/politics/politics-features/donald-trump-jeffrey-epstein-timeline-1235464225/", type: "document", confidence: "primary" },
      { date: "Jan 5, 1997", year: 1997, title: "Flight with Maxwell", desc: "Palm Beach to Newark with Epstein, Maxwell, and five others.", source: "Maxwell trial flight logs", url: "https://lawandcrime.com/live-trials/ghislaine-maxwell/jeffrey-epstein-flight-logs-showing-detailed-passenger-lists-entered-into-evidence-at-ghislaine-maxwell-trial/", type: "travel", confidence: "primary" },
      { date: "2002", year: 2002, title: "'Terrific Guy' Quote", desc: "Told New York Magazine: 'I've known Jeff for fifteen years. Terrific guy. He's a lot of fun to be with. It is even said that he likes beautiful women as much as I do, and many of them are on the younger side.'", source: "New York Magazine, 2002", url: "", type: "document", confidence: "primary" },
      { date: "~2004", year: 2004, title: "Claims Falling Out / Banned from Mar-a-Lago", desc: "Has consistently said he kicked Epstein out of Mar-a-Lago and ended friendship ~two decades ago.", source: "Multiple Trump statements", url: "", type: "claim", confidence: "single-source" },
      { date: "Sep 2009", year: 2009, title: "House Manager: Trump 'Never Stayed'", desc: "Former house manager Juan Alessi testified under oath that Trump 'never' stayed over at Epstein's Palm Beach home and never got a massage there.", source: "DOJ Files — deposition", url: "https://www.justice.gov/epstein", type: "document", confidence: "primary" },
      { date: "Dec 2015", year: 2015, title: "Epstein Email: 'Photos of Donald and Girls'", desc: "Epstein emailed journalist Michael Wolff offering 'photos of donald and girls in bikinis in my kitchen.'", source: "Epstein-Wolff emails, Wikipedia", url: "https://en.wikipedia.org/wiki/Relationship_of_Donald_Trump_and_Jeffrey_Epstein", type: "document", confidence: "primary" },
      { date: "2019", year: 2019, title: "Epstein Email: 'Knew About the Girls'", desc: "Email to Wolff: 'Trump said he asked me to resign, never a member ever. Of course he knew about the girls as he asked ghislaine to stop.'", source: "Epstein email, NBC/Axios", url: "https://en.wikipedia.org/wiki/Relationship_of_Donald_Trump_and_Jeffrey_Epstein", type: "document", confidence: "primary" },
      { date: "Jan 2020", year: 2020, title: "Prosecutor Email: 8 Flights", desc: "Federal prosecutor emailed: flight records show Trump 'traveled on Epstein's private jet many more times than previously reported.' Listed on at least 8 flights 1993-1996, at least 4 with Maxwell present.", source: "DOJ Files — prosecutor email, PBS/NBC", url: "https://www.pbs.org/newshour/nation/latest-epstein-document-release-includes-multiple-trump-mentions", type: "document", confidence: "primary" },
      { date: "2021", year: 2021, title: "Mar-a-Lago Subpoenaed", desc: "Mar-a-Lago was served with a subpoena for employment records as part of Epstein investigation.", source: "DOJ Files — email chain", url: "https://www.cnn.com/2026/01/31/politics/new-documents-trump-epstein", type: "government", confidence: "primary" },
      { date: "Nov 2025", year: 2025, title: "Signed Transparency Act", desc: "Signed the Epstein Files Transparency Act after Congress passed it unanimously (427-1 House, unanimous Senate).", source: "Public law", url: "https://en.wikipedia.org/wiki/Epstein_Files_Transparency_Act", type: "government", confidence: "primary" },
      { date: "Jan 30, 2026", year: 2026, title: "3,000+ Mentions in Final Release", desc: "Name appeared 3,000+ times across 3 million pages. FBI compiled list of unverified sexual assault allegations. DOJ called claims 'unfounded and false.' Also released: Epstein's inner circle diagram with redacted names.", source: "DOJ Files, CNN, Wikipedia", url: "https://www.cnn.com/2026/01/31/politics/new-documents-trump-epstein", type: "document", confidence: "primary" },
      { date: "Jan 31, 2026", year: 2026, title: "Claims Files 'Absolve' Him", desc: "Argued the final release 'absolves' him of any wrongdoing, despite the volume of mentions.", source: "Trump statement", url: "https://en.wikipedia.org/wiki/Epstein_files", type: "claim", confidence: "primary" },
    ]
  },
  "elon-musk": {
    name: "Elon Musk", cat: "Business / Government", role: "CEO Tesla/SpaceX/xAI, formerly Head of DOGE", prev: "CEO Tesla/SpaceX", init: "EM",
    sum: "Emails show correspondence about island visits between 2012–2014, contradicting his public claim of having 'REFUSED' invitations. Epstein's language ('again') implies previous visits. Companies have received $38 billion+ in government funding.",
    resp: "Musk on X: 'I have never been to any Epstein parties ever and have many times called for the prosecution of those who have committed crimes with Epstein.' Later said emails could be 'misinterpreted.'",
    respDate: "Feb 2026",
    tax: [
      { type: "SpaceX — NASA", detail: "Artemis moon lander ($4.4B), ISS cargo ($3B+), ISS deorbit ($843M), satellite launches ($1.4B+)", source: "USASpending.gov, Built In, ABC News", status: "Active — $13B+ from NASA since 2015", amount: "$13B+ (NASA alone)", verified: true },
      { type: "SpaceX — Defense", detail: "NSSL Phase 3 launches ($1.6B), NRO spy satellites ($1.8B classified), Space Force Starshield ($70M+)", source: "SpaceNews, Reuters, WSJ", status: "Active — billions in DoD/intel", amount: "$3.5B+ (Defense/Intel)", verified: true },
      { type: "SpaceX — Total Federal", detail: "Washington Post analysis: $38B total government funding across all Musk companies over 20+ years. $20B+ in SpaceX contracts alone, $9B paid.", source: "Washington Post, Feb 2025", status: "Cumulative", amount: "$38B+ (all companies)", verified: true },
      { type: "Tesla — Credits & Loans", detail: "$465M DOE loan (repaid). $11.4B in EV regulatory credits. $7,500 consumer EV tax credit (recently eliminated).", source: "WaPo, Fox Business", status: "Credits ongoing until eliminated", amount: "$11.4B+ credits", verified: true },
      { type: "xAI — Defense", detail: "DoD contract up to $200M for AI/national security. Grok deployed inside Pentagon network.", source: "DoD announcement, Jul 2025", status: "Active", amount: "$200M", verified: true },
      { type: "Starlink — Rural Broadband", detail: "Commerce Dept made Starlink eligible for $42B rural broadband grant program.", source: "Scripps News", status: "Eligible", amount: "Up to $42B pool", verified: true },
      { type: "DOGE Role", detail: "Advisory role with federal spending authority — potential conflict of interest with own contracts.", source: "Executive Order, multiple outlets", status: "Departed mid-2025", amount: "Oversight role over agencies funding his companies", verified: true },
    ],
    conn: ["donald-trump", "howard-lutnick", "bill-gates", "woody-allen", "peter-thiel"],
    tl: [
      { date: "Nov 2012", year: 2012, title: "Helicopter to the Island", desc: "Epstein emailed Musk asking how many people he'd bring for 'the helicopter ride to the island.'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
      { date: "Nov 2013", year: 2013, title: "Christmas Caribbean with Woody Allen", desc: "Epstein invited Musk to Caribbean for Christmas, writing that Woody Allen was with him and Musk 'might enjoy' the trip.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
      { date: "Sep 2014", year: 2014, title: "Christmas 'Again' in St. Barts", desc: "Epstein asked Musk to join for Christmas 'again' in St. Barts — language implying a previous Christmas visit.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
      { date: "Oct 2014", year: 2014, title: "Island Visit Scheduled — Dec 6", desc: "Assistant's schedule: Musk 'is to go to the island on Dec. 6th.' Follow-up Dec 5: 'is this still happening?'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "visit", confidence: "primary" },
      { date: "2025", year: 2025, title: "Public Denial", desc: "Posted on X: 'Epstein tried to get me to go to his island and I REFUSED.'", source: "X post", url: "", type: "claim", confidence: "primary", contradicted: true },
      { date: "Jun 2025", year: 2025, title: "Claimed Files Withheld Because of Trump", desc: "Musk claimed files weren't released because Trump's name was in documents. DOJ denied this.", source: "Wikipedia, Epstein files article", url: "https://en.wikipedia.org/wiki/Epstein_files", type: "claim", confidence: "primary" },
      { date: "Feb 2026", year: 2026, title: "Post-Release Statement", desc: "Said emails could be 'misinterpreted' and called for prosecution of those who committed crimes.", source: "X post", url: "", type: "claim", confidence: "primary" },
    ]
  },
  "howard-lutnick": {
    name: "Howard Lutnick", cat: "Government / Business", role: "U.S. Commerce Secretary", prev: "CEO, Cantor Fitzgerald", init: "HL",
    sum: "Documents reveal deeper ties than publicly acknowledged, including island visits, business deals, and attempted political introductions — all years after he claimed to have cut contact in 2005.",
    resp: "'Secretary Lutnick had limited interactions with Mr. Epstein in the presence of his wife and has never been accused of wrongdoing.'",
    respDate: "Feb 2026",
    tax: [
      { type: "Government Salary", detail: "Commerce Secretary ($221,400/yr)", source: "OPM Executive Schedule", status: "Active", amount: "$221,400/yr", verified: true },
      { type: "Treasury Primary Dealer", detail: "Cantor Fitzgerald / BGC Partners — primary dealer for U.S. Treasury securities, handling billions in government bond transactions", source: "Federal Reserve, USASpending.gov", status: "Traceable", amount: "Billions in Treasury transactions", verified: true },
    ],
    conn: ["donald-trump", "bill-gates", "elon-musk"],
    tl: [
      { date: "2005", year: 2005, title: "Claims to Have Cut Ties", desc: "Told NY Post he saw Epstein's massage room and vowed to 'never be in the room with that disgusting person ever again.'", source: "New York Post, Oct 2024", url: "https://nypost.com", type: "claim", confidence: "primary", contradicted: true },
      { date: "2011", year: 2011, title: "Phone Calls & Drinks", desc: "Epstein's assistant emailed: 'Howard Lutnick returned your call' and 'will come see you at 5 p.m.' Calendar reads 'Drinks w/Howard Lutnick.'", source: "DOJ Files, Jan 30 2026", url: "https://www.justice.gov/epstein", type: "contact", confidence: "primary" },
      { date: "Nov 2012", year: 2012, title: "Island Visit Coordinated", desc: "Wife Allison coordinated with Epstein's assistant to visit Little Saint James with four children and another family by yacht.", source: "DOJ Files — emails", url: "https://www.justice.gov/epstein", type: "visit", confidence: "primary" },
      { date: "Dec 2012", year: 2012, title: "Lunch on Epstein's Island", desc: "Invited for lunch: 'come sat or sunday lunch? little st james on the map.' Dec 24: 'it was nice seeing you.'", source: "DOJ Files, CNN", url: "https://www.cnn.com/politics/live-news/epstein-files-release-doj-01-30-26", type: "visit", confidence: "primary" },
      { date: "Dec 28, 2012", year: 2012, title: "Business Deal — Adfin Contract", desc: "Both signed contracts for stakes in ad-tech company Adfin. Epstein for Southern Trust Co., Lutnick for CVAFH I LLC. Signatures on neighboring pages.", source: "DOJ Files — contracts, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "financial", confidence: "primary" },
      { date: "2014", year: 2014, title: "Construction Correspondence", desc: "Corresponded with Epstein about construction of a building across the street from both of their homes.", source: "DOJ Files, PBS", url: "https://www.pbs.org/newshour/nation/a-list-of-powerful-men-named-in-the-epstein-files-from-elon-musk-to-former-prince-andrew", type: "contact", confidence: "primary" },
      { date: "2015", year: 2015, title: "Invited Epstein to Clinton Fundraiser", desc: "Attempted to invite Epstein to a political fundraiser for Hillary Clinton.", source: "CNN, Feb 2026", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "corroborated" },
      { date: "Jan 2025", year: 2025, title: "Confirmed as Commerce Secretary", desc: "Confirmed despite emerging file revelations.", source: "Commerce Department", url: "https://www.commerce.gov", type: "government", confidence: "primary" },
    ]
  },
  "bill-gates": {
    name: "Bill Gates", cat: "Business / Philanthropy", role: "Philanthropist", prev: "Co-founder, Microsoft", init: "BG",
    sum: "Extensive documented relationship. Draft messages in Epstein's email reference Gates' personal life. Multiple post-conviction meetings at Epstein's NYC townhouse. Spokesperson called claims 'absurd and completely false.'",
    resp: "'These claims — from a proven, disgruntled liar — are absolutely absurd and completely false.'",
    respDate: "Feb 2026",
    tax: [
      { type: "Microsoft — Federal Cloud", detail: "JEDI/JWCC Pentagon cloud contract ($10B+), federal IT across agencies", source: "USASpending.gov, DoD", status: "Massive — ongoing", amount: "$10B+ (cloud alone)", verified: true },
      { type: "Gates Foundation", detail: "Co-funds programs with USAID, CDC, NIH, WHO. Billions in global health co-funded with taxpayer dollars.", source: "Foundation 990s, USAID", status: "Billions co-funded", amount: "Billions in co-funded programs", verified: true },
    ],
    conn: ["elon-musk", "larry-summers", "howard-lutnick", "woody-allen", "bill-clinton", "richard-branson", "tom-barrack"],
    tl: [
      { date: "2011", year: 2011, title: "Post-Conviction Meetings at Townhouse", desc: "Met Epstein multiple times at his NYC townhouse after 2008 conviction.", source: "Wall Street Journal, 2019", url: "https://www.wsj.com", type: "contact", confidence: "corroborated" },
      { date: "2013", year: 2013, title: "Draft Messages Reference Personal Life", desc: "Stream-of-consciousness drafts in Epstein's email reference Gates' marital discord, business deals, and personal concerns.", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "document", confidence: "primary" },
      { date: "2014", year: 2014, title: "'Intimate' Breakfast at Epstein's", desc: "Epstein invited Josh Harris to 'intimate' breakfast noting 'Bill Gates will be in attendance.'", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "primary" },
      { date: "Mar 2017", year: 2017, title: "Epstein Brokered Gates-Barrack Meeting", desc: "Emailed Gates encouraging meeting with Tom Barrack in DC: 'To increase the likelihood of you getting meaningful traction.'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
    ]
  },
  "bill-clinton": {
    name: "Bill Clinton", cat: "Politician", role: "Former President", prev: "42nd U.S. President", init: "BC",
    sum: "Extensive flight log presence. Photos with Maxwell at multiple events. Epstein invoked Fifth Amendment when asked about Clinton. Refused House Oversight testimony. No victims have accused Clinton of wrongdoing.",
    resp: "'President Clinton knows nothing about the terrible crimes Jeffrey Epstein pleaded guilty to in Florida.'",
    respDate: "2019",
    tax: [
      { type: "Presidential Salary", detail: "President 1993-2001 ($200K/yr)", source: "Public records", status: "Historical", amount: "$1.6M total", verified: true },
      { type: "Former Presidents Act", detail: "Office, staff, travel, Secret Service ($1M+/yr ongoing)", source: "CRS Reports", status: "Ongoing since 2001", amount: "$1M+/yr (24+ years)", verified: true },
      { type: "Clinton Foundation", detail: "USAID, PEPFAR partnerships — billions in co-funded global health", source: "990s, USASpending", status: "Traceable", amount: "Billions co-funded", verified: true },
    ],
    conn: ["bill-gates", "andrew-mw", "kevin-spacey", "chris-tucker", "donald-trump"],
    tl: [
      { date: "Jan 5, 1997", year: 1997, title: "Flight Log Entry", desc: "Passenger from Palm Beach to Newark with Epstein, Maxwell, and others.", source: "Maxwell trial exhibits", url: "https://lawandcrime.com/live-trials/ghislaine-maxwell/jeffrey-epstein-flight-logs-showing-detailed-passenger-lists-entered-into-evidence-at-ghislaine-maxwell-trial/", type: "travel", confidence: "primary" },
      { date: "2002-2003", year: 2002, title: "Four Trips on Epstein's Plane", desc: "Spokesperson confirmed four trips to Europe, Asia, and Africa with staff and Secret Service.", source: "Clinton spokesperson, 2019", url: "", type: "travel", confidence: "corroborated" },
      { date: "Sep 2002", year: 2002, title: "JFK to Azores with Spacey", desc: "Flight with Kevin Spacey from JFK to the Azores.", source: "Maxwell trial flight logs", url: "https://lawandcrime.com/live-trials/ghislaine-maxwell/jeffrey-epstein-flight-logs-showing-detailed-passenger-lists-entered-into-evidence-at-ghislaine-maxwell-trial/", type: "travel", confidence: "primary" },
      { date: "2006", year: 2006, title: "Claims Relationship Ended", desc: "Representatives say Clinton broke off relations after first criminal charges.", source: "Clinton spokesperson", url: "", type: "claim", confidence: "single-source" },
      { date: "Oct 2009", year: 2009, title: "At Maxwell's After-Party with Bezos", desc: "Publicist Peggy Siegal emailed Epstein from Maxwell's house where an after-party was held: 'Bill Clinton and Jeff Bezos were there.'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "document", confidence: "primary" },
      { date: "2010", year: 2010, title: "Maxwell at Chelsea's Wedding", desc: "Despite claimed break, Ghislaine Maxwell attended Chelsea Clinton's wedding.", source: "Multiple media, CBC", url: "", type: "contact", confidence: "corroborated" },
      { date: "2016", year: 2016, title: "Epstein Pleaded the Fifth on Clinton", desc: "In deposition for Giuffre suit, Epstein responded 'fifth' to every question about Clinton.", source: "DOJ Files — deposition, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "document", confidence: "primary" },
      { date: "Dec 2025", year: 2025, title: "Photos Released by DOJ", desc: "Photos released: Clinton with Maxwell at Churchill War Rooms, in a hot tub, with Michael Jackson and Diana Ross.", source: "DOJ Files, Dec 2025", url: "https://www.justice.gov/epstein", type: "document", confidence: "primary" },
      { date: "Feb 2026", year: 2026, title: "Refused House Testimony", desc: "The Clintons refused to testify in House Oversight Committee's Epstein investigation.", source: "AP / PBS", url: "https://www.pbs.org/newshour/nation/the-latest-epstein-files-release-includes-famous-names-and-new-details-about-an-earlier-investigation", type: "government", confidence: "primary" },
    ]
  },
  "john-phelan": {
    name: "John Phelan", cat: "Government / Business", role: "U.S. Navy Secretary", prev: "Founder, Rugger Management LLC", init: "JP",
    sum: "Flight manifest shows he flew on Epstein's Boeing 727 from New York to London and back in Feb-Mar 2006. A friend says he was invited by Bear Stearns CEO Jimmy Cayne and didn't know it was Epstein's plane until arrival. Now oversees the entire U.S. Navy.",
    resp: "Declined to comment through Navy spokesperson. A friend said it was the only time Phelan interacted with Epstein and that he had no interest in Epstein's tax pitch during the flight.",
    respDate: "Feb 2026",
    tax: [
      { type: "Navy Secretary Salary", detail: "Secretary of the Navy (~$203K/yr)", source: "OPM Executive Schedule", status: "Active", amount: "$203,500/yr", verified: true },
      { type: "Navy Budget Authority", detail: "Oversees U.S. Navy and Marine Corps — $255.8B FY2025 budget", source: "DoD Budget", status: "Active — oversight", amount: "$255.8B oversight", verified: true },
      { type: "Palantir Partnership", detail: "Phelan and Palantir CEO Karp jointly unveiled Navy 'ShipOS' in Dec 2025", source: "DefenseScoop", status: "Active", amount: "Part of $10B Palantir EA", verified: true },
    ],
    conn: ["donald-trump"],
    tl: [
      { date: "Feb 27, 2006", year: 2006, title: "Flight NY to London on Epstein's 727", desc: "Manifest shows Phelan as passenger on Epstein's Boeing 727 from New York to London. 12 other passengers including Epstein and Jean-Luc Brunel.", source: "DOJ Files — flight manifest, CNN", url: "https://www.cnn.com/2026/02/06/politics/phelan-epstein-flight", type: "travel", confidence: "primary" },
      { date: "Mar 3, 2006", year: 2006, title: "Return Flight London to NY", desc: "Flew back from London to New York on the same aircraft. Six names on the list were redacted by DOJ.", source: "DOJ Files, Washington Post", url: "https://www.washingtonpost.com/national-security/2026/02/06/john-phelan-epstein-files/", type: "travel", confidence: "primary" },
      { date: "Mar 2025", year: 2025, title: "Confirmed as Navy Secretary", desc: "Confirmed by Senate. No prior military service. Previously worked in private investment management.", source: "Senate confirmation", url: "", type: "government", confidence: "primary" },
      { date: "Dec 2025", year: 2025, title: "Unveiled ShipOS with Palantir", desc: "Jointly unveiled Navy's new 'ShipOS' platform with Palantir CEO Alex Karp.", source: "DefenseScoop", url: "https://defensescoop.com", type: "government", confidence: "primary" },
    ]
  },
  "richard-branson": {
    name: "Richard Branson", cat: "Business", role: "Founder, Virgin Group", prev: "Founder, Virgin Group", init: "RB",
    sum: "Known Epstein acquaintance. 2013 email: invited Epstein to his Caribbean island 'as long as you bring your harem!' Suggested Epstein rehabilitate image by having Bill Gates vouch for him.",
    resp: "Virgin Group: Dealings were 'limited to group or business settings' over a decade ago. Branson 'declined a charitable donation and decided not to meet or speak with him again' after uncovering allegations.",
    respDate: "Feb 2026",
    tax: [
      { type: "Virgin Orbit", detail: "LauncherOne — NASA/DoD small satellite launch contracts", source: "NASA, USASpending", status: "Company bankrupt 2023", amount: "Tens of millions (historical)", verified: true },
    ],
    conn: ["bill-gates", "bill-clinton"],
    tl: [
      { date: "2013", year: 2013, title: "'Bring Your Harem'", desc: "Invited Epstein to his Caribbean island: 'Any time you're in the area would love to see you, as long as you bring your harem!' Virgin says this repeated a term Epstein used for three adult women on his team.", source: "DOJ Files, CNN/PBS", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "primary" },
      { date: "2013", year: 2013, title: "Advised Image Rehabilitation via Gates", desc: "Suggested Epstein get Bill Gates to tell the public Epstein had 'been a brilliant adviser' and had 'more than learnt your lesson.'", source: "DOJ Files, PBS", url: "https://www.pbs.org/newshour/nation/a-list-of-powerful-men-named-in-the-epstein-files-from-elon-musk-to-former-prince-andrew", type: "contact", confidence: "primary" },
      { date: "Dec 2025", year: 2025, title: "Photos Released", desc: "Photo released by House Oversight Committee showing Branson with Epstein and Segway inventor Dean Kamen.", source: "House Oversight, Dec 12 2025", url: "", type: "document", confidence: "primary" },
    ]
  },
  "steven-tisch": {
    name: "Steven Tisch", cat: "Business / Entertainment", role: "Co-owner, NY Giants", prev: "Film producer, Giants co-owner", init: "ST",
    sum: "New name in the documents. Emailed Epstein asking if a woman he met at Epstein's house was a 'professional or civilian.' Epstein later offered him a 'present' — described as 'tahitian speaks mostly french, exotic.'",
    resp: "No public comment.",
    respDate: "N/A",
    tax: [
      { type: "Stadium Subsidies", detail: "MetLife Stadium — public infrastructure/tax subsidies for NFL stadiums vary by deal", source: "Subsidy Tracker", status: "Traceable", amount: "TBD", verified: false },
    ],
    conn: [],
    tl: [
      { date: "Undated", year: 2012, title: "Emailed Epstein About Woman", desc: "Asked Epstein whether a woman he met at Epstein's house was a 'professional or a civilian.'", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "primary" },
      { date: "Undated", year: 2012, title: "Epstein Offered Him a 'Present'", desc: "Epstein said he would have a 'present' for Tisch. Days later described a woman: 'tahitian speaks mostly french, exotic.'", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "primary" },
    ]
  },
  "alexander-acosta": {
    name: "Alexander Acosta", cat: "Government", role: "Former Secretary of Labor", prev: "U.S. Attorney, Southern Florida", init: "AA",
    sum: "As U.S. Attorney in Miami, signed off on the controversial 2008 plea deal that let Epstein avoid federal prosecution. Became Trump's first Labor Secretary. Resigned in 2019 amid renewed scrutiny.",
    resp: "In 2019, said he acted 'within the rules' and that the deal was the best outcome given the evidence at the time.",
    respDate: "2019",
    tax: [
      { type: "Government Salary", detail: "U.S. Attorney ($153K), then Secretary of Labor ($199K)", source: "OPM records", status: "Historical", amount: "~$350K+ over tenure", verified: true },
      { type: "Labor Department", detail: "Oversaw Dept of Labor ($12.1B budget) during tenure 2017-2019", source: "DOL", status: "Historical", amount: "$12.1B oversight", verified: true },
    ],
    conn: ["donald-trump"],
    tl: [
      { date: "2007-2008", year: 2007, title: "Signed Epstein's Plea Deal", desc: "As U.S. Attorney for Southern Florida, signed off on deal letting Epstein plead to state charges and avoid federal prosecution. Survivors were not notified as required by law.", source: "DOJ investigation, court records", url: "", type: "government", confidence: "primary" },
      { date: "2017", year: 2017, title: "Appointed Secretary of Labor", desc: "Trump nominated Acosta as Secretary of Labor despite his role in the Epstein plea deal.", source: "White House", url: "", type: "government", confidence: "primary" },
      { date: "Jul 2019", year: 2019, title: "Resigned Under Pressure", desc: "Resigned after renewed scrutiny of the plea deal following Epstein's 2019 arrest.", source: "Multiple outlets", url: "", type: "consequence", confidence: "primary" },
      { date: "Jan 30, 2026", year: 2026, title: "Named in Latest Release", desc: "Documents reference Acosta's role in the original plea deal and the FBI's frustration with the outcome.", source: "DOJ Files, NBC", url: "https://www.nbcnews.com/politics/justice-department/live-blog/epstein-files-trump-doj-release-live-updates-rcna256639", type: "document", confidence: "primary" },
    ]
  },
  "andrew-mw": {
    name: "Andrew Mountbatten-Windsor", cat: "Royalty", role: "Stripped of all royal titles", prev: "Duke of York, Prince", init: "AM",
    sum: "Hundreds of mentions. Compromising photos released showing him over an unidentified person. Accused by Virginia Giuffre. Email as 'The Invisible Man' asking Maxwell for 'new inappropriate friends.' Stripped of titles by King Charles. Ignoring House Oversight request.",
    resp: "Has repeatedly denied all allegations. Has not responded to House Oversight interview request. PM Starmer said he should cooperate.",
    respDate: "Ongoing",
    tax: [
      { type: "UK Royal Allowance", detail: "Previously received Sovereign Grant funds (UK public money)", source: "UK Crown records", status: "Stripped/revoked", amount: "Revoked", verified: true },
    ],
    conn: ["bill-clinton", "bill-gates", "sarah-ferguson"],
    tl: [
      { date: "2000s", year: 2000, title: "Friendship Established", desc: "Developed close friendship, visiting properties in NY, Palm Beach, and USVI.", source: "Court filings, media", url: "", type: "contact", confidence: "corroborated" },
      { date: "Aug 2001", year: 2001, title: "Email as 'The Invisible Man'", desc: "Emailed Maxwell from 'Balmoral Summer Camp for the Royal Family' asking: 'Have you found me some new inappropriate friends?' Referenced leaving the Royal Navy and caring for 'the Girls' (his daughters).", source: "DOJ Files, PBS/Fortune", url: "https://fortune.com/2025/12/23/trump-epstein-files-distraction-flight-logs-unfounded-and-false-claims/", type: "document", confidence: "primary" },
      { date: "Post-2008", year: 2009, title: "Continued After Conviction", desc: "Maintained friendship and visited Epstein in New York after prison release.", source: "Court documents", url: "", type: "contact", confidence: "corroborated" },
      { date: "2010", year: 2010, title: "Epstein Set Up Date", desc: "Epstein wrote: 'I have a friend who I think you might enjoy having dinner with.'", source: "DOJ Files, PBS", url: "https://www.pbs.org/newshour/nation/the-latest-epstein-files-release-includes-famous-names-and-new-details-about-an-earlier-investigation", type: "contact", confidence: "primary" },
      { date: "2015", year: 2015, title: "Giuffre Accusations", desc: "Virginia Giuffre alleged Epstein instructed her to have sex with Andrew when she was 17.", source: "Maxwell civil case", url: "", type: "allegation", confidence: "primary" },
      { date: "Jan 30, 2026", year: 2026, title: "Compromising Photos Released", desc: "DOJ released photos showing Andrew on all fours over unidentified person. Buckingham Palace dinner invitation for Epstein also released.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "document", confidence: "primary" },
      { date: "Oct 2025", year: 2025, title: "Stripped of All Royal Titles", desc: "King Charles stripped all titles including right to be called prince.", source: "UK media", url: "", type: "consequence", confidence: "corroborated" },
      { date: "Feb 2026", year: 2026, title: "PM Calls for Cooperation", desc: "PM Starmer: Andrew should 'tell US investigators what he knows.' Has not responded to House Oversight interview request.", source: "BBC, PBS", url: "https://www.pbs.org/newshour/nation/a-list-of-powerful-men-named-in-the-epstein-files-from-elon-musk-to-former-prince-andrew", type: "government", confidence: "primary" },
    ]
  },
  "peter-thiel": {
    name: "Peter Thiel", cat: "Business / Tech", role: "Investor, Palantir Chairman", prev: "Co-founder PayPal/Palantir", init: "PT",
    sum: "Introduced to Tom Barrack by Epstein in 2016 email. Initially replied 'Who is that?' Palantir holds $10B+ Army contract and billions more in defense/intel work.",
    resp: "No public comment.",
    respDate: "N/A",
    tax: [
      { type: "Palantir — Army", detail: "Enterprise Agreement up to $10B over 10 years, consolidating 75 contracts", source: "U.S. Army, Breaking Defense, Aug 2025", status: "Active — largest known contract", amount: "$10B cap (10 yr)", verified: true },
      { type: "Palantir — Maven", detail: "Project Maven AI for DoD — $480M initial + $795M increase = $1.3B+", source: "DefenseScoop, May 2025", status: "Active", amount: "$1.3B+", verified: true },
      { type: "Palantir — ICE", detail: "ICE contracts for Gotham/Falcon surveillance platform — $248M+", source: "USASpending.gov, Statista", status: "Active through 2025+", amount: "$248M+", verified: true },
      { type: "Palantir — Total Federal", detail: "Army, DoD, CIA, ICE, IRS, NHS — expanding across all agencies", source: "Multiple sources", status: "Rapidly growing", amount: "$12B+ in known contracts", verified: true },
    ],
    conn: ["tom-barrack", "elon-musk", "donald-trump", "john-phelan"],
    tl: [
      { date: "Jul 2016", year: 2016, title: "Introduced by Epstein", desc: "Epstein introduced Thiel to Tom Barrack via email. Thiel responded: 'Who is that?'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
      { date: "Aug 2016", year: 2016, title: "Follow-up from Epstein", desc: "Epstein: 'Tom Barrack really liked you, he told me the conversation in the green room.'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
    ]
  },
  "larry-summers": {
    name: "Larry Summers", cat: "Government / Academic", role: "Economist (resigned boards)", prev: "Treasury Secretary, Harvard President", init: "LS",
    sum: "Named executor in Epstein's will. Maintained friendship post-conviction. Gossiped about Trump. Left OpenAI board and Harvard after releases. Called it a 'major error of judgment.'",
    resp: "'I am deeply ashamed and take full responsibility for my misguided decision to continue communicating with Mr. Epstein.'",
    respDate: "2025",
    tax: [
      { type: "Government Salary", detail: "Treasury Secretary (1999-2001), NEC Director (2009-10)", source: "Treasury records", status: "Historical", amount: "~$400K total", verified: true },
      { type: "Harvard Grants (Institutional)", detail: "Harvard receives ~$700M/yr in NIH grants alone, plus NSF, DoD, DoE", source: "NIH Reporter", status: "Institutional", amount: "$700M+/yr to Harvard", verified: true },
    ],
    conn: ["bill-clinton", "bill-gates", "woody-allen"],
    tl: [
      { date: "1998+", year: 1998, title: "Flights on Epstein's Jet", desc: "Logged flights beginning 1998.", source: "Flight logs, media", url: "", type: "travel", confidence: "corroborated" },
      { date: "Post-2008", year: 2009, title: "Continued Post-Conviction", desc: "Maintained friendship after 2008 conviction, meeting frequently.", source: "House Oversight files", url: "", type: "contact", confidence: "primary" },
      { date: "2017", year: 2017, title: "Gossiped About Trump with Epstein", desc: "Emails show Summers and Epstein gossiping about and insulting Trump's intelligence.", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "document", confidence: "primary" },
      { date: "2019", year: 2019, title: "'Awfully Coy U Are'", desc: "After Epstein was charged with sexual abuse of minors, emailed Epstein about his interactions with a woman: 'awfully coy u are.' Epstein replied: 'you reacted well.'", source: "DOJ Files, NBC LA", url: "https://www.nbclosangeles.com/news/local/power-people-named-epstein-files/3839884/", type: "document", confidence: "primary" },
      { date: "Undated", year: 2010, title: "Named as Estate Executor", desc: "Named executor in early Epstein will. Said he had 'absolutely no knowledge.'", source: "Estate docs, CNN", url: "", type: "financial", confidence: "primary" },
      { date: "Post-Release", year: 2026, title: "Resignations & Shame", desc: "Left OpenAI board, stopped teaching at Harvard. Said he is 'deeply ashamed.'", source: "Summers spokesperson, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "consequence", confidence: "corroborated" },
    ]
  },
  "mehmet-oz": {
    name: "Dr. Mehmet Oz", cat: "Government / Media", role: "CMS Administrator (HHS)", prev: "TV personality, surgeon", init: "MO",
    sum: "Epstein paid for Oz's travel in 2004. Redacted 2016 email to Epstein. Now heads CMS with authority over $1.5 trillion in annual Medicare/Medicaid spending.",
    resp: "No public comment. CMS did not respond to media requests.",
    respDate: "N/A",
    tax: [
      { type: "CMS Administrator", detail: "Salary ~$185K/yr. Oversees ~$1.5 trillion in annual Medicare/Medicaid spending.", source: "OPM, CMS.gov", status: "Active", amount: "$1.5T oversight", verified: true },
    ],
    conn: ["donald-trump"],
    tl: [
      { date: "2004", year: 2004, title: "Epstein Paid for Travel", desc: "$1,592 billed to Shoppers Travel for Dr. Oz's travel, paid by Epstein.", source: "DOJ Files — transaction report, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "financial", confidence: "primary" },
      { date: "2014", year: 2014, title: "Event Invitation", desc: "Epstein invited to event where Oz was guest speaker. Epstein said unavailable.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
      { date: "2016", year: 2016, title: "Redacted Email to Epstein", desc: "Oz sent email to Epstein — contents fully redacted.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
      { date: "2025", year: 2025, title: "Appointed CMS Administrator", desc: "Now oversees $1.5 trillion in annual federal healthcare spending.", source: "HHS", url: "", type: "government", confidence: "primary" },
    ]
  },
  "peter-mandelson": {
    name: "Peter Mandelson", cat: "Foreign Gov't (UK)", role: "Resigned from House of Lords", prev: "UK Ambassador to US, Cabinet Minister", init: "PM",
    sum: "Thousands of email references. Allegedly shared classified UK government info with Epstein while in PM Brown's cabinet, including the PM's pseudonym. Resigned from Labour and Lords. Met Police criminal investigation opened.",
    resp: "Apologized to victims. Denied impropriety. Resigned from Labour to avoid 'further embarrassment.'",
    respDate: "Feb 2026",
    tax: [
      { type: "UK Government", detail: "Ambassador, Cabinet Minister, Lord — UK public funds", source: "UK Parliament records", status: "Resigned", amount: "UK public funds", verified: true },
    ],
    conn: ["andrew-mw"],
    tl: [
      { date: "2008-2009", year: 2008, title: "Shared UK Govt Information", desc: "Emails suggest Mandelson shared market-sensitive UK government info with Epstein while serving in PM Brown's cabinet. One email appeared to reveal PM Brown's pseudonym.", source: "DOJ Files, Wikipedia", url: "https://en.wikipedia.org/wiki/Epstein_files", type: "document", confidence: "primary" },
      { date: "Feb 1, 2026", year: 2026, title: "Resigned from Labour", desc: "Resigned Labour membership to avoid causing 'further embarrassment.'", source: "UK media", url: "", type: "consequence", confidence: "corroborated" },
      { date: "Feb 3, 2026", year: 2026, title: "Resigned from House of Lords", desc: "Announced resignation effective next day.", source: "UK Parliament", url: "", type: "consequence", confidence: "primary" },
      { date: "Feb 3, 2026", year: 2026, title: "Met Police Criminal Investigation", desc: "Metropolitan Police announced formal criminal investigation.", source: "Met Police, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "government", confidence: "primary" },
      { date: "Feb 4, 2026", year: 2026, title: "PM Starmer: 'Betrayed Our Country'", desc: "Told Parliament: 'Mandelson betrayed our country, our parliament, and my party.'", source: "UK Parliament, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "government", confidence: "primary" },
    ]
  },
  "steve-bannon": {
    name: "Steve Bannon", cat: "Government / Media", role: "Political strategist", prev: "White House Chief Strategist", init: "SB",
    sum: "Hundreds of texts. Two-hour video interview. Discussed documentary to rehabilitate Epstein's image. Texts show Bannon mocking Trump as 'Stable Genius bringing himself down.'",
    resp: "No public response to file releases.",
    respDate: "N/A",
    tax: [
      { type: "Government Salary", detail: "White House Chief Strategist 2017 (~$179K)", source: "WH records", status: "Historical", amount: "~$179K", verified: true },
    ],
    conn: ["donald-trump"],
    tl: [
      { date: "Pre-2019", year: 2018, title: "Hundreds of Texts", desc: "Exchanged hundreds of friendly texts about politics, travel, and a documentary.", source: "DOJ Files, PBS", url: "https://www.pbs.org/newshour/nation/a-list-of-powerful-men-named-in-the-epstein-files-from-elon-musk-to-former-prince-andrew", type: "contact", confidence: "primary" },
      { date: "Pre-2019", year: 2018, title: "Mocked Trump in Texts", desc: "Called Trump 'Stable Genius bringing himself down.' Wrote 'Brother is out of gas' about Trump's schedule.", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "document", confidence: "primary" },
      { date: "Pre-2019", year: 2018, title: "Two-Hour Video & Documentary Plans", desc: "Nearly two hours of video showing Bannon interviewing Epstein. Discussed documentary to rehabilitate Epstein's reputation.", source: "DOJ Files, CNN/PBS", url: "https://www.pbs.org/newshour/nation/a-list-of-powerful-men-named-in-the-epstein-files-from-elon-musk-to-former-prince-andrew", type: "document", confidence: "primary" },
    ]
  },
  "sergey-brin": {
    name: "Sergey Brin", cat: "Business / Tech", role: "Google co-founder", prev: "Google co-founder", init: "SBr",
    sum: "2003 emails show dinner plans with Maxwell at Epstein's townhouse. Offered to bring Google CEO Eric Schmidt.",
    resp: "No public response. Google did not respond to media requests.",
    respDate: "N/A",
    tax: [
      { type: "Google/Alphabet — Federal", detail: "DoD cloud, intelligence, federal IT contracts — billions", source: "USASpending.gov", status: "Massive", amount: "Billions", verified: true },
    ],
    conn: ["bill-gates"],
    tl: [
      { date: "2003", year: 2003, title: "Dinner at Epstein's with Maxwell", desc: "Maxwell invited Brin to 'happily casual and relaxed' dinner at Epstein's house. Brin offered to bring Google CEO Eric Schmidt. Also invited to screening of 'Down with Love.'", source: "DOJ Files, CNN/NBC", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "primary" },
    ]
  },
  "woody-allen": { name: "Woody Allen", cat: "Entertainment", role: "Film director", prev: "Film director", init: "WA", sum: "Longtime friendship. Epstein facilitated White House tour for Allen through former Obama counsel Kathy Ruemmler.", resp: "No public comment.", respDate: "N/A", tax: [], conn: ["bill-gates", "larry-summers", "elon-musk"], tl: [
    { date: "2013", year: 2013, title: "Caribbean with Musk", desc: "Epstein invited Musk noting Woody Allen was with him.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
    { date: "2015", year: 2015, title: "White House Tour via Epstein", desc: "Epstein asked Kathy Ruemmler: 'Could you show soon yi the White House. I assume woody would be too politically sensitive?' She said she could show both.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
  ]},
  "sarah-ferguson": { name: "Sarah Ferguson", cat: "Royalty", role: "Former Duchess of York", prev: "Duchess of York", init: "SF", sum: "Called Epstein 'the brother I always wished for.' Received £15K loan. Sought his advice for Oprah appearance after pledging to cut ties.", resp: "Said she would have 'nothing ever to do with Jeffrey Epstein ever again.'", respDate: "2011", tax: [], conn: ["andrew-mw"], tl: [
    { date: "2009", year: 2009, title: "'Brother I Always Wished For'", desc: "While Epstein was under house arrest, called him 'the brother I have always wished for' and 'spectacular friend.'", source: "DOJ Files, WION", url: "", type: "document", confidence: "primary" },
    { date: "2011", year: 2011, title: "Public Pledge to Cut Ties", desc: "Told media she would have 'nothing ever to do with Epstein ever again.'", source: "Evening Standard", url: "", type: "claim", confidence: "corroborated" },
    { date: "May 2011", year: 2011, title: "Sought Epstein's Advice Anyway", desc: "Two months after pledge, emailed Epstein about Oprah appearance wanting advice on answering Epstein questions.", source: "DOJ Files, PBS", url: "https://www.pbs.org/newshour/nation/a-list-of-powerful-men-named-in-the-epstein-files-from-elon-musk-to-former-prince-andrew", type: "contact", confidence: "primary", contradicted: true },
  ]},
  "kevin-spacey": { name: "Kevin Spacey", cat: "Entertainment", role: "Actor", prev: "Actor", init: "KS", sum: "Photographed with Maxwell and Clinton. In flight logs. Called for full file release.", resp: "'Release the Epstein files. All of them. For those of us with nothing to fear, the truth can't come soon enough.'", respDate: "2025", tax: [], conn: ["bill-clinton"], tl: [
    { date: "Sep 2002", year: 2002, title: "Flight JFK to Azores", desc: "Passenger with Clinton from JFK to Azores.", source: "Maxwell trial flight logs", url: "https://lawandcrime.com/live-trials/ghislaine-maxwell/jeffrey-epstein-flight-logs-showing-detailed-passenger-lists-entered-into-evidence-at-ghislaine-maxwell-trial/", type: "travel", confidence: "primary" },
    { date: "Dec 2025", year: 2025, title: "Photographed in Files", desc: "Seen with Maxwell, Clinton, and others in DOJ-released photos.", source: "DOJ Files", url: "https://www.justice.gov/epstein", type: "document", confidence: "primary" },
  ]},
  "tom-barrack": { name: "Tom Barrack", cat: "Government / Business", role: "U.S. Ambassador to Turkey", prev: "Colony Capital founder", init: "TB", sum: "Communicated with Epstein through 2017. Epstein introduced him to Thiel and brokered Gates meetings. Texted about meeting Epstein's 'Saudi friend.'", resp: "No public comment.", respDate: "N/A", tax: [
    { type: "Ambassador Salary", detail: "Ambassador to Turkey (~$190K/yr)", source: "State Dept", status: "Active", amount: "$190K/yr", verified: true },
  ], conn: ["donald-trump", "peter-thiel", "bill-gates"], tl: [
    { date: "Aug 2016", year: 2016, title: "Introduced to Thiel by Epstein", desc: "Epstein introduced Barrack to Thiel. Called him 'solid, great real estate judgement.'", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
    { date: "Aug 2016", year: 2016, title: "Met 'Saudi Friend'", desc: "Texted Epstein he met his 'Saudi friend.' Added: 'He loves u!!' Epstein asked him to download Signal.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
    { date: "Mar 2017", year: 2017, title: "Gates Meeting Brokered", desc: "Epstein emailed Gates encouraging meeting with Barrack in D.C.", source: "DOJ Files, CBS", url: "https://www.cbsnews.com/live-updates/epstein-files-released-doj-2026/", type: "contact", confidence: "primary" },
  ]},
  "ehud-barak": { name: "Ehud Barak", cat: "Foreign Gov't (Israel)", role: "Former PM of Israel", prev: "Prime Minister", init: "EB", sum: "Frequent in files. Stayed at Epstein's NYC apartment multiple times with wife, post-conviction. Aug 2016: Epstein texted he was 'at house tomorrow.'", resp: "Admitted meeting Epstein for business. Denied illicit participation.", respDate: "Ongoing", tax: [
    { type: "Israeli Government", detail: "Former PM salary (Israeli public funds)", source: "Israeli records", status: "Historical", amount: "Israeli public funds", verified: true },
  ], conn: ["tom-barrack"], tl: [
    { date: "2003+", year: 2003, title: "Met Epstein", desc: "Said he first met the financier in 2003.", source: "Barak statements", url: "", type: "contact", confidence: "corroborated" },
    { date: "Post-2008", year: 2009, title: "Stayed at Epstein's Apartment", desc: "Barak and wife stayed at Epstein's NYC apartment multiple times after conviction.", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/01/31/politics/jeffrey-epstein-files-release-doj", type: "visit", confidence: "primary" },
    { date: "May 2017", year: 2017, title: "Wife Emailed from Epstein's", desc: "Wife Nili Priel emailed Epstein from his apartment about leaving for Harvard, asking if a cleaner could come.", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/01/31/politics/jeffrey-epstein-files-release-doj", type: "contact", confidence: "primary" },
  ]},
  "chris-tucker": { name: "Chris Tucker", cat: "Entertainment", role: "Actor/comedian", prev: "Actor/comedian", init: "CT", sum: "Photographed with Maxwell on airport runway.", resp: "No public comment.", respDate: "N/A", tax: [], conn: ["bill-clinton"], tl: [
    { date: "Dec 2025", year: 2025, title: "Photos Released", desc: "Photographed with Maxwell on airport runway in DOJ files.", source: "DOJ Files", url: "https://www.justice.gov/epstein", type: "document", confidence: "primary" },
  ]},
  "leslie-wexner": {
    name: "Leslie Wexner", cat: "Business", role: "Former CEO L Brands / Victoria's Secret", prev: "Billionaire retail magnate", init: "LW",
    sum: "Named in FBI email among '10 co-conspirators.' Gave Epstein unlimited power of attorney over his fortune. Epstein posed as Victoria's Secret recruiter to lure victims. Epstein's NYC mansion, jet, and lifestyle all flowed from Wexner. Subpoenaed by Congress Feb 2026.",
    resp: "'Being taken advantage of by someone who was so sick, so cunning, so depraved is something that I am embarrassed that I was even close to.'",
    respDate: "2019",
    tax: [
      { type: "L Brands Federal Contracts", detail: "Limited direct federal contracts. Indirect: Victoria's Secret models used military charity events. Massive political donations.", source: "FEC, USASpending", status: "Traceable", amount: "Political influence", verified: true },
      { type: "Ohio State University", detail: "Gave $200M+ to OSU. Chairs Wexner Medical Center Board of Trustees. University receives massive federal research funding.", source: "OSU records, NIH", status: "Institutional influence", amount: "$200M+ donated to OSU", verified: true },
    ],
    conn: ["bill-gates", "donald-trump", "ghislaine-maxwell"],
    tl: [
      { date: "Late 1980s", year: 1988, title: "Hired Epstein as Money Manager", desc: "Despite advisor warning 'I smell a rat,' Wexner hired Epstein. Epstein became his sole financial manager and only known billion-dollar client.", source: "NYT Magazine, Dec 2025", url: "https://www.nytimes.com", type: "financial", confidence: "corroborated" },
      { date: "Jul 1991", year: 1991, title: "Unlimited Power of Attorney", desc: "Granted Epstein full power of attorney: could hire, fire, sign checks, buy/sell properties, borrow money in Wexner's name.", source: "Court documents, CNN", url: "https://www.cnn.com/2019/07/26/business/jeffrey-epstein-les-wexner-business-relationship", type: "financial", confidence: "primary" },
      { date: "1989-1998", year: 1989, title: "NYC Mansion Transfer", desc: "Wexner bought 9 East 71st Street for $13.2M. Transferred to Epstein-controlled entity by 1998. One of NYC's largest private residences.", source: "Property records, ABC News", url: "https://abcnews.go.com/US/billionaire-businessman-leslie-wexner-refuses-reveal-full-scope/story?id=68461262", type: "financial", confidence: "primary" },
      { date: "~1993", year: 1993, title: "VS Recruiter Scheme Reported", desc: "Executive reported Epstein posing as Victoria's Secret recruiter. Wexner said he would 'put a stop to it.' Epstein did not stop — used VS cover to lure victims for years.", source: "Hulu docuseries, Hyperallergic", url: "https://hyperallergic.com/docuseries-explores-the-sick-and-twisted-relationship-between-leslie-wexner-and-jeffrey-epstein/", type: "allegation", confidence: "corroborated" },
      { date: "1991-2006", year: 1995, title: "Oversaw $1.3B in Stock Sales", desc: "Epstein oversaw sale of $1.3B in L Brands stock through trusts he controlled as trustee, creating massive cash pools.", source: "Volscho & Boyd research, ABC News", url: "https://abcnews.go.com/US/billionaire-businessman-leslie-wexner-refuses-reveal-full-scope/story?id=68461262", type: "financial", confidence: "corroborated" },
      { date: "2007", year: 2007, title: "Severed Ties", desc: "Cut relationship after Florida indictment. Accused Epstein of misappropriating $46M (recovered). Never sued Epstein.", source: "Wexner Foundation letter", url: "", type: "claim", confidence: "primary" },
      { date: "Jul 2019", year: 2019, title: "Named Among '10 Co-Conspirators'", desc: "FBI email listed Wexner among 10 co-conspirators. Described as 'wealthy businessman in Ohio' who hadn't been served subpoena. Never charged.", source: "DOJ Files, WOSU/Mediaite", url: "https://www.wosu.org/politics-government/2025-12-23/wexner-named-in-released-epstein-email-about-co-conspirators-in-sex-trafficking-case", type: "government", confidence: "primary" },
      { date: "Jan 2026", year: 2026, title: "Subpoenaed by Congress", desc: "House Oversight Committee subpoenaed Wexner to sit for deposition. Scheduled to testify Feb 18, 2026.", source: "Wikipedia, Puck", url: "https://en.wikipedia.org/wiki/Les_Wexner", type: "government", confidence: "primary" },
    ]
  },
  "ghislaine-maxwell": {
    name: "Ghislaine Maxwell", cat: "Convicted / Inner Circle", role: "Convicted sex trafficker (serving 20 years)", prev: "Socialite, Epstein's partner", init: "GM",
    sum: "The ONLY person convicted. Found guilty Dec 2021 on 5 of 6 counts: conspiracy, sex trafficking of a minor, transporting a minor with intent to engage in criminal sexual activity. Sentenced to 20 years. Currently in minimum-security facility. The files reveal her as the operational center of Epstein's network.",
    resp: "Through attorneys: maintains innocence and is appealing conviction.",
    respDate: "Ongoing",
    tax: [],
    conn: ["donald-trump", "bill-clinton", "andrew-mw", "bill-gates", "leslie-wexner", "sergey-brin"],
    tl: [
      { date: "Early 1990s", year: 1991, title: "Partnership with Epstein", desc: "Became Epstein's social and operational partner. Used her family connections (father was media mogul Robert Maxwell) to open doors to elite circles.", source: "Trial evidence, media", url: "", type: "contact", confidence: "corroborated" },
      { date: "1994-2004", year: 1997, title: "Recruiting & Grooming", desc: "Recruited and groomed victims for Epstein, including Virginia Giuffre at Mar-a-Lago when Giuffre was 16.", source: "Trial testimony", url: "", type: "allegation", confidence: "primary" },
      { date: "Aug 2001", year: 2001, title: "'The Invisible Man' Emails", desc: "Exchanged emails with person signing as 'A' (believed to be Andrew) from Balmoral asking for 'new inappropriate friends.'", source: "DOJ Files, PBS/Fortune", url: "https://fortune.com/2025/12/23/trump-epstein-files-distraction-flight-logs-unfounded-and-false-claims/", type: "document", confidence: "primary" },
      { date: "Jul 2, 2020", year: 2020, title: "Arrested by FBI", desc: "Arrested at New Hampshire property. Charged with conspiracy, sex trafficking of a minor.", source: "DOJ prosecution", url: "", type: "government", confidence: "primary" },
      { date: "Dec 29, 2021", year: 2021, title: "Found Guilty", desc: "Convicted on 5 of 6 federal counts.", source: "SDNY trial verdict", url: "", type: "government", confidence: "primary" },
      { date: "Jun 2022", year: 2022, title: "Sentenced to 20 Years", desc: "Sentenced to 20 years in federal prison by Judge Alison Nathan.", source: "Court records", url: "", type: "government", confidence: "primary" },
      { date: "Summer 2025", year: 2025, title: "Moved to Minimum Security", desc: "Transferred to minimum-security federal facility.", source: "Multiple outlets", url: "", type: "government", confidence: "corroborated" },
      { date: "Jul 2025", year: 2025, title: "Subpoenaed by House Oversight", desc: "House Oversight Committee issued subpoena for testimony.", source: "House Oversight", url: "", type: "government", confidence: "primary" },
    ]
  },
  "leon-black": {
    name: "Leon Black", cat: "Business / Finance", role: "Former CEO Apollo Global Management", prev: "Co-founder Apollo Global", init: "LB",
    sum: "Paid Epstein $158 million from 2012-2017 — post-conviction — for 'tax and estate planning.' Stepped down as Apollo CEO in 2021 after review confirmed payments. No wrongdoing found by company review.",
    resp: "'I deeply regret having been involved with Epstein after his conviction in 2008.'",
    respDate: "2021",
    tax: [
      { type: "Apollo Global — Federal", detail: "Apollo manages pension funds for federal employees, military. Major private equity player in defense/govt-adjacent sectors.", source: "Apollo SEC filings", status: "Indirect but massive", amount: "Manages billions in fed-adjacent pensions", verified: true },
    ],
    conn: ["bill-gates", "leslie-wexner"],
    tl: [
      { date: "1990s", year: 1996, title: "Relationship Began", desc: "Met Epstein through financial circles in the 1990s.", source: "Apollo review", url: "", type: "contact", confidence: "corroborated" },
      { date: "2012-2017", year: 2012, title: "Paid $158 Million Post-Conviction", desc: "Apollo-commissioned review confirmed $158M in payments to Epstein for tax/estate planning — the largest known individual payment to Epstein. All AFTER 2008 conviction.", source: "Apollo independent review, Britannica", url: "https://www.britannica.com/topic/Where-Did-Jeffrey-Epstein-Get-His-Money", type: "financial", confidence: "primary" },
      { date: "Mar 2021", year: 2021, title: "Stepped Down as Apollo CEO", desc: "Left CEO role after independent review confirmed payments. Review found 'no evidence' of involvement in criminal activity.", source: "Apollo Global, WSJ", url: "", type: "consequence", confidence: "primary" },
      { date: "Jan 2026", year: 2026, title: "Photos Released", desc: "DOJ released photos. MoMA donor ($40M) — art world connections to Epstein network documented.", source: "DOJ Files", url: "https://www.justice.gov/epstein", type: "document", confidence: "primary" },
    ]
  },
  "noam-chomsky": {
    name: "Noam Chomsky", cat: "Academic", role: "Linguist, MIT Professor Emeritus", prev: "MIT Professor", init: "NC",
    sum: "Photos released showing Chomsky with Epstein. Had dinner meetings. Chomsky confirmed he met Epstein for discussions about political and academic topics. Said he saw 'nothing wrong' at the time.",
    resp: "'If there was a crime, it's between [Epstein] and the justice system.'",
    respDate: "2023",
    tax: [
      { type: "MIT Federal Grants", detail: "MIT receives billions in federal research grants. Epstein donated to MIT's Media Lab (returned).", source: "NIH Reporter, MIT investigation", status: "Institutional", amount: "MIT: billions in federal grants", verified: true },
    ],
    conn: ["bill-gates"],
    tl: [
      { date: "2010s", year: 2015, title: "Multiple Meetings", desc: "Met Epstein for dinner and discussions multiple times, including post-conviction.", source: "WSJ, media reports", url: "", type: "contact", confidence: "corroborated" },
      { date: "Dec 2025", year: 2025, title: "Photos Released by DOJ", desc: "Photos of Chomsky with Epstein released as part of Dec 18 batch.", source: "DOJ Files, Wikipedia", url: "https://en.wikipedia.org/wiki/Epstein_files", type: "document", confidence: "primary" },
    ]
  },

  "alan-dershowitz": {
    name: "Alan Dershowitz", cat: "Legal / Academic", role: "Harvard Law Professor Emeritus", prev: "Epstein Defense Attorney", init: "AD",
    sum: "Dual role: member of Epstein's defense team who helped negotiate the controversial 2008 non-prosecution agreement, AND accused by Virginia Giuffre of being trafficked to at least six times. Giuffre later said she 'may have made a mistake' in 2022 settlement (no money exchanged). Dershowitz says he saw the Epstein client list and claims files are being 'suppressed to protect individuals.' Calls for full release of all files.",
    resp: "'I want every single file out. I want every video tape out. Documents are being suppressed to protect individuals. I know the names.'",
    respDate: "Jul 2025",
    tax: [
      { type: "No current government role", detail: "Former advisor to multiple administrations. No active federal contracts.", source: "Public records", status: "N/A", amount: "N/A", verified: true },
    ],
    conn: ["donald-trump", "bill-clinton", "leslie-wexner", "ghislaine-maxwell"],
    tl: [
      { date: "2006-2008", year: 2006, title: "Negotiated Plea Deal", desc: "Part of Epstein's legal 'dream team' (with Ken Starr, Jay Lefkowitz) that negotiated controversial non-prosecution agreement with U.S. Attorney Acosta.", source: "Court records, DOJ", url: "", type: "document", confidence: "primary" },
      { date: "2014", year: 2014, title: "Giuffre Accusations Filed", desc: "Virginia Giuffre alleged in court filings that Epstein trafficked her to Dershowitz at least six times beginning when she was 16.", source: "Court filings", url: "", type: "allegation", confidence: "corroborated" },
      { date: "Apr 2019", year: 2019, title: "Defamation Lawsuit Filed", desc: "Giuffre sued Dershowitz for defamation. Dershowitz countersued. Years of litigation.", source: "Court records", url: "", type: "document", confidence: "primary" },
      { date: "Nov 2022", year: 2022, title: "Settlement — Giuffre Says 'May Have Made a Mistake'", desc: "Joint settlement: Giuffre acknowledged she 'may have been mistaken' in identifying Dershowitz. No money exchanged. Dershowitz acknowledged extortion claims were 'mistaken.'", source: "Joint stipulation, CNN", url: "https://www.cnn.com/2022/11/08/us/alan-dershowitz-virginia-giuffre-allegations-dropped", type: "document", confidence: "primary" },
      { date: "Jan 2024", year: 2024, title: "Unsealed Depositions", desc: "Newly unsealed deposition material detailed Giuffre's allegations. Dershowitz posted video defenses asserting documents exonerate him.", source: "Business Insider", url: "", type: "document", confidence: "primary" },
      { date: "Jul 2025", year: 2025, title: "Claims Files Being 'Suppressed'", desc: "Told Sean Spicer Show he personally saw the Epstein client list. Said documents are being suppressed to protect high-profile individuals. 'They're everything.'", source: "World Tribune, Megyn Kelly Show", url: "", type: "claim", confidence: "single-source" },
      { date: "May 2025", year: 2025, title: "Virginia Giuffre Dies", desc: "Giuffre died by suicide at age 41 in Australia. Dershowitz said he 'feels terrible' and reiterated call for full file release.", source: "BBC, Megyn Kelly Show", url: "", type: "consequence", confidence: "primary" },
    ]
  },
  "jes-staley": {
    name: "Jes Staley", cat: "Business / Finance", role: "Former CEO Barclays, Former Head JPMorgan Private Bank", prev: "JPMorgan Private Banking Chief", init: "JS",
    sum: "Epstein's primary banking contact at JPMorgan. 1,000+ emails exchanged over a decade. Described friendship as 'profound' and called Epstein 'family.' Emails included 'That was fun. Say hi to Snow White' — when Epstein asked 'what character would you like next,' Staley replied 'Beauty and the Beast.' UK FCA banned him from financial services and fined £1.8M for misleading Barclays about Epstein ties. JPMorgan sued to claw back $80M+ in pay. Admitted in 2025 tribunal he slept with Epstein assistant.",
    resp: "Denied knowledge of Epstein's sex trafficking. Called accusations 'baseless' but expressed 'regret' for the relationship.",
    respDate: "2025",
    tax: [
      { type: "JPMorgan Federal Business", detail: "JPMorgan held $365B in govt deposits, primary dealer for US Treasury. Staley headed private banking during Epstein relationship.", source: "USASpending, Treasury", status: "Institutional", amount: "$365B+ govt deposits", verified: true },
      { type: "JPMorgan Epstein Revenue", detail: "Epstein generated $8M+ in revenue for JPMorgan. Referred billionaires including Sergey Brin to the bank.", source: "USVI v. JPMorgan filing", status: "Documented", amount: "$8M+ revenue", verified: true },
    ],
    conn: ["bill-gates", "sergey-brin", "andrew-mw", "leon-black"],
    tl: [
      { date: "~2000", year: 2000, title: "Introduced to Epstein", desc: "Former JPMorgan CEO Sandy Warner told Staley to meet Epstein, calling him 'one of the most connected people I know of in New York.'", source: "USVI v. JPMorgan court filing", url: "", type: "contact", confidence: "primary" },
      { date: "2008", year: 2008, title: "'You are a great friend'", desc: "After JPMorgan acquired Sempra for $1.7B, Staley emailed Epstein: 'You are a great friend.' Referenced 'age difference between husbands and wives would have fit in well with Jeffrey.'", source: "FCA tribunal, Bloomberg", url: "", type: "contact", confidence: "primary" },
      { date: "2010", year: 2010, title: "'Snow White' Emails", desc: "Staley emailed Epstein: 'That was fun. Say hi to Snow White.' Epstein replied: 'what character would you like next.' Staley: 'Beauty and the Beast.'", source: "USVI filing, CNN", url: "https://www.cnn.com/2025/03/13/business/jes-staley-slept-with-epstein-assistant-intl", type: "document", confidence: "primary" },
      { date: "2013", year: 2013, title: "JPMorgan Fires Epstein as Client", desc: "Mary Erdoes fired Epstein after Staley left JPMorgan. But bank continued back-channel contact for referrals.", source: "Court filings", url: "", type: "financial", confidence: "primary" },
      { date: "Dec 2015", year: 2015, title: "Became Barclays CEO", desc: "Became Barclays CEO. FCA later found he misled the bank about how close his Epstein relationship was and how long contact continued.", source: "FCA", url: "", type: "consequence", confidence: "primary" },
      { date: "Nov 2021", year: 2021, title: "Resigned from Barclays", desc: "Resigned as Barclays CEO amid FCA investigation into his Epstein relationship.", source: "BBC, Financial Times", url: "", type: "consequence", confidence: "primary" },
      { date: "Jun 2023", year: 2023, title: "JPMorgan $290M Victim Settlement", desc: "JPMorgan paid $290M to Epstein victims. Bank then sued Staley to claw back $80M+ in compensation.", source: "CNBC, court records", url: "https://www.cnbc.com/amp/2023/06/12/jpmorgan-reaches-settlement-with-epstein-victim-in-lawsuit.html", type: "financial", confidence: "primary" },
      { date: "Sep 2023", year: 2023, title: "JPMorgan $75M USVI Settlement", desc: "Bank paid additional $75M to USVI. Also reached confidential settlement with Staley.", source: "PBS, NBC", url: "", type: "financial", confidence: "primary" },
      { date: "Mar 2025", year: 2025, title: "Admitted Sleeping with Epstein Staff", desc: "At FCA tribunal in London, admitted he had sex with a member of Epstein's staff.", source: "CNN", url: "https://www.cnn.com/2025/03/13/business/jes-staley-slept-with-epstein-assistant-intl", type: "claim", confidence: "primary" },
      { date: "2025", year: 2025, title: "FCA Ban and Fine", desc: "UK FCA banned Staley from senior financial services roles and fined £1.8M ($2.3M) for misleading regulators.", source: "FCA, Bloomberg", url: "", type: "consequence", confidence: "primary" },
    ]
  },
  "eric-schmidt": {
    name: "Eric Schmidt", cat: "Business / Tech", role: "Former Google CEO", prev: "Google CEO (2001-2011), Alphabet Chair", init: "ES",
    sum: "Mentioned in Epstein files primarily through indirect references — newsletter emails, media articles, social event mentions. In 2003, Sergey Brin offered to bring Schmidt to dinner at Epstein's house. Co-investor in Washington Commanders with Josh Harris. Led National Security Commission on AI. Facing separate 2025 lawsuit alleging sexual battery and domestic violence by ex-partner.",
    resp: "Google did not respond to requests for comment on Epstein file mentions.",
    respDate: "Feb 2026",
    tax: [
      { type: "Google Federal Contracts", detail: "Google holds billions in federal cloud, AI, and defense contracts. Schmidt chaired National Security Commission on AI.", source: "USASpending, NSCAI", status: "Massive institutional", amount: "$5B+ federal contracts", verified: true },
      { type: "Washington Commanders", detail: "Co-investor in $6.05B purchase of NFL team with Josh Harris.", source: "Sportico", status: "Active", amount: "$6.05B group purchase", verified: true },
    ],
    conn: ["sergey-brin", "josh-harris"],
    tl: [
      { date: "2003", year: 2003, title: "Offered as Dinner Guest", desc: "Sergey Brin offered to bring Schmidt to a 'happily casual and relaxed' dinner at Epstein's house, arranged by Maxwell.", source: "DOJ Files, PBS/CBC", url: "", type: "contact", confidence: "primary" },
      { date: "2018-2019", year: 2018, title: "Indirect File Mentions", desc: "Name appears in forwarded newsletters, media articles, and social event attendance lists. No direct correspondence with Epstein found.", source: "Epstein Secrets database", url: "https://epsteinsecrets.com/entities/1001568", type: "document", confidence: "corroborated" },
      { date: "Sep 2025", year: 2025, title: "Separate Sexual Battery Lawsuit", desc: "Ex-partner Michelle Ritter filed lawsuit alleging sexual battery, harassment, domestic violence, and that Schmidt built a 'backdoor' to spy on Google employees.", source: "Wikipedia, LA County Superior Court", url: "", type: "allegation", confidence: "single-source" },
    ]
  },
  "jeff-bezos": {
    name: "Jeff Bezos", cat: "Business / Tech", role: "Founder, Amazon / Blue Origin", prev: "CEO Amazon", init: "JB",
    sum: "Appears in 196 Epstein files. Oct 2009 email: publicist Peggy Siegal reported seeing 'Bill Clinton and Jeff Bezos' at Maxwell's house after-party. At same Edge Foundation dinner as Epstein (2014 Vancouver). On 30-person guest list for 2011 Long Beach dinner with Brin and Musk. Maxwell attended Bezos's exclusive 'Campfire' literary retreat at least 3 times (2018 confirmed).",
    resp: "Amazon did not respond to requests for comment.",
    respDate: "Feb 2026",
    tax: [
      { type: "Amazon Federal Contracts", detail: "Amazon Web Services holds massive federal cloud contracts including CIA ($600M), NSA, and JWCC ($9B multi-cloud).", source: "USASpending, Washington Post", status: "Active", amount: "$10B+ federal cloud", verified: true },
      { type: "Blue Origin NASA", detail: "Blue Origin awarded $3.4B NASA lunar lander contract (2023).", source: "NASA", status: "Active", amount: "$3.4B NASA", verified: true },
    ],
    conn: ["bill-clinton", "elon-musk", "sergey-brin"],
    tl: [
      { date: "Oct 2009", year: 2009, title: "At Maxwell's After-Party", desc: "Publicist Peggy Siegal emailed Epstein that she'd just left Maxwell's house where 'Bill Clinton and Jeff Bezos were there.'", source: "DOJ Files, CBS/NBC", url: "https://www.cbsnews.com/news/bill-gates-elon-musk-epstein-files-what-documents-show/", type: "contact", confidence: "primary" },
      { date: "2011", year: 2011, title: "On 30-Person Dinner Guest List", desc: "Listed among ~30 confirmed attendees for planned dinner in Long Beach, CA with Brin and Musk.", source: "DOJ Files, NBC", url: "https://www.nbcnews.com/tech/tech-news/jeffrey-epstein-files-reveal-deep-tech-ties-musk-gates-rcna257092", type: "contact", confidence: "primary" },
      { date: "2014", year: 2014, title: "Edge Foundation Dinner", desc: "Present at Edge Foundation dinner for billionaires in Vancouver. Epstein planned to attend the same dinner per emails.", source: "DOJ Files, NBC", url: "", type: "contact", confidence: "corroborated" },
      { date: "2018", year: 2018, title: "Maxwell at Bezos 'Campfire' Retreat", desc: "Maxwell attended Bezos's exclusive literary retreat with her partner Scott Borgerson. Sources say she attended at least 3 such retreats.", source: "CNBC, Vice", url: "https://www.cnbc.com/2019/11/01/jeffrey-epstein-friend-ghislaine-maxwell-was-guest-at-jeff-bezos-event.html", type: "contact", confidence: "corroborated" },
    ]
  },
  "george-stephanopoulos": {
    name: "George Stephanopoulos", cat: "Media / Former Government", role: "ABC News Anchor (GMA, This Week)", prev: "Clinton White House Senior Advisor", init: "GS",
    sum: "On confirmed guest list for Dec 2, 2010 dinner at Epstein's Manhattan townhouse — two years after conviction. Dinner organized by publicist Peggy Siegal, included Prince Andrew, Woody Allen, Katie Couric, Charlie Rose. Said it was 'the first and last time' he saw Epstein and called it 'a mistake to go.' Now anchors ABC coverage of the Epstein files release.",
    resp: "'That dinner was the first and last time I've seen him. I should have done more due diligence. It was a mistake to go.'",
    respDate: "2019",
    tax: [
      { type: "No government role", detail: "Former Clinton White House advisor. Currently private sector (ABC News).", source: "Public records", status: "N/A", amount: "N/A", verified: true },
    ],
    conn: ["bill-clinton", "andrew-mw", "woody-allen"],
    tl: [
      { date: "Dec 2, 2010", year: 2010, title: "Attended Post-Conviction Dinner", desc: "On confirmed 'Yes list' for dinner at Epstein's townhouse with Prince Andrew, Woody Allen, Katie Couric, Charlie Rose. Organized by publicist Peggy Siegal.", source: "Daily Beast, NewsBusters, DOJ Files", url: "", type: "visit", confidence: "primary" },
      { date: "Jul 2019", year: 2019, title: "Called Dinner 'A Mistake'", desc: "After Epstein's arrest, told NYT it was 'the first and last time' he saw Epstein and 'I should have done more due diligence.'", source: "New York Times", url: "", type: "claim", confidence: "primary" },
      { date: "Feb 1, 2026", year: 2026, title: "Interviewed Deputy AG on Files", desc: "Interviewed Deputy AG Todd Blanche on 'This Week' about Epstein files release, pressing on conflicts of interest.", source: "ABC News", url: "https://abcnews.go.com/Politics/week-transcript-2-1-26-deputy-attorney-general/story?id=129744451", type: "document", confidence: "primary" },
    ]
  },
  "jean-luc-brunel": {
    name: "Jean-Luc Brunel", cat: "Inner Circle (Deceased)", role: "Model Agent — died in French prison 2022", prev: "Founder, MC2 Model Management / Karin Models", init: "JLB",
    sum: "Named FBI co-conspirator. Founded MC2 Model Management with $1M from Epstein. Accused of procuring underage girls through modeling agencies — Giuffre alleged Epstein bragged he 'slept with over 1,000 of Brunel's girls.' 25 flights on Epstein's jet (1998-2005). 70+ jail visits during Epstein's 2008 sentence. Charged in France with rape of minors. Found hanged in La Santé Prison, Paris, Feb 19, 2022, before trial. Death mirrored Epstein's.",
    resp: "Denied all involvement. Lawyers said his death was 'not guided by guilt, but a profound sense of injustice.'",
    respDate: "Posthumous",
    tax: [],
    conn: ["ghislaine-maxwell", "leslie-wexner", "andrew-mw"],
    tl: [
      { date: "1980s", year: 1985, title: "Met Maxwell", desc: "Met Ghislaine Maxwell in the 1980s. She later introduced him to Epstein.", source: "Wikipedia, Daily Beast", url: "", type: "contact", confidence: "corroborated" },
      { date: "1988", year: 1988, title: "60 Minutes Investigation", desc: "Subject of CBS 60 Minutes investigation by Craig Pyes and Diane Sawyer into modeling industry abuses.", source: "CBS", url: "", type: "document", confidence: "primary" },
      { date: "2004", year: 2004, title: "MC2 Funded by Epstein", desc: "Received up to $1M from Epstein to launch MC2 Model Management. Giuffre alleged agency was a cover for sex trafficking.", source: "Court filings, Daily Beast", url: "", type: "financial", confidence: "primary" },
      { date: "1998-2005", year: 2000, title: "25 Flights on Epstein's Jet", desc: "Flight logs documented 25 trips on Epstein's private plane.", source: "Flight logs", url: "", type: "travel", confidence: "primary" },
      { date: "2008", year: 2008, title: "70+ Jail Visits", desc: "Made at least 70 recorded visits to the jail where Epstein was held during his 2008 sentence.", source: "Jail records", url: "", type: "visit", confidence: "primary" },
      { date: "2014-2015", year: 2014, title: "Giuffre Allegations", desc: "Giuffre named Brunel as someone she was trafficked to. Alleged Epstein bragged he 'slept with over 1,000 of Brunel's girls.'", source: "Court filings", url: "", type: "allegation", confidence: "corroborated" },
      { date: "Jul 2019", year: 2019, title: "Named FBI Co-Conspirator", desc: "Included on FBI's list of '10 co-conspirators' alongside Maxwell, Wexner, Kellen, Groff, and others.", source: "FBI email, DOJ Files", url: "", type: "document", confidence: "primary" },
      { date: "Dec 2020", year: 2020, title: "Arrested at Paris Airport", desc: "Detained at Charles de Gaulle Airport while attempting to board flight to Senegal. Charged with rape of minors and sexual harassment.", source: "Paris prosecutor, NPR", url: "https://www.npr.org/2022/02/19/1081961087/jeffrey-epstein-jean-luc-brunel-dead", type: "government", confidence: "primary" },
      { date: "Feb 19, 2022", year: 2022, title: "Found Dead in Prison Cell", desc: "Found hanged in La Santé Prison at 1:30 AM. Not on suicide watch. Death mirrored Epstein's. Victims expressed 'great disappointment' at losing chance for trial.", source: "Paris prosecutor, Al Jazeera, NPR", url: "https://www.npr.org/2022/02/19/1081961087/jeffrey-epstein-jean-luc-brunel-dead", type: "consequence", confidence: "primary" },
    ]
  },
  "kathryn-ruemmler": {
    name: "Kathryn Ruemmler", cat: "Legal / Government", role: "General Counsel, Goldman Sachs", prev: "Obama White House Counsel", init: "KR",
    sum: "Former Obama White House Counsel. Had 'professional association' with Epstein when she was a lawyer in private practice. Arranged Woody Allen's White House tour through Epstein. In 2017 Epstein email, warned Democrats should stop demonizing Trump as 'Mafia-type figure' while also calling Trump a 'maniac.'",
    resp: "Goldman Sachs spokesperson: Ruemmler 'had a professional association with Jeffrey Epstein when she was a lawyer in private practice' and 'regrets ever knowing him.'",
    respDate: "Feb 2026",
    tax: [
      { type: "Goldman Sachs Federal Business", detail: "Goldman Sachs is primary dealer for US Treasury. Holds billions in federal contracts.", source: "USASpending, Treasury", status: "Institutional", amount: "Billions in federal business", verified: true },
    ],
    conn: ["woody-allen", "donald-trump"],
    tl: [
      { date: "~2012-2015", year: 2013, title: "Professional Association with Epstein", desc: "Had a professional relationship with Epstein while in private law practice. Goldman Sachs confirmed this.", source: "Goldman Sachs statement, AP", url: "", type: "contact", confidence: "primary" },
      { date: "~2013", year: 2013, title: "Arranged Woody Allen White House Tour", desc: "Epstein facilitated a White House tour for Woody Allen through Ruemmler when she served as Obama's White House Counsel.", source: "DOJ Files", url: "", type: "document", confidence: "primary" },
      { date: "2017", year: 2017, title: "Epstein Political Email", desc: "Epstein emailed Ruemmler warning Democrats should stop demonizing Trump as a Mafia-type figure, while calling Trump a 'maniac.'", source: "DOJ Files, AP", url: "", type: "document", confidence: "primary" },
    ]
  },
  "josh-harris": {
    name: "Josh Harris", cat: "Business / Sports", role: "Owner, Washington Commanders / 76ers / Devils", prev: "Co-founder, Apollo Global Management", init: "JH",
    sum: "Co-founder of Apollo Global Management with Leon Black. Appeared in latest DOJ files — multiple emails with Epstein discussing documents, payments, and an invitation to Epstein's estate (2014). Epstein referenced a breakfast Harris attended with him and Bill Gates. Spokesperson says Harris 'never had an independent relationship' with Epstein and 'sought to avoid meeting.' Purchased Washington Commanders for record $6.05B in 2023.",
    resp: "'Josh Harris never had an independent relationship with Jeffrey Epstein. Harris sought to prevent Epstein's attempts to develop a corporate relationship with Apollo. As these emails indicate, Harris sought to avoid meeting with Epstein, canceling meetings and having others return his calls.'",
    respDate: "Feb 2026",
    tax: [
      { type: "Apollo Global Management", detail: "Co-founded Apollo, which manages $600B+ in assets. Harris stepped down from day-to-day role in 2021.", source: "Apollo filings", status: "Former", amount: "$600B AUM", verified: true },
    ],
    conn: ["leon-black", "bill-gates", "eric-schmidt"],
    tl: [
      { date: "~2014", year: 2014, title: "Emails and Estate Invitation", desc: "Multiple emails with Epstein discussing documents, payments. Invited to Epstein's estate in NYC. Epstein referenced a breakfast Harris attended with him and Bill Gates.", source: "DOJ Files, Philadelphia Inquirer", url: "", type: "contact", confidence: "primary" },
      { date: "2021", year: 2021, title: "Left Apollo After Black Departed", desc: "Leon Black stepped down from Apollo after $158M Epstein payments revealed. Harris took over then left to focus on sports.", source: "WSJ", url: "", type: "consequence", confidence: "primary" },
      { date: "Jul 2023", year: 2023, title: "Purchased Washington Commanders", desc: "Led group that purchased NFL team for record $6.05B. Ownership group includes Eric Schmidt.", source: "Sportico", url: "", type: "financial", confidence: "primary" },
      { date: "Feb 2026", year: 2026, title: "Named in Latest DOJ Files", desc: "Correspondences surfaced showing ongoing communications. Spokesperson reiterated no independent relationship.", source: "DOJ Files, WJLA", url: "", type: "document", confidence: "primary" },
    ]
  },
  "david-copperfield": {
    name: "David Copperfield", cat: "Entertainment", role: "Illusionist", prev: "Illusionist", init: "DC",
    sum: "Named by Epstein accuser Johanna Sjoberg in 2016 deposition as a friend of Epstein's. Sjoberg said Copperfield asked her if she knew 'girls were getting paid to find other girls.' Recalled a girl at dinner who 'seemed young' and could have been in high school. Photos with Maxwell on Epstein's island released Dec 2025. Phone logs show repeated contact ('Magic David called'). Epstein invoked Fifth Amendment when asked about sharing underage girls with Copperfield. 2025 DOJ files: victim alleges improper touching during visit to Epstein's home.",
    resp: "Denies all accusations. Lawyers say he was never charged and is exonerated. Describes Epstein link as casual acquaintance.",
    respDate: "Ongoing",
    tax: [],
    conn: ["ghislaine-maxwell", "bill-gates"],
    tl: [
      { date: "Pre-2008", year: 2005, title: "Multiple Visits to Epstein Residences", desc: "Housekeeper accounts confirm Copperfield's name on message pads and multiple stays at Epstein's residence.", source: "Deposition testimony, DOJ Files", url: "", type: "visit", confidence: "corroborated" },
      { date: "~2005", year: 2005, title: "Sjoberg Testimony — 'Girls Getting Paid'", desc: "Johanna Sjoberg testified Copperfield asked her if she knew 'girls were getting paid to find other girls.' Recalled a 'young' girl at dinner who could have been in high school.", source: "Sjoberg 2016 deposition, CNN", url: "https://www.cnn.com/2024/01/05/business/jeffrey-epstein-documents-unsealed-part-three", type: "allegation", confidence: "primary" },
      { date: "2016", year: 2016, title: "Epstein Pleaded Fifth on Copperfield", desc: "Epstein invoked Fifth Amendment when asked about sharing underage girls with Copperfield or being present with minors together.", source: "Deposition, court records", url: "", type: "document", confidence: "primary" },
      { date: "Dec 2025", year: 2025, title: "Photos with Maxwell Released", desc: "DOJ released photos of Copperfield with Ghislaine Maxwell on Epstein's island.", source: "DOJ Files, PBS", url: "https://www.pbs.org/newshour/politics/see-photos-and-documents-from-the-latest-epstein-file-release", type: "document", confidence: "primary" },
      { date: "Feb 2026", year: 2026, title: "Calls to Cancel MGM Show", desc: "Following latest file revelations, public calls for MGM Resorts and Nevada Gaming Control Board to cancel his Las Vegas show.", source: "Vital Vegas, Vegas Slots Online", url: "", type: "consequence", confidence: "corroborated" },
    ]
  },
  "bill-richardson": {
    name: "Bill Richardson", cat: "Politician (Deceased)", role: "Former Governor of New Mexico / Energy Secretary", prev: "Governor, U.N. Ambassador, Energy Secretary", init: "BR",
    sum: "Named by Virginia Giuffre as someone she was trafficked to. Richardson denied the allegations. Close proximity to Epstein's Zorro Ranch in New Mexico. Died Sept 1, 2023, before the major file releases. As Governor, his administration had oversight of the area where Epstein's ranch was located.",
    resp: "Denied all allegations through attorney. 'Governor Richardson has never even been contacted by law enforcement in this matter.'",
    respDate: "Pre-death",
    tax: [
      { type: "Former Government Official", detail: "Served as Energy Secretary (1998-2001), U.N. Ambassador (1997-1998), Governor of NM (2003-2011).", source: "Public records", status: "Deceased", amount: "N/A", verified: true },
    ],
    conn: ["bill-clinton"],
    tl: [
      { date: "1990s-2000s", year: 2000, title: "Epstein's New Mexico Operations", desc: "Epstein's Zorro Ranch in Stanley, NM operated during Richardson's tenure as Governor. Ranch was site of alleged abuses.", source: "Court filings, journalism", url: "", type: "contact", confidence: "corroborated" },
      { date: "2014", year: 2014, title: "Named by Giuffre", desc: "Virginia Giuffre alleged in court filings she was directed by Maxwell to have sexual relations with Richardson.", source: "Court filings", url: "", type: "allegation", confidence: "single-source" },
      { date: "Sep 1, 2023", year: 2023, title: "Died", desc: "Died at age 75 before the major Epstein file releases.", source: "AP", url: "", type: "consequence", confidence: "primary" },
    ]
  },
  "al-gore": {
    name: "Al Gore", cat: "Politician", role: "Former Vice President", prev: "Vice President (1993-2001)", init: "AG",
    sum: "Named in unsealed court documents (Jan 2024). Giuffre testified Epstein told her he helped with Gore's presidential campaign and arranged a meeting. No allegations of misconduct against Gore.",
    resp: "No public comment on Epstein file mentions.",
    respDate: "N/A",
    tax: [],
    conn: ["bill-clinton"],
    tl: [
      { date: "Jan 2024", year: 2024, title: "Named in Unsealed Documents", desc: "Referenced in Giuffre testimony. Epstein claimed he helped with Gore's campaign and arranged a meeting. No misconduct allegations.", source: "Court documents, NPR", url: "", type: "document", confidence: "single-source" },
    ]
  },
  "george-mitchell": {
    name: "George Mitchell", cat: "Politician / Legal", role: "Former Senate Majority Leader", prev: "Senate Majority Leader, Special Envoy", init: "GM2",
    sum: "Named by Virginia Giuffre as someone she was directed to have sexual relations with. Mitchell denied the allegations. Former Senate Majority Leader, Northern Ireland peace negotiator, and Middle East Special Envoy.",
    resp: "Through attorney: 'Senator Mitchell has never met, spoken with, or had any contact with Ms. Giuffre.'",
    respDate: "2019",
    tax: [],
    conn: ["bill-clinton"],
    tl: [
      { date: "2019", year: 2019, title: "Named by Giuffre", desc: "Virginia Giuffre named Mitchell in unsealed court documents as someone Maxwell directed her to have sex with.", source: "Court filings", url: "", type: "allegation", confidence: "single-source" },
    ]
  },
  "reid-hoffman": {
    name: "Reid Hoffman", cat: "Business / Tech", role: "LinkedIn Co-founder", prev: "LinkedIn Co-founder, Greylock partner", init: "RH",
    sum: "Appears 2,658 times in Epstein files — the most of any tech figure. Mostly scheduling emails coordinating MIT Media Lab meetings. Visited Epstein's island with MIT's Joi Ito for fundraising. In 2014, sent gifts to Epstein's NYC home including ice cream 'for the girls.' Clashed publicly with Musk on X after files release — each accused the other of deeper Epstein ties.",
    resp: "'I only knew Jeffrey Epstein because of a fundraising relationship with MIT, which I very much regret.' Confirmed visiting Epstein's island with MIT's Joi Ito.",
    respDate: "Feb 2026",
    tax: [],
    conn: ["bill-gates", "elon-musk", "sergey-brin"],
    tl: [
      { date: "~2013-2015", year: 2013, title: "MIT Media Lab Fundraising", desc: "Connected to Epstein through MIT fundraising. Coordinated meetings via scheduling emails.", source: "DOJ Files, NBC", url: "https://www.nbcnews.com/tech/tech-news/jeffrey-epstein-files-reveal-deep-tech-ties-musk-gates-rcna257092", type: "financial", confidence: "primary" },
      { date: "2014", year: 2014, title: "Gifts 'For the Girls'", desc: "Wrote that he sent gifts to Epstein's NYC home including ice cream 'for the girls' and 'something that may strike your funny bone for the island.' Meaning unclear.", source: "DOJ Files, NBC", url: "", type: "document", confidence: "primary" },
      { date: "~2014", year: 2014, title: "Visited Epstein's Island", desc: "Confirmed visiting island with MIT Media Lab director Joi Ito for fundraising purposes.", source: "Hoffman X post", url: "", type: "visit", confidence: "primary" },
      { date: "Feb 2026", year: 2026, title: "Public Clash with Musk", desc: "After files release, Musk accused Hoffman of island visits. Hoffman fired back with screenshot of Musk's 2012 email asking about 'wildest party on your island.'", source: "X posts, The Nation", url: "", type: "document", confidence: "primary" },
    ]
  },
  "stephen-hawking": {
    name: "Stephen Hawking", cat: "Academic (Deceased)", role: "Theoretical Physicist", prev: "Cambridge Professor, Physicist", init: "SH",
    sum: "Photos on Epstein's island released in files. Attended scientific conferences funded by Epstein. No allegations of misconduct. Died March 14, 2018.",
    resp: "N/A (deceased 2018)",
    respDate: "N/A",
    tax: [],
    conn: ["noam-chomsky", "larry-summers"],
    tl: [
      { date: "2006", year: 2006, title: "Photographed on Epstein's Island", desc: "Photos show Hawking at Epstein's Caribbean island, attending scientific conference/event.", source: "DOJ Files, media", url: "", type: "visit", confidence: "primary" },
    ]
  },
  "henry-kissinger": {
    name: "Henry Kissinger", cat: "Politician (Deceased)", role: "Former Secretary of State", prev: "National Security Advisor, Secretary of State", init: "HK",
    sum: "In Epstein's contact book. Part of Epstein's network of geopolitical influence. Died Nov 29, 2023.",
    resp: "N/A (deceased 2023)",
    respDate: "N/A",
    tax: [],
    conn: ["donald-trump", "ehud-barak"],
    tl: [
      { date: "Pre-2008", year: 2005, title: "In Epstein Contact Book", desc: "Listed in Epstein's black book of contacts. Part of extensive geopolitical network.", source: "Epstein contact book", url: "", type: "document", confidence: "primary" },
    ]
  },
  "mick-jagger": {
    name: "Mick Jagger", cat: "Entertainment", role: "Lead Singer, The Rolling Stones", prev: "Musician", init: "MJ",
    sum: "Photographed seated at table with Bill Clinton and Epstein (undated). Photos released by DOJ in Dec 2025 files. No allegations of misconduct.",
    resp: "No public comment.",
    respDate: "N/A",
    tax: [],
    conn: ["bill-clinton"],
    tl: [
      { date: "Dec 2025", year: 2025, title: "Photo with Clinton and Epstein Released", desc: "DOJ released undated photo of Jagger seated at table with Clinton and Epstein.", source: "DOJ Files", url: "https://www.justice.gov/epstein", type: "document", confidence: "primary" },
    ]
  },
  "deepak-chopra": {
    name: "Deepak Chopra", cat: "Entertainment / Wellness", role: "Author, Wellness Advocate", prev: "Author, Speaker", init: "DCh",
    sum: "Corresponded frequently with Epstein. Exchanged news articles and set up meetings. Unable to attend a 2017 dinner with Epstein, Woody Allen, and Slovak FM Lajčák. Asked Epstein if he knew Marla Maples (Trump's ex-wife) in 2016.",
    resp: "No public comment on Epstein file mentions.",
    respDate: "N/A",
    tax: [],
    conn: ["woody-allen"],
    tl: [
      { date: "2016-2017", year: 2016, title: "Frequent Email Correspondence", desc: "Exchanged news articles, set up meetings. Asked Epstein about Marla Maples (2016). Unable to attend 2017 dinner with Allen and Lajčák.", source: "DOJ Files, CNN", url: "https://www.cnn.com/2026/02/03/politics/epstein-files-musk-lutnick-branson-emails", type: "contact", confidence: "primary" },
    ]
  },
  "casey-wasserman": {
    name: "Casey Wasserman", cat: "Business / Sports", role: "Chairman, LA28 Olympics", prev: "Wasserman Media Group CEO", init: "CW",
    sum: "Corresponded with Maxwell. She asked if it would be 'foggy enough during an upcoming visit so that you can float naked down the beach.' Said he never had personal or business relationship with Epstein and regretted correspondence with Maxwell.",
    resp: "'I never had a personal or business relationship with Epstein... I regret the correspondence with Maxwell, which came long before her horrific crimes came to light.'",
    respDate: "Feb 2026",
    tax: [],
    conn: ["donald-trump"],
    tl: [
      { date: "Pre-2020", year: 2015, title: "Maxwell Correspondence", desc: "Maxwell asked if it would be foggy enough 'so that you can float naked down the beach and no one can see you unless they are close up.'", source: "DOJ Files, CBC/PBS", url: "", type: "contact", confidence: "primary" },
      { date: "Feb 2026", year: 2026, title: "Statement Denying Epstein Ties", desc: "Said he 'never had a personal or business relationship with Epstein' and regretted Maxwell correspondence.", source: "CBS, AP", url: "", type: "claim", confidence: "primary" },
    ]
  },
  "brett-ratner": {
    name: "Brett Ratner", cat: "Entertainment", role: "Film Director", prev: "Director (Rush Hour, X-Men)", init: "BRa",
    sum: "Photos in DOJ files show him with arms wrapped around the shirtless torso of Jean-Luc Brunel. Previously faced separate sexual misconduct allegations from multiple women.",
    resp: "Did not respond to requests for comment.",
    respDate: "N/A",
    tax: [],
    conn: ["jean-luc-brunel"],
    tl: [
      { date: "Dec 2025", year: 2025, title: "Photos with Brunel Released", desc: "DOJ released photo of Ratner with arms wrapped around the shirtless torso of Jean-Luc Brunel.", source: "DOJ Files, CBC/CNN", url: "", type: "document", confidence: "primary" },
    ]
  },
  "dean-kamen": {
    name: "Dean Kamen", cat: "Business / Tech", role: "Inventor, Segway / DEKA Research", prev: "Inventor, Entrepreneur", init: "DK",
    sum: "Photographed with Epstein and Richard Branson. Photos released by House Oversight Committee Democrats.",
    resp: "No public comment.",
    respDate: "N/A",
    tax: [
      { type: "DARPA/DOD Contracts", detail: "DEKA Research holds significant defense contracts for prosthetics and medical devices.", source: "USASpending", status: "Active", amount: "Millions in DOD contracts", verified: true },
    ],
    conn: ["richard-branson"],
    tl: [
      { date: "Dec 2025", year: 2025, title: "Photo with Epstein and Branson", desc: "Photo released by House Oversight Committee showing Kamen with Epstein and Richard Branson.", source: "House Oversight Democrats", url: "", type: "document", confidence: "primary" },
    ]
  },

};

// ═══════════════════════════════════════════════════════
// 10 CO-CONSPIRATORS DATA
// ═══════════════════════════════════════════════════════
const CO_CONSPIRATORS = {
  named: [
    { name: "Ghislaine Maxwell", status: "Convicted — serving 20 years", detail: "Only person federally prosecuted. Found guilty Dec 2021 on 5 of 6 counts including sex trafficking of a minor. Sentenced to 20 years. Appeal denied. Currently at FCI Tallahassee.", profileId: "ghislaine-maxwell" },
    { name: "Jean-Luc Brunel", status: "Deceased — died in French jail 2022", detail: "Model scout who founded MC2 Model Management with $1M from Epstein. Arranged visas for young models from Eastern Europe. 25 flights on Epstein's jet. 70+ jail visits during 2008 sentence. Charged with rape of minors. Found hanged in La Santé Prison Feb 19, 2022 — before he could testify.", profileId: "jean-luc-brunel" },
    { name: "Leslie Wexner", status: "Named in FBI email — subpoenaed Feb 2026", detail: "Described as 'wealthy businessman in Ohio' in FBI emails. Gave Epstein sweeping power of attorney. Gifted Epstein the $77M NYC townhouse. Victoria's Secret connection used to lure victims. Subpoenaed by House Oversight. Testifying Feb 18, 2026.", profileId: "leslie-wexner" },
    { name: "Sarah Kellen", status: "Named co-conspirator 2007 — immunity via plea deal", detail: "Epstein's primary scheduler. Organized victims' visits, maintained contact lists. Victims testified Kellen recruited and scheduled them. Protected by 2008 plea deal. Never charged despite deal being voided. Now goes by Sarah Kensington." },
    { name: "Lesley Groff", status: "Named co-conspirator 2007 — immunity via plea deal", detail: "Epstein's executive assistant for 20+ years. Managed logistics, travel, and property access. Named on inner circle org chart. Protected under plea deal immunity." },
    { name: "Adriana Ross", status: "Named co-conspirator 2007 — immunity via plea deal", detail: "Also known as Adriana Mucinska. Named in FBI investigation as facilitator. Invoked Fifth Amendment in deposition. Protected under plea deal." },
    { name: "Nadia Marcinkova", status: "Named co-conspirator 2007 — immunity via plea deal", detail: "Alleged victim who became participant. Epstein reportedly 'purchased' her from her family in Yugoslavia as a teenager. Later became a pilot. Now goes by Nadia Marcinko. Never charged despite plea deal being voided." },
  ],
  unknown: 3,
  source: "FBI emails July 2019, DOJ Files Dec 2025, Maxwell trial testimony",
  subpoena_status: "6 of 10 served grand jury subpoenas. 3 in FL, 1 Boston, 1 NYC, 1 CT. 4 outstanding including 'wealthy businessman in Ohio.'",
  key_question: "No alleged co-conspirator other than Maxwell has ever been charged. DOJ said in July 2025 there were 'no credible allegations' to charge others. Sen. Schumer: 'Who are these 10 co-conspirators? Why haven't we seen those memos?'",
  recruitment_pipeline: [
    { step: 1, title: "Initial Contact", desc: "Young girls (avg age 14-16) approached at schools, malls, or through existing victims with offers of $200-300 for a 'massage.'" },
    { step: 2, title: "First Visit", desc: "Brought to Epstein's Palm Beach mansion or NYC townhouse. What started as a massage escalated to sexual abuse." },
    { step: 3, title: "Normalization", desc: "Victims given money, gifts, and access to wealthy/famous people. Abuse framed as normal. Maxwell played key grooming role." },
    { step: 4, title: "Recruitment Pressure", desc: "Victims pressured to bring friends — paid $200-300 per girl recruited. This created a self-sustaining pipeline." },
    { step: 5, title: "Expansion", desc: "Network extended to NYC, USVI, New Mexico, Paris. MC2 Model Management (Brunel) provided international pipeline via model visas." },
    { step: 6, title: "Silence", desc: "Victims threatened with legal action, deportation (for foreign models), or told no one would believe them against billionaires." },
  ]
};

// ═══════════════════════════════════════════════════════
// GOVERNMENT FAILURES TIMELINE
// ═══════════════════════════════════════════════════════
const GOV_FAILURES = [
  { date: "2005", title: "Palm Beach PD Investigation Overruled", desc: "Palm Beach police compiled statements from 40+ victims — one of the strongest child sex trafficking cases in Florida history. Chief Michael Reiter prepared a detailed probable cause affidavit. Case referred to FBI and state attorney. Despite overwhelming evidence, federal prosecutors chose negotiation over prosecution.", source: "Miami Herald, Palm Beach PD records", type: "government" },
  { date: "2006", title: "FBI Opens Federal Investigation", desc: "FBI compiled massive evidence file including victim testimony, financial records, and flight logs. Agents were prepared to bring federal trafficking charges. U.S. Attorney Acosta's office began secret negotiations with Epstein's legal team (including Dershowitz, Ken Starr, and Jay Lefkowitz) without notifying victims.", source: "FBI records, court filings", type: "government" },
  { date: "2007-2008", title: "The Plea Deal", desc: "U.S. Attorney Alexander Acosta signed off on a deal letting Epstein plead to state prostitution charges — avoiding federal trafficking entirely. Victims not notified as required by law. 4 named co-conspirators given blanket immunity. Deal negotiated at Marriott in West Palm Beach, outside normal channels. Epstein served 13 months with 12 hours/day work release.", source: "DOJ investigation, court records", type: "government" },
  { date: "2015", title: "Judge Rules Victims' Rights Violated", desc: "Federal Judge Kenneth Marra ruled the 2008 plea deal violated the Crime Victims' Rights Act because prosecutors deliberately concealed the agreement from victims. Despite this ruling, no co-conspirators were subsequently charged. The ruling came 7 years after the deal.", source: "Court records, CVRA ruling", type: "government" },
  { date: "2018", title: "Julie K. Brown's Investigation Forces Action", desc: "Miami Herald reporter Julie K. Brown published 'Perversion of Justice' — interviewing 80+ victims and exposing the plea deal's full scope. This journalism, not law enforcement, is what ultimately led to Epstein's 2019 arrest. Brown found multiple agencies had the evidence for years.", source: "Miami Herald investigation", type: "government" },
  { date: "Jul 2019", title: "SDNY Finally Brings Federal Charges", desc: "Southern District of New York arrested Epstein on federal sex trafficking charges — 11 years after the plea deal. SDNY acted independently from Main Justice. Safe found in Epstein's townhouse contained CDs labeled with names, cash, and a fake passport.", source: "SDNY indictment, court records", type: "government" },
  { date: "Aug 10, 2019", title: "Death in Federal Custody", desc: "Epstein found dead in MCC. Had been taken OFF suicide watch despite a prior attempt. Both guards fell asleep and falsified records. Camera footage outside cell 'unusable' due to technical failure. AG Barr said he personally reviewed adjacent cameras. Medical examiner ruled suicide; independent pathologist (Dr. Michael Baden) hired by family disagreed.", source: "DOJ Inspector General, court records, AP", type: "government" },
  { date: "Nov 2019", title: "Inspector General Report on BOP Failures", desc: "DOJ Inspector General found 'serious failures' at MCC: chronic understaffing (guards on forced overtime), falsified wellness checks, non-functional cameras, broken locks. Two guards charged with falsifying records; accepted deferred prosecution — no jail time. IG noted systemic problems predated Epstein.", source: "DOJ Inspector General report", type: "government" },
  { date: "Jul 2025", title: "DOJ: 'No Credible Allegations' for More Charges", desc: "Despite identifying 10 co-conspirators in 2019, DOJ memo stated no credible evidence to charge others. Only Maxwell was ever prosecuted.", source: "DOJ memo, Wikipedia", type: "government" },
  { date: "Dec 19, 2025", title: "First Release: Bipartisan Condemnation", desc: "Initial batch drew criticism: 500+ pages entirely blacked out. 16 files disappeared without explanation. Faulty redactions allowed public to recover hidden content.", source: "Wikipedia, multiple outlets", type: "government" },
  { date: "Jan 30, 2026", title: "3M Pages Released — Massive Redaction Failures", desc: "DOJ released 3M pages, 180K images, 2K videos. WSJ found 43+ victims' full names exposed, some appearing 100+ times. Home addresses visible. Unredacted nude images of young women/possible teenagers published.", source: "WSJ, AP, NYT", type: "government" },
  { date: "Jan 30, 2026", title: "Nude Images of Possible Minors Published", desc: "NYT found dozens of uncensored nude photos showing faces of young people. Images largely removed only after NYT notified DOJ. One set of 100+ images had 99 redacted, last one showed full face.", source: "New York Times, AP", type: "government" },
  { date: "Feb 1, 2026", title: "'Most Egregious Violation of Victim Privacy'", desc: "Attorneys for 200+ victims asked judges to order immediate takedown. Called it 'the single most egregious violation of victim privacy in one day in United States history.' Victim received death threats after banking info exposed.", source: "Court filing, CBS/AP", type: "government" },
  { date: "Feb 2, 2026", title: "DOJ Withdrew Thousands of Documents", desc: "Removed several thousand documents and media. Blamed 'technical or human error.' Attorneys had provided list of 350 victim names on Dec 4 — DOJ failed to even keyword-search for them.", source: "AP, PBS", type: "government" },
  { date: "Feb 6, 2026", title: "AG Bondi: 'Substantial Progress'", desc: "DOJ claimed 'substantial progress' in fixing redactions. Deputy AG Blanche: errors affected 'about .001%' of materials. Victims' attorneys called this characterization 'insulting.'", source: "DOJ letter, CBS", type: "government" },
  { date: "Ongoing", title: "Only 50% of Files Released", desc: "DOJ acknowledged 6M pages may qualify but released only 3M, calling it the 'final' release. Lawmakers Khanna and Massie say FBI victim interviews, draft indictments, and prosecution memos still withheld.", source: "Khanna-Massie letter, CNN", type: "government" },
];

// ═══════════════════════════════════════════════════════
// GLOBAL CONSEQUENCES TRACKER
// ═══════════════════════════════════════════════════════
const CONSEQUENCES = [
  { name: "Peter Mandelson", role: "UK — House of Lords / Labour", action: "Resigned from Labour and House of Lords within 48 hours of file release showing 20+ contacts with Epstein including island visit. Met Police opened criminal investigation. Mandelson had claimed 'only met Epstein briefly.'", date: "Feb 1-3, 2026", profileId: "peter-mandelson", type: "resignation" },
  { name: "Larry Summers", role: "OpenAI Board / Harvard", action: "Left OpenAI board, stopped teaching at Harvard. Called it 'major error of judgment.' Files showed multiple flights on Epstein's jet and dinners after 2008 conviction. Had previously claimed relationship was limited.", date: "Post-release", profileId: "larry-summers", type: "resignation" },
  { name: "Andrew Mountbatten-Windsor", role: "UK Royalty / Duke of York", action: "Stripped of all royal titles and military affiliations by King Charles. PM Starmer publicly stated Andrew should cooperate with investigators. Civil lawsuit settled for reported £12M to Virginia Giuffre. Royal Lodge residence reportedly being transferred.", date: "Oct 2025", profileId: "andrew-mw", type: "stripped" },
  { name: "Alexander Acosta", role: "U.S. Secretary of Labor", action: "Forced to resign in July 2019 after Julie K. Brown's reporting exposed the full scope of the 2008 plea deal he negotiated. Trump initially defended him but accepted resignation after bipartisan criticism. The deal Acosta signed gave immunity to unnamed co-conspirators.", date: "Jul 2019", profileId: "alexander-acosta", type: "resignation" },
  { name: "Leon Black", role: "CEO, Apollo Global Management", action: "Stepped down as Apollo CEO after investigation confirmed $158M in payments to Epstein (2012-2017) for 'financial advice.' Independent review found payments were 'not illegal' but Black resigned citing 'distraction.' Apollo later settled with USVI for $62.5M.", date: "Mar 2021", profileId: "leon-black", type: "resignation" },
  { name: "Jes Staley", role: "Barclays CEO / Former JPMorgan Private Banking Head", action: "Resigned from Barclays in 2021 when FCA investigation launched. UK FCA subsequently banned him from financial services and fined £1.8M. 2025 tribunal revealed 1,200+ emails with Epstein and that he slept with an Epstein assistant. JPMorgan paid $365M in settlements partly due to Staley's role as Epstein's primary banking contact.", date: "2021-2025", profileId: "jes-staley", type: "banned" },
  { name: "Brad Karp", role: "Chairman, Paul Weiss (law firm)", action: "Resigned chairmanship of one of America's most powerful law firms after email exchanges with Epstein became public in file releases. Paul Weiss had represented multiple Epstein-connected clients.", date: "Feb 2026", type: "resignation" },
  { name: "Miroslav Lajčák", role: "Slovakia National Security Adviser", action: "Resigned after opposition pressure following file release. Former UN General Assembly president named in Epstein's contact records.", date: "Jan 31, 2026", type: "resignation" },
  { name: "Joanna Rubinstein", role: "Chair, Sweden for UNHCR", action: "Resigned after files revealed she visited Epstein's island in 2012 — 4 years after his conviction.", date: "Feb 2, 2026", type: "resignation" },
  { name: "Jean-Luc Brunel", role: "Model Agent / Named FBI Co-Conspirator", action: "Arrested Dec 2020 at Charles de Gaulle airport attempting to flee France. Charged with rape of minors and sex trafficking. Found hanged in La Santé Prison Feb 19, 2022 — days before he was scheduled to testify. Death circumstances mirrored Epstein's. Investigation closed within weeks.", date: "Feb 2022", profileId: "jean-luc-brunel", type: "death" },
  { name: "Virginia Giuffre", role: "Primary accuser / Lead survivor advocate", action: "Died by suicide at age 41 in Australia, April 2025. Had been Epstein's most prominent accuser, filing lawsuits against Andrew, Dershowitz, and others. Her testimony was central to the Maxwell trial. Survivors' advocates noted the immense psychological toll of decades of public litigation.", date: "Apr 2025", type: "death" },
  { name: "David Copperfield", role: "Illusionist / Las Vegas Headliner", action: "Facing public calls and Vital Vegas campaign to cancel his MGM Grand residency show. Named by Sjoberg in testimony. Epstein pleaded the Fifth when asked if he shared underage girls with Copperfield. 2025 victim alleged improper touching.", date: "Feb 2026", profileId: "david-copperfield", type: "public_pressure" },
  { name: "Bill Richardson", role: "Former NM Governor / Energy Secretary", action: "Died Sept 2023 at age 75, before major file releases. Had been named by Virginia Giuffre. Denied all allegations throughout his life. Death meant he could never be questioned or face accountability.", date: "Sep 2023", profileId: "bill-richardson", type: "death" },
  { name: "JPMorgan Chase", role: "Epstein's primary bank (1998-2013)", action: "Paid $365M in settlements ($290M to victims, $75M to USVI) for maintaining Epstein as client despite filing 150 suspicious activity reports. No executives faced personal consequences. Bank generated $8M+ in fees from Epstein accounts.", date: "Jun-Sep 2023", type: "settlement" },
  { name: "Deutsche Bank", role: "Epstein's bank after JPMorgan (2013-2018)", action: "Paid $75M settlement to victims for maintaining Epstein as client AFTER his conviction and AFTER JPMorgan dropped him. Bank's compliance systems flagged concerns that were overruled by relationship managers.", date: "May 2023", type: "settlement" },
  { name: "Ghislaine Maxwell", role: "Convicted sex trafficker", action: "Found guilty Dec 2021 on 5 of 6 federal charges including sex trafficking of a minor. Sentenced to 20 years. Appeal denied 2024. Currently incarcerated at FCI Tallahassee. Only associate of Epstein to face federal prosecution.", date: "Dec 2021", profileId: "ghislaine-maxwell", type: "conviction" },
  { name: "Two MCC Guards", role: "Metropolitan Correctional Center staff", action: "Tova Noel and Michael Thomas charged with falsifying records and conspiracy. Both admitted to sleeping during shifts and fabricating wellness check logs. Accepted deferred prosecution agreements — no jail time.", date: "2021", type: "plea_deal" },
];

// ═══════════════════════════════════════════════════════
// CONTRADICTIONS DATA (cross-profile)
// ═══════════════════════════════════════════════════════
const CONTRADICTIONS = [
  { person: "elon-musk", claim: "'Epstein tried to get me to go to his island and I REFUSED.'", claimDate: "2025", evidence: "Emails show island visit scheduled Dec 6, 2014. Epstein invited for Christmas 'again' — implying prior visits. Helicopter ride discussed.", evidenceSource: "DOJ Files — emails", profileId: "elon-musk" },
  { person: "howard-lutnick", claim: "Told NY Post he cut ties with Epstein in 2005 after seeing his 'disgusting' massage room.", claimDate: "Oct 2024", evidence: "2011: phone calls and drinks. 2012: island visit with family, business deal signed with Epstein. 2014: construction correspondence. 2015: invited Epstein to Clinton fundraiser.", evidenceSource: "DOJ Files — emails, contracts", profileId: "howard-lutnick" },
  { person: "sarah-ferguson", claim: "'Nothing ever to do with Jeffrey Epstein ever again.'", claimDate: "2011", evidence: "Two months later, emailed Epstein seeking advice on Oprah appearance about how to answer Epstein questions.", evidenceSource: "DOJ Files — emails", profileId: "sarah-ferguson" },
  { person: "donald-trump", claim: "'I barely knew the guy.' Claimed friendship ended ~2004.", claimDate: "Various", evidence: "8 flights 1993-1996. 1997: 'You are the greatest!' inscription. 2002: 'Terrific guy... likes beautiful women as much as I do, many on the younger side.' 3,000+ mentions in files.", evidenceSource: "Flight logs, NY Mag, DOJ Files", profileId: "donald-trump" },
  { person: "richard-branson", claim: "Dealings were 'limited to group or business settings.'", claimDate: "Feb 2026", evidence: "2013: 'As long as you bring your harem!' Advised Epstein on image rehabilitation through Bill Gates.", evidenceSource: "DOJ Files — emails", profileId: "richard-branson" },
  { person: "bill-clinton", claim: "Spokesperson: 'Four trips' on Epstein's plane for Foundation work. 'Knows nothing about terrible crimes.'", claimDate: "2019", evidence: "Flight logs show more extensive travel. 2009: at Maxwell's after-party. 2010: Maxwell at Chelsea's wedding. Epstein pleaded Fifth on every Clinton question.", evidenceSource: "Flight logs, DOJ Files", profileId: "bill-clinton" },

  { person: "jeff-bezos", claim: "No public statement or response to Epstein connections.", claimDate: "N/A", evidence: "Oct 2009: at Maxwell's house with Clinton. 2018: Maxwell attended Bezos's exclusive 'Campfire' retreat at least 3 times.", evidenceSource: "DOJ Files, CNBC", profileId: "jeff-bezos" },
  { person: "jes-staley", claim: "Told FCA/Barclays he 'did not have a close relationship' with Epstein and last contact was 'well before' joining Barclays.", claimDate: "2019", evidence: "1,000+ emails. Called friendship 'profound.' 'Snow White' messages. Continued contact through Barclays tenure.", evidenceSource: "FCA tribunal, 1,200 emails", profileId: "jes-staley" },

];

const MONEY_TOTALS = [
  { entity: "SpaceX (Musk)", amount: "$38B+", amountNum: 38e9, detail: "Total govt funding (WaPo). $20B+ contracts, $9B paid.", person: "elon-musk", source: "Washington Post" },
  { entity: "Palantir (Thiel)", amount: "$12B+", amountNum: 12e9, detail: "$10B Army + $1.3B Maven + $248M ICE + classified", person: "peter-thiel", source: "CNBC, DefenseScoop" },
  { entity: "Microsoft (Gates)", amount: "$10B+", amountNum: 10e9, detail: "JEDI/JWCC cloud + federal IT", person: "bill-gates", source: "USASpending.gov" },
  { entity: "U.S. Navy (Phelan)", amount: "$255.8B", amountNum: 255.8e9, detail: "FY2025 Navy + Marines budget", person: "john-phelan", source: "DoD Budget" },
  { entity: "Commerce Dept (Lutnick)", amount: "$12.9B", amountNum: 12.9e9, detail: "FY2025 Commerce budget", person: "howard-lutnick", source: "Commerce.gov" },
  { entity: "CMS (Oz)", amount: "$1.5T", amountNum: 1.5e12, detail: "Medicare/Medicaid annual spending", person: "mehmet-oz", source: "CMS.gov" },
  { entity: "Executive Branch (Trump)", amount: "$6.75T", amountNum: 6.75e12, detail: "Full FY2025 federal budget", person: "donald-trump", source: "OMB" },
  { entity: "Google (Brin)", amount: "Billions", amountNum: 5e9, detail: "DoD cloud, intelligence, federal IT", person: "sergey-brin", source: "USASpending" },
  { entity: "Former Presidents (Clinton)", amount: "$24M+", amountNum: 24e6, detail: "24+ years of benefits", person: "bill-clinton", source: "CRS Reports" },

  { entity: "Amazon/Blue Origin (Bezos)", amount: "$13.4B+", amountNum: 13.4e9, detail: "AWS CIA $600M + JWCC $9B cloud + Blue Origin $3.4B lunar", person: "jeff-bezos", source: "USASpending, NASA" },
  { entity: "JPMorgan (Staley era)", amount: "$365M settlements", amountNum: 365e6, detail: "$290M victims + $75M USVI for enabling Epstein", person: "jes-staley", source: "Court records" },
  { entity: "Apollo (Black/Harris)", amount: "$158M to Epstein + $62.5M settlement", amountNum: 220.5e6, detail: "Black paid Epstein $158M. Apollo settled $62.5M with USVI.", person: "josh-harris", source: "WSJ, court records" },
  { entity: "Deutsche Bank", amount: "$75M settlement", amountNum: 75e6, detail: "Settled with Epstein victims May 2023", person: "N/A", source: "Reuters, court records" },

];

const UNANSWERED = [
  { q: "Who are the 3 unidentified co-conspirators?", detail: "FBI identified 10 co-conspirators in July 2019. Seven names are now known (Maxwell, Brunel, Wexner, Kellen, Groff, Ross, Marcinkova). Three remain completely redacted. DOJ has never explained why these names are withheld even after the Transparency Act.", status: "REDACTED", source: "DOJ Files, FBI emails July 2019" },
  { q: "Where are the prosecution memos?", detail: "Internal DOJ memos describing which co-conspirators could be charged — and on what evidence — were referenced in released documents but never included in any release. These would reveal who prosecutors believed was criminally liable and why charges weren't brought.", status: "WITHHELD", source: "Khanna-Massie letter to AG" },
  { q: "Where are the FBI victim interviews (302s)?", detail: "FBI Form 302s document witness/victim interviews in detail. Lawmakers specifically requested these. They would contain victims' accounts of which powerful individuals were involved. DOJ has not released them despite the Transparency Act.", status: "WITHHELD", source: "Khanna-Massie letter, CNN" },
  { q: "What's in the draft indictment from the 2000s?", detail: "A draft federal indictment from the mid-2000s would have charged 3+ individuals alongside Epstein. The document exists in DOJ files but names are redacted. This indictment was prepared before Acosta's plea deal killed the federal case.", status: "REDACTED", source: "CNN, DOJ Files" },
  { q: "Why weren't co-conspirators charged after the plea deal was voided?", detail: "In 2015, Judge Marra ruled the 2008 plea deal violated victims' rights. In 2019, SDNY brought new charges against Epstein. But Kellen, Groff, Ross, and Marcinkova — who received immunity under the voided deal — were never subsequently charged. No explanation has been given.", status: "UNANSWERED", source: "Court records, CVRA ruling" },
  { q: "What's in the other 3 million pages?", detail: "DOJ acknowledged 6M pages may qualify for release under the Transparency Act but released only 3M, calling it the 'final' release. Reps. Khanna and Massie wrote that FBI victim interviews, draft indictments, and prosecution memos are among the withheld materials.", status: "WITHHELD", source: "DOJ letter to Congress, Khanna-Massie" },
  { q: "Who visited the island — and when?", detail: "Complete visitor logs for Little St. James island have never been released. Only partial flight manifests from Epstein's jets are available. The island had a helipad, and visitors also arrived by boat — those records have never surfaced. The full picture of who went there remains unknown.", status: "UNRELEASED", source: "Multiple outlets, court records" },
  { q: "What happened to the MCC surveillance footage?", detail: "Camera footage from directly outside Epstein's cell was deemed 'unusable' due to a technical failure. AG Barr said he personally reviewed footage from adjacent cameras and was satisfied it was suicide. The footage has never been released publicly. The facility had known camera and security issues predating Epstein.", status: "CLOSED — QUESTIONS REMAIN", source: "DOJ IG report, AG Barr statements" },
  { q: "What was on the hard drives seized from Epstein's safe?", detail: "When FBI raided Epstein's NYC townhouse in July 2019, they found a locked safe containing CDs/DVDs labeled with names (including a young woman's name + specific man's name), loose diamonds, an expired Austrian passport with Epstein's photo but a different name, and cash. The contents of these recordings have never been disclosed.", status: "UNRELEASED", source: "SDNY evidence filing, court records" },
  { q: "Why was Brunel's death investigation closed so quickly?", detail: "Jean-Luc Brunel — a named FBI co-conspirator — was found hanged in his French prison cell on Feb 19, 2022, days before he was scheduled to testify. His death closely mirrored Epstein's: hanging, guards not checking, cameras not capturing. French authorities concluded suicide within weeks. No independent investigation was conducted.", status: "CLOSED — QUESTIONS REMAIN", source: "French court records, multiple outlets" },
  { q: "What were Epstein's intelligence connections?", detail: "Multiple credible reports suggest Epstein had connections to intelligence agencies. Former Israeli PM Ehud Barak was a frequent visitor. AG Barr's father hired Epstein at Dalton School in 1974 despite no teaching degree. Acosta reportedly told transition team the plea deal happened because Epstein 'belonged to intelligence.' The full scope has never been investigated publicly.", status: "UNANSWERED", source: "Vicky Ward (Daily Beast), court depositions" },
  { q: "Where is Maxwell's rumored evidence trove?", detail: "Multiple reports indicated Maxwell maintained her own records and potential leverage material. During her arrest, FBI seized electronic devices. The full contents have never been disclosed. Maxwell's attorneys referenced 'materials' during proceedings that remain under seal.", status: "UNRELEASED", source: "Court filings, multiple outlets" },
];

const CONGRESSIONAL = [
  { name: "Ro Khanna (D-CA)", action: "Co-led bipartisan Transparency Act push. Wrote joint letter with Massie demanding FBI 302s, draft indictments, and prosecution memos. Called DOJ's 3M page release 'insufficient' when 6M qualify. Consistent advocate since 2023.", stance: "pro", party: "D" },
  { name: "Thomas Massie (R-KY)", action: "Co-led with Khanna from the Republican side. Called DOJ release 'a fraction of what exists.' Introduced amendment requiring release of FBI victim interview notes. One of the most vocal bipartisan voices.", stance: "pro", party: "R" },
  { name: "Chuck Schumer (D-NY)", action: "Senate floor speech: 'Who are the 10 co-conspirators? Why haven't we seen those memos? Where are the grand jury records?' Demanded DOJ explain why only 1 of 10 co-conspirators was ever charged.", stance: "pro", party: "D" },
  { name: "Tim Scott (R-SC)", action: "Called for full transparency in Senate remarks. Supported bipartisan release efforts.", stance: "pro", party: "R" },
  { name: "Jamie Raskin (D-MD)", action: "Called for lawmakers to review unredacted files in a secure setting. Ranking member on House Oversight. Pushed for subpoena authority.", stance: "pro", party: "D" },
  { name: "James Comer (R-KY)", action: "As House Oversight Chair, authorized subpoenas for Maxwell, Clinton, and Wexner. Oversaw release of tens of thousands of committee pages.", stance: "pro", party: "R" },
  { name: "Anna Paulina Luna (R-FL)", action: "Among the most vocal House members demanding full file release. Called for investigation into DOJ's redaction failures.", stance: "pro", party: "R" },
  { name: "Ted Cruz (R-TX)", action: "Co-sponsored Senate transparency legislation. Called for accountability for all individuals named in files regardless of political affiliation.", stance: "pro", party: "R" },
  { name: "House Oversight Committee", action: "Subpoenaed Maxwell, Clinton, Wexner in Feb 2026. Released tens of thousands of pages of committee investigation records. Bipartisan vote.", stance: "pro", party: "Bipartisan" },
  { name: "Pam Bondi (AG)", action: "Called Jan 30 release 'final' and 'fully compliant' with Transparency Act. Survivors' attorneys dispute both claims, noting 3M of 6M qualifying pages remain withheld. Did not address the redaction failures proactively.", stance: "mixed", party: "R" },
  { name: "Todd Blanche (Deputy AG)", action: "Publicly stated redaction errors affected only '.001%' of materials. Survivors' attorneys called this characterization 'insulting' given 43+ victims' names were exposed. Did not explain how nude images of possible minors were published.", stance: "mixed", party: "R" },
  { name: "Kash Patel (FBI Dir)", action: "Testified before Senate and House Judiciary Committees in Sept-Oct 2025. Addressed FBI's role in file review process. Has not publicly called for release of FBI 302s or prosecution memos.", stance: "neutral", party: "R" },
  { name: "Most of Congress", action: "The Transparency Act passed 427-1 in the House and unanimously in the Senate. Yet the vast majority of members have made no public statements demanding DOJ release the other 3M withheld pages or explain why only 1 of 10 co-conspirators was charged.", stance: "silent", party: "Both" },
];

const CORRECTIONS_LOG = [
  { date: "Feb 8, 2026", entry: "Initial build: 26 profiles compiled from DOJ files, court records, and corroborated journalism." },
  { date: "Feb 8, 2026", entry: "DOJ categorization note: DOJ called certain allegations about Trump 'unfounded and false.' Noted in Trump profile." },
  { date: "Feb 8, 2026", entry: "Wexner clarification: named in FBI email discussing co-conspirators. Not charged. Lawyer says he cooperated fully." },
  { date: "Feb 8, 2026", entry: "Phelan clarification: friend claims he didn't know it was Epstein's plane. This is noted alongside the flight manifest evidence." },
  { date: "Feb 9, 2026", entry: "V5 expansion: Added 19 new profiles from Phase 1 research. Total now 45 profiles. All sourced to DOJ files, court records, and corroborated journalism." },
  { date: "Feb 9, 2026", entry: "Added Corporate Enablers section: JPMorgan ($365M settlements), Deutsche Bank ($75M), Apollo ($62.5M), Paul Weiss, Victoria's Secret/L Brands, MC2 Model Management." },
  { date: "Feb 9, 2026", entry: "Dershowitz clarification: Giuffre accused him of trafficking, then said in 2022 she 'may have made a mistake.' No money exchanged. Dershowitz denies all allegations." },
  { date: "Feb 9, 2026", entry: "Brunel clarification: full profile added. Named FBI co-conspirator. Died in prison Feb 2022 before trial. Not convicted." },
  { date: "Feb 9, 2026", entry: "Staley clarification: FCA banned him from financial services. JPMorgan paid $365M in settlements. Staley denied knowledge of trafficking." },
];



// ═══════════════════════════════════════════════════════
// VICTIM DATA & ACCOUNTABILITY METRICS
// ═══════════════════════════════════════════════════════
const VICTIM_STATS = {
  identified: 150,
  minors: "100+",
  countries: 3,
  yearsActive: "1994-2019",
  civilSuits: 60,
  settlementTotal: "$577.5M+",
  averageAge: "14-16",
  unnamed: "Potentially thousands",
  quote: "I was 14 years old. I was told I was going to get a modeling job.",
  quoteSource: "Victim testimony, Southern District of NY, 2019"
};

const ACCOUNTABILITY_SCORE = {
  namedInFiles: 67,
  facedQuestions: 12,
  facedLegalConsequences: 4,
  currentlyProsecuted: 1,
  servedTime: 2,
  stillInPower: 18,
  govPositions: 8,
  billionaires: 11,
  acquitted: 0,
  deathsBeforeTrial: 2,
  categories: [
    { label: "Named in Files", count: 67, color: "#3b82f6" },
    { label: "Faced Any Legal Consequence", count: 4, color: "#f59e0b" },
    { label: "Currently Serving Time", count: 1, color: "#ef4444" },
    { label: "Deaths Before Trial", count: 2, color: "#666" },
  ]
};

const JUXTAPOSE_TIMELINE = [
  { year: 2001, public: "Bill Clinton leaves presidency, begins global humanitarian work", private: "Clinton takes 4+ flights on Epstein's jet, visits island per Virginia Giuffre", person: "bill-clinton" },
  { year: 2003, public: "Bill Gates launches Global Health initiative, saves millions of lives", private: "Gates begins meetings with Epstein; visits Manhattan townhouse multiple times", person: "bill-gates" },
  { year: 2006, public: "Palm Beach police compile 40+ victim statements against Epstein", private: "Alexander Acosta negotiates secret plea deal with Epstein's lawyers", person: "alexander-acosta" },
  { year: 2008, public: "Epstein pleads guilty to state charges, serves 13 months with work release", private: "Alan Dershowitz helped negotiate plea that shields co-conspirators from federal prosecution", person: "alan-dershowitz" },
  { year: 2008, public: "JPMorgan files 150 currency transaction reports on Epstein's accounts", private: "Bank keeps Epstein as client for 5 more years, generates $8M+ revenue", person: "jes-staley" },
  { year: 2009, public: "Elon Musk publicly denies close ties to Epstein", private: "Photo surfaces of Musk with Maxwell at 2014 Vanity Fair party; Musk confirms brief meeting", person: "elon-musk" },
  { year: 2010, public: "Prince Andrew serves as UK Special Trade Envoy", private: "Andrew stays at Epstein's NYC home, photographed walking in Central Park with convicted Epstein", person: "andrew-mw" },
  { year: 2010, public: "George Stephanopoulos anchors ABC's This Week, covers political ethics", private: "Attends dinner at Epstein's Manhattan townhouse with Prince Andrew and Woody Allen", person: "george-stephanopoulos" },
  { year: 2011, public: "Leon Black becomes Apollo Global CEO, manages $500B+ in assets", private: "Begins paying Epstein $158M for 'financial advice' over next 6 years", person: "leon-black" },
  { year: 2013, public: "Jes Staley appointed CEO of Barclays, pledges ethical leadership", private: "1,000+ emails with Epstein, describes relationship as 'profound'", person: "jes-staley" },
  { year: 2014, public: "Reid Hoffman celebrates LinkedIn IPO success, promotes ethical tech", private: "Sends gifts to Epstein's home including ice cream 'for the girls'", person: "reid-hoffman" },
  { year: 2015, public: "Howard Lutnick receives humanitarian awards for 9/11 charity work", private: "Epstein emails reference Lutnick as someone who 'ichanneled money through' for access", person: "howard-lutnick" },
  { year: 2017, public: "Dr. Oz airs episodes on child safety and predator awareness", private: "Appears on Epstein's private calendar, specific context unclear", person: "mehmet-oz" },
  { year: 2018, public: "Ghislaine Maxwell attends Jeff Bezos's exclusive 'Campfire' retreat", private: "Maxwell is under active FBI investigation; arrested 2 years later", person: "jeff-bezos" },
  { year: 2019, public: "Epstein arrested on federal trafficking charges", private: "Found dead in cell under circumstances both AG Barr and medical examiner dispute", person: "ghislaine-maxwell" },
  { year: 2022, public: "Jean-Luc Brunel awaits trial on rape charges in France", private: "Found hanged in La Santé Prison, mirroring Epstein's death — before testifying", person: "jean-luc-brunel" },
  { year: 2025, public: "Howard Lutnick confirmed as U.S. Secretary of Commerce", private: "Epstein files show documented financial relationship; Lutnick denies meaningful connection", person: "howard-lutnick" },
  { year: 2025, public: "Dr. Oz nominated to oversee $1.5T in Medicare/Medicaid", private: "Name appears in Epstein calendar entries; no public explanation offered", person: "mehmet-oz" },
];

const SEALED_INFO = {
  totalPages: "6,000,000+",
  pagesReleased: "~50%",
  stillSealed: "~3,000,000",
  redactedNames: "200+",
  pendingCases: 3,
  foiaRequests: "Dozens pending",
  grandJurySealed: true,
  items: [
    { what: "Full Flight Logs", status: "Partially Released", detail: "Only select pages from 1995-2013. Multiple log books remain sealed.", urgency: "high" },
    { what: "Complete Black Book", status: "Partially Released", detail: "Original contained 1,571 names. Only ~200 have been publicly confirmed.", urgency: "high" },
    { what: "Grand Jury Testimony", status: "Sealed", detail: "2006 Palm Beach grand jury proceedings remain entirely sealed.", urgency: "critical" },
    { what: "FBI Investigation Files", status: "Classified", detail: "Full scope of FBI's investigation into co-conspirators has never been disclosed.", urgency: "critical" },
    { what: "Financial Transaction Records", status: "Partially Released", detail: "JPMorgan's 150 SARs and Deutsche Bank records — most details still redacted.", urgency: "high" },
    { what: "Epstein's Personal Recordings", status: "Unknown", detail: "Multiple sources report Epstein recorded visitors at his properties. Tapes have never surfaced.", urgency: "critical" },
    { what: "Foreign Intelligence Connections", status: "Classified", detail: "Multiple reports suggest intelligence agency ties. AG Barr stated he 'personally reviewed' footage.", urgency: "high" },
    { what: "Maxwell Trial Exhibits", status: "Partially Sealed", detail: "Dozens of exhibits shown to jury were never released publicly.", urgency: "medium" },
    { what: "Civil Lawsuit Depositions", status: "Mixed", detail: "Hundreds of hours of depositions. Many remain under protective orders.", urgency: "medium" },
    { what: "2008 Plea Deal Full Terms", status: "Partially Sealed", detail: "Non-prosecution agreement protections for unnamed co-conspirators. Full list never disclosed.", urgency: "critical" },
  ]
};

const ACTION_ITEMS = [
  {
    category: "Contact Your Representatives",
    icon: "🏛",
    items: [
      { action: "Call your Senator", detail: "Ask them to co-sponsor full Epstein file declassification. The Epstein Files Transparency Act has bipartisan support.", link: "https://www.senate.gov/senators/senators-contact.htm", effort: "5 min" },
      { action: "Call your House Rep", detail: "Ask about their position on the sealed grand jury transcripts and complete flight log release.", link: "https://www.house.gov/representatives/find-your-representative", effort: "5 min" },
      { action: "Write to the DOJ", detail: "Request full FOIA disclosure of remaining Epstein investigation files.", link: "https://www.justice.gov/oip", effort: "15 min" },
    ]
  },
  {
    category: "Vote with Information",
    icon: "🗳",
    items: [
      { action: "Check your officials", detail: "Use this tool to see which of your elected officials appear in the files or have blocked transparency.", effort: "2 min" },
      { action: "Primary accountability", detail: "In primary elections, prioritize candidates who support full disclosure over those who've blocked it.", effort: "Ongoing" },
      { action: "Track votes", detail: "Follow congressional votes on transparency legislation. Hold representatives accountable at the ballot box.", effort: "Ongoing" },
    ]
  },
  {
    category: "Support Survivors",
    icon: "💛",
    items: [
      { action: "RAINN", detail: "The nation's largest anti-sexual violence organization. Operates the National Sexual Assault Hotline.", link: "https://www.rainn.org", effort: "Any amount" },
      { action: "National Center for Missing & Exploited Children", detail: "Works to prevent child exploitation and find missing children.", link: "https://www.missingkids.org", effort: "Any amount" },
      { action: "Courtney's House", detail: "Helps domestic child sex trafficking survivors in the D.C. area.", link: "https://www.courtneyshouse.org", effort: "Any amount" },
    ]
  },
  {
    category: "Spread Awareness",
    icon: "📢",
    items: [
      { action: "Share verified information", detail: "Share this tool and sourced documents — not viral lists. Misinformation helps the powerful by discrediting real accountability.", effort: "2 min" },
      { action: "Correct misinformation", detail: "When you see the fake '166 names' list, point people to verified sources. PolitiFact found 129 of those had no file connection.", effort: "5 min" },
      { action: "Follow FOIA journalists", detail: "Julie K. Brown (Miami Herald), who broke the story. Support investigative journalism with subscriptions.", effort: "Ongoing" },
    ]
  },
];

const STILL_IN_POWER = [
  { id: "donald-trump", position: "President of the United States", controls: "$6.75T federal budget", confirmed: true },
  { id: "elon-musk", position: "DOGE Lead / SpaceX-Tesla CEO", controls: "$38B+ government contracts", confirmed: true },
  { id: "howard-lutnick", position: "Secretary of Commerce", controls: "$12B+ department budget", confirmed: true },
  { id: "mehmet-oz", position: "CMS Administrator (nominated)", controls: "$1.5T Medicare/Medicaid", confirmed: true },
  { id: "john-phelan", position: "Secretary of the Navy", controls: "$255B Navy budget", confirmed: true },
  { id: "peter-thiel", position: "Palantir Chairman, GOP Donor", controls: "$10B+ federal contracts", confirmed: true },
  { id: "jeff-bezos", position: "Amazon/Blue Origin CEO", controls: "$10B+ federal contracts", confirmed: true },
  { id: "eric-schmidt", position: "AI Policy Advisor, Tech Investor", controls: "Nat'l Security Commission influence", confirmed: true },
  { id: "reid-hoffman", position: "LinkedIn Co-Founder, Major Dem Donor", controls: "Political fundraising influence", confirmed: true },
  { id: "larry-summers", position: "Economic Advisor, Harvard Professor", controls: "Policy influence", confirmed: true },
  { id: "sergey-brin", position: "Google Co-Founder", controls: "$10B+ federal contracts (Alphabet)", confirmed: true },
  { id: "richard-branson", position: "Virgin Group Chairman", controls: "Government space contracts", confirmed: true },
  { id: "casey-wasserman", position: "LA 2028 Olympics Chairman", controls: "$6.9B public infrastructure", confirmed: true },
  { id: "josh-harris", position: "Commanders/76ers Owner, Apollo", controls: "$700B+ assets under management", confirmed: true },
  { id: "david-copperfield", position: "Las Vegas Headliner", controls: "Public entertainment platform", confirmed: true },
  { id: "kathryn-ruemmler", position: "Goldman Sachs General Counsel", controls: "Major Wall St legal authority", confirmed: true },
  { id: "deepak-chopra", position: "Author/Wellness Brand CEO", controls: "Public health influence", confirmed: true },
  { id: "steven-tisch", position: "NY Giants Co-Owner, Film Producer", controls: "Media & sports platform", confirmed: true },
];

// ═══════════════════════════════════════════════════════
// CORPORATE ENABLERS DATA
// ═══════════════════════════════════════════════════════

const CORPORATE_ENABLERS = [
  {
    name: "JPMorgan Chase",
    role: "Epstein's Primary Bank (1998-2013)",
    detail: "Held Epstein's accounts for 15 years. Filed 150 currency transaction reports but kept him as client. Jes Staley managed relationship. Bank generated $8M+ revenue from Epstein. Epstein made $1B+ in transactions through the bank. SAR (Suspicious Activity Reports) filed as early as 2002 but no action taken. JPMorgan denied knowledge of crimes but internal email called Epstein's guests 'nymphettes.'",
    settlement: "$290M to victims (Jun 2023) + $75M to USVI (Sep 2023) = $365M total",
    settlementNum: 365e6,
    status: "Settled — no admission of wrongdoing",
    key_people: ["Jes Staley (Private Banking Chief)", "Mary Erdoes (Asset Mgmt Chief)", "Jamie Dimon (CEO — said he barely knew Epstein)", "Sandy Warner (former CEO — introduced Staley to Epstein)"],
    source: "Court filings, CNBC, CNN"
  },
  {
    name: "Deutsche Bank",
    role: "Epstein's Bank After JPMorgan (2013-2018)",
    detail: "Took on Epstein as client AFTER JPMorgan dropped him post-conviction. Maintained relationship until 2018. Internal compliance flagged Epstein but management overrode concerns. Filed multiple SARs. Processed hundreds of millions in transactions.",
    settlement: "$75M to Epstein victims (May 2023)",
    settlementNum: 75e6,
    status: "Settled — no admission of wrongdoing",
    key_people: ["Senior compliance staff raised concerns", "Management override details sealed"],
    source: "Court records, Reuters"
  },
  {
    name: "Apollo Global Management",
    role: "Leon Black's Firm — $158M in Payments to Epstein",
    detail: "Co-founder Leon Black paid Epstein $158M from 2012-2017 for 'financial advice.' Black stepped down as CEO in 2021 after payments revealed. Apollo later settled with USVI for $62.5M. Josh Harris, another co-founder, appeared in latest files. Internal power struggle between Black and Harris over Epstein fallout.",
    settlement: "$62.5M to USVI (2023)",
    settlementNum: 62.5e6,
    status: "Settled — Black resigned",
    key_people: ["Leon Black (former CEO — $158M payments)", "Josh Harris (co-founder — appeared in files)", "Marc Rowan (successor CEO)"],
    source: "WSJ, court records, Fortune"
  },
  {
    name: "Paul Weiss (Law Firm)",
    role: "Chairman Brad Karp had email exchanges with Epstein",
    detail: "Brad Karp, chairman of elite law firm Paul Weiss, had email exchanges with Epstein that became public in the files. Karp resigned chairmanship. Paul Weiss is one of the most powerful law firms in the country, representing major corporations and government entities.",
    settlement: "N/A",
    settlementNum: 0,
    status: "Chairman resigned — no institutional charges",
    key_people: ["Brad Karp (former Chairman — resigned)"],
    source: "DOJ Files, legal press"
  },
  {
    name: "Victoria's Secret / L Brands",
    role: "Epstein Posed as Recruiter to Lure Victims",
    detail: "Epstein used his connection to Les Wexner to pose as a Victoria's Secret recruiter to lure young women. Multiple victims reported being approached with promises of modeling careers. Epstein's NYC mansion, private jet, and lifestyle all originally came from Wexner through L Brands connection.",
    settlement: "N/A — Wexner subpoenaed by Congress",
    settlementNum: 0,
    status: "Under investigation — Wexner subpoenaed Feb 2026",
    key_people: ["Leslie Wexner (CEO — gave Epstein power of attorney)", "Epstein used VS brand to recruit victims"],
    source: "Court filings, DOJ Files, Congress"
  },
  {
    name: "MC2 Model Management",
    role: "Brunel's Agency — Funded by Epstein",
    detail: "Founded by Jean-Luc Brunel with $1M from Epstein. Bookkeeper testified agency 'arranged visas for girls travelling to the US from Eastern Europe' and that 'MC2 girls became frequent guests on Epstein's private jets.' Operated in Miami, New York, and Tel Aviv. Dissolved Sept 2019 after Epstein's death.",
    settlement: "N/A — Brunel died in prison",
    settlementNum: 0,
    status: "Dissolved 2019 — Brunel died 2022",
    key_people: ["Jean-Luc Brunel (founder — died in prison)", "Clients included Nordstrom, Macy's, Target"],
    source: "Court filings, Daily Beast, Wikipedia"
  },
];

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function EpsteinIndex() {
  const [page, setPage] = useState("landing");
  const [ap, setAp] = useState("donald-trump");
  const [exp, setExp] = useState(null);
  const [tab, setTab] = useState("timeline");
  const [search, setSearch] = useState("");
  const [fConv, setFConv] = useState("all");
  const [fType, setFType] = useState("all");
  const [comp, setComp] = useState(null);
  const [showDisc, setShowDisc] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgErr, setImgErr] = useState({});
  const [moneyMin, setMoneyMin] = useState(0);
  const [mtYear, setMtYear] = useState("all");
  const [powerFilter, setPowerFilter] = useState("all");
  const [actionExpanded, setActionExpanded] = useState(null);

  const profile = P[ap];
  const keys = Object.keys(P);
  const filtered = keys.filter(k => P[k].name.toLowerCase().includes(search.toLowerCase()) || P[k].cat.toLowerCase().includes(search.toLowerCase()));

  // Master timeline: all events sorted chronologically
  const masterTL = useMemo(() => {
    const all = [];
    Object.entries(P).forEach(([id, p]) => p.tl.forEach(e => all.push({ ...e, personId: id, personName: p.name })));
    return all.sort((a, b) => a.year - b.year);
  }, []);

  // Network graph data
  const networkData = useMemo(() => {
    const nodes = Object.entries(P).map(([id, p]) => ({ id, name: p.name, cat: p.cat, events: p.tl.length, init: p.init }));
    const edges = []; const seen = new Set();
    Object.entries(P).forEach(([id, p]) => {
      (p.conn || []).forEach(c => {
        const key = [id, c].sort().join("-");
        if (!seen.has(key) && P[c]) { seen.add(key); edges.push({ from: id, to: c }); }
      });
    });
    return { nodes, edges };
  }, []);

  const filterTL = (tl) => {
    let f = tl;
    if (fConv === "before") f = f.filter(e => e.year < CY);
    if (fConv === "after") f = f.filter(e => e.year >= CY);
    if (fType !== "all") f = f.filter(e => e.type === fType);
    return f;
  };

  const go = (id) => { setAp(id); setExp(null); setTab("timeline"); setFConv("all"); setFType("all"); setComp(null); setPage("profiles"); };

  const ProfileImg = ({ id, size = 44 }) => {
    const url = PHOTOS[id];
    if (url && !imgErr[id]) {
      return <img src={url} alt={P[id]?.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${gold}`, flexShrink: 0 }} onError={() => setImgErr(p => ({...p, [id]: true}))} />;
    }
    return <div style={{ width: size, height: size, borderRadius: "50%", background: "#1a1a2e", border: `2px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontSize: size * 0.3, fontWeight: 700, color: gold, flexShrink: 0 }}>{P[id]?.init || "?"}</div>;
  };

  const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0a0c}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}body{background:#0a0a0c}`;

    // eslint-disable-next-line no-unused-vars
  const totalActive = MONEY_TOTALS.length;
  const totalEvents = Object.values(P).reduce((a, p) => a + p.tl.length, 0);

  // ═══ LANDING ═══
  if (page === "landing") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif }}>
        <style>{CSS}</style>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.25em", color: gold, textTransform: "uppercase", marginBottom: 16 }}>A Public Accountability Project</div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.02em" }}>The Epstein<br />Index</h1>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "#999", maxWidth: 620, marginBottom: 20, fontFamily: sans }}>A sourced, transparent investigation into the public figures named in the Epstein files — and the tax dollars that flow to them.</p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#777", maxWidth: 620, marginBottom: 40, fontFamily: sans }}>Being named in these files does not imply criminal conduct. But when individuals who maintained documented relationships with a convicted sex offender currently control billions in public money, taxpayers have the right to know. That's accountability.</p>

          {/* Victim-Centered Counter */}
          <div style={{ padding: 20, background: "linear-gradient(135deg, #1a0a0a, #0a0a0c)", border: "1px solid #3b1a1a", borderRadius: 8, marginBottom: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)" }} />
            <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: "#ef4444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>This Is About the Victims</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 16 }}>
              {[
                { n: VICTIM_STATS.identified + "+", l: "Identified Victims" },
                { n: VICTIM_STATS.minors, l: "Were Minors" },
                { n: VICTIM_STATS.countries, l: "Countries" },
                { n: VICTIM_STATS.settlementTotal, l: "In Settlements" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: "#888", fontFamily: sans }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, background: "rgba(239,68,68,0.05)", borderRadius: 6, borderLeft: "3px solid #ef4444" }}>
              <p style={{ fontSize: 13, color: "#ccc", fontFamily: sans, fontStyle: "italic", lineHeight: 1.6, marginBottom: 4 }}>"{VICTIM_STATS.quote}"</p>
              <p style={{ fontSize: 10, color: "#666", fontFamily: mono }}>{VICTIM_STATS.quoteSource}</p>
            </div>
          </div>

          {/* Accountability Gap */}
          <div style={{ padding: 20, background: "#111114", border: "1px solid #1e1e24", borderRadius: 8, marginBottom: 32 }}>
            <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>The Accountability Gap</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12, alignItems: "flex-end" }}>
              {ACCOUNTABILITY_SCORE.categories.map((c, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: Math.max(c.count * 2.5, 8), background: c.color, borderRadius: "4px 4px 0 0", marginBottom: 6, position: "relative" }}>
                    <span style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 14, fontWeight: 900, color: c.color, fontFamily: serif }}>{c.count}</span>
                  </div>
                  <div style={{ fontSize: 9, color: "#888", fontFamily: sans, lineHeight: 1.3 }}>{c.label}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 10, background: "rgba(239,68,68,0.05)", borderRadius: 4, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "#ef4444", fontFamily: sans, fontWeight: 600 }}>
                {Math.round((ACCOUNTABILITY_SCORE.currentlyProsecuted / ACCOUNTABILITY_SCORE.namedInFiles) * 100)}% accountability rate
              </span>
              <span style={{ fontSize: 11, color: "#666", fontFamily: sans }}> — {ACCOUNTABILITY_SCORE.namedInFiles} named, {ACCOUNTABILITY_SCORE.currentlyProsecuted} currently serving time</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 40 }}>
            {[{ n: keys.length, l: "Profiles" }, { n: `${totalEvents}+`, l: "Sourced Events" }, { n: "150+", l: "Identified Victims" }, { n: "~50%", l: "Files Still Sealed" }].map((s, i) => (
              <div key={i} style={{ padding: 16, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: gold, fontFamily: serif }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "#666", fontFamily: sans, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 20, background: "#0d0f18", border: "1px solid #1a2040", borderRadius: 8, marginBottom: 32 }}>
            <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: "#6b9eff", marginBottom: 8 }}>💡 Why Tax Dollars Matter</div>
            <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.8, fontFamily: sans }}>
              Elon Musk's companies have received <strong style={{ color: "#ef4444" }}>$38 billion</strong> in government funding. Peter Thiel's Palantir holds a <strong style={{ color: "#ef4444" }}>$10 billion</strong> Army contract. Howard Lutnick runs the Commerce Department. Dr. Oz oversees <strong style={{ color: "#ef4444" }}>$1.5 trillion</strong> in Medicare/Medicaid. Navy Secretary Phelan controls a <strong style={{ color: "#ef4444" }}>$255 billion</strong> budget. These are public servants and federal contractors. When documents show they maintained relationships with a convicted sex offender — sometimes contradicting their own public statements — the public has a right to know.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 40 }}>
            {[
              { icon: "👤", title: "Browse Profiles", desc: `${keys.length} sourced timelines, tax dollar connections`, action: () => setShowDisc(true) },
              { icon: "💰", title: "Follow the Money", desc: "Filter by dollar amount — $10M to $1T+", action: () => setPage("money") },
              { icon: "🕸", title: "Network Graph", desc: "Interactive map: who connects to whom", action: () => setPage("network") },
              { icon: "📅", title: "Master Timeline", desc: `${totalEvents}+ events across all profiles on one axis`, action: () => setPage("mastertl") },
              { icon: "🔴", title: "10 Co-Conspirators", desc: "FBI identified 10. Only 1 prosecuted.", action: () => setPage("coconspirators") },
              { icon: "⚖️", title: "Government Failures", desc: "43+ victims exposed, 50% files withheld", action: () => setPage("govfailures") },
              { icon: "🔄", title: "Contradictions", desc: "Public claims vs. primary documents", action: () => setPage("contradictions") },
              { icon: "📉", title: "Consequences", desc: "Resignations, investigations, actions", action: () => setPage("consequences") },
              { icon: "❓", title: "Still Unanswered", desc: "8 open questions driving accountability", action: () => setPage("unanswered") },
              { icon: "🏛", title: "Congress Tracker", desc: "Who's pushing, who's blocking", action: () => setPage("congress") },
              { icon: "📝", title: "Corrections Log", desc: "Every edit timestamped publicly", action: () => setPage("corrections") },
              { icon: "🚫", title: "What This Is NOT", desc: "Anti-conspiracy framing, methodology", action: () => setPage("method") },
              { icon: "🔴", title: "Victims First", desc: `${VICTIM_STATS.identified}+ identified. This is about them.`, action: () => setPage("victims") },
              { icon: "📊", title: "Accountability Gap", desc: `${ACCOUNTABILITY_SCORE.namedInFiles} named → ${ACCOUNTABILITY_SCORE.currentlyProsecuted} serving time`, action: () => setPage("accountability") },
              { icon: "🪞", title: "While They Smiled", desc: "What they did publicly vs. privately", action: () => setPage("juxtapose") },
              { icon: "⚡", title: "Take Action", desc: "Call, vote, support — concrete steps", action: () => setPage("action") },
              { icon: "🔒", title: "Still Sealed", desc: `~3M pages still hidden from the public`, action: () => setPage("sealed") },
              { icon: "👔", title: "Still in Power", desc: `${STILL_IN_POWER.length} people controlling $B+ in public money`, action: () => setPage("stillinpower") },
              { icon: "🏢", title: "Corporate Enablers", desc: "$577M+ in settlements, zero executives jailed", action: () => setPage("corporate") },
            ].map((c, i) => (
              <button key={i} onClick={c.action} style={{ padding: 20, background: "#111114", border: "1px solid #1e1e24", borderRadius: 8, cursor: "pointer", textAlign: "left", color: "#e2e2e8", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = gold} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e24"}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, fontFamily: sans }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#888", fontFamily: sans, lineHeight: 1.6 }}>{c.desc}</div>
              </button>
            ))}
          </div>

          <div style={{ padding: 20, background: "#1a1008", border: "1px solid #332a10", borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: gold, marginBottom: 6 }}>⚠ Disclaimer</div>
            <p style={{ fontSize: 12, color: "#999", fontFamily: sans, lineHeight: 1.7 }}>Appearing in the Epstein files does not imply criminal conduct. Many individuals were mentioned in passing. No individual profiled here has been charged with a crime connected to the Epstein investigation. Every claim includes source confidence ratings.</p>
          </div>
          <div style={{ padding: 20, background: "#0a1a0a", border: "1px solid #1a2a1a", borderRadius: 8, marginBottom: 32 }}>
            <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>🚫 Disinformation Warning</div>
            <p style={{ fontSize: 12, color: "#999", fontFamily: sans, lineHeight: 1.7 }}>PolitiFact found 129 of 166 names on a viral "Epstein list" had no connection to any released documents. This project only includes individuals verified through DOJ releases, court filings, or corroborated journalism.</p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setShowSubmit(true)} style={{ padding: "8px 16px", background: "none", border: "1px solid #333", color: "#888", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontSize: 12 }}>Submit a Finding</button>
            <button onClick={() => setPage("sources")} style={{ padding: "8px 16px", background: "none", border: "1px solid #333", color: "#888", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontSize: 12 }}>Sources & DOJ Links</button>
          </div>
        </div>

        {showDisc && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ maxWidth: 480, background: "#141418", border: `1px solid ${gold}`, borderRadius: 8, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, fontFamily: sans }}>Understand the Context</h2>
              <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.7, marginBottom: 16, fontFamily: sans }}>Being named does not imply wrongdoing. Source confidence ratings accompany every event. This is an accountability tool, not an accusation platform.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setShowDisc(false); setPage("profiles"); }} style={{ padding: "8px 20px", background: gold, color: "#000", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontWeight: 600, fontSize: 13 }}>I Understand</button>
                <button onClick={() => setShowDisc(false)} style={{ padding: "8px 20px", background: "none", color: "#888", border: "1px solid #333", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontSize: 12 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showSubmit && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ maxWidth: 480, background: "#141418", border: "1px solid #333", borderRadius: 8, padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, fontFamily: sans }}>Submit a Sourced Finding</h2>
              <p style={{ fontSize: 11, color: "#888", fontFamily: sans, marginBottom: 16 }}>All submissions require a verifiable primary source and go through editorial review.</p>
              <form action="https://formspree.io/f/mjgekgzg" method="POST">
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: "#666", fontFamily: sans, display: "block", marginBottom: 3 }}>Profile Name *</label>
                  <input name="profile" required style={{ width: "100%", padding: 7, background: "#1a1a1e", border: "1px solid #333", borderRadius: 4, color: "#ddd", fontFamily: sans, fontSize: 12 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: "#666", fontFamily: sans, display: "block", marginBottom: 3 }}>Event Description *</label>
                  <textarea name="description" required style={{ width: "100%", padding: 7, background: "#1a1a1e", border: "1px solid #333", borderRadius: 4, color: "#ddd", fontFamily: sans, fontSize: 12, minHeight: 80 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: "#666", fontFamily: sans, display: "block", marginBottom: 3 }}>Date *</label>
                  <input name="date" required style={{ width: "100%", padding: 7, background: "#1a1a1e", border: "1px solid #333", borderRadius: 4, color: "#ddd", fontFamily: sans, fontSize: 12 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: "#666", fontFamily: sans, display: "block", marginBottom: 3 }}>Primary Source URL *</label>
                  <input name="source" type="url" required style={{ width: "100%", padding: 7, background: "#1a1a1e", border: "1px solid #333", borderRadius: 4, color: "#ddd", fontFamily: sans, fontSize: 12 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: "#666", fontFamily: sans, display: "block", marginBottom: 3 }}>Your Handle (optional)</label>
                  <input name="handle" style={{ width: "100%", padding: 7, background: "#1a1a1e", border: "1px solid #333", borderRadius: 4, color: "#ddd", fontFamily: sans, fontSize: 12 }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button type="submit" style={{ padding: "8px 20px", background: gold, color: "#000", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontWeight: 600, fontSize: 13 }}>Submit</button>
                  <button type="button" onClick={() => setShowSubmit(false)} style={{ padding: "8px 20px", background: "none", color: "#888", border: "1px solid #333", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontSize: 12 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══ NAV ═══
  const Nav = () => (
    <header className="main-nav" style={{ borderBottom: "1px solid #1a1a1e", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d10", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", overflow: "auto" }} className="nav-links">
        <button onClick={() => { setPage("landing"); window.scrollTo(0, 0); }} style={{ background: "none", border: "none", cursor: "pointer", color: gold, fontFamily: serif, fontSize: 15, fontWeight: 900, flexShrink: 0 }}>The Epstein Index</button>
        {[["profiles","Profiles"],["money","Money"],["mastertl","Timeline"],["network","Network"],["coconspirators","Co-Conspirators"],["govfailures","Gov Failures"],["contradictions","Contradictions"],["consequences","Consequences"],["unanswered","Unanswered"],["congress","Congress"],["corrections","Log"],["method","Method"],["sources","Sources"],["victims","Victims"],["accountability","Scorecard"],["juxtapose","While They Smiled"],["action","Take Action"],["sealed","Sealed"],["stillinpower","In Power"],["corporate","Corporate"]].map(([p, l]) => (
          <button key={p} onClick={() => { setPage(p); window.scrollTo(0, 0); }} style={{ padding: "3px 8px", background: page === p ? "rgba(201,162,39,0.1)" : "none", border: "none", color: page === p ? gold : "#666", cursor: "pointer", fontFamily: sans, fontSize: 10, borderRadius: 3, fontWeight: page === p ? 600 : 400, flexShrink: 0 }}>{l}</button>
        ))}
      </div>
      <div style={{ fontFamily: mono, fontSize: 9, color: "#444", flexShrink: 0 }} className="nav-stats">{keys.length} profiles · {totalEvents}+ events</div>
    </header>
  );

  // ═══ MONEY PAGE (with dollar filter) ═══
  if (page === "money") {
    const thresholds = [0, 1e7, 1e9, 1e10, 1e11, 1e12];
    const labels = ["All", "$10M+", "$1B+", "$10B+", "$100B+", "$1T+"];
    const fm = MONEY_TOTALS.filter(m => m.amountNum >= moneyMin).sort((a, b) => b.amountNum - a.amountNum);
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: gold, textTransform: "uppercase", marginBottom: 6 }}>Your Tax Dollars at Work</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 6 }}>Follow The Money</h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>Filter by dollar amount. Every figure sourced to USASpending.gov, DOD budgets, or investigative reporting.</p>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {thresholds.map((t, i) => <button key={i} onClick={() => setMoneyMin(t)} style={{ padding: "5px 12px", background: moneyMin === t ? gold : "#111114", color: moneyMin === t ? "#000" : "#888", border: `1px solid ${moneyMin === t ? gold : "#1e1e24"}`, borderRadius: 4, cursor: "pointer", fontFamily: mono, fontSize: 11, fontWeight: 600 }}>{labels[i]}</button>)}
          </div>

          {fm.map((t, i) => (
            <div key={i} onClick={() => go(t.person)} style={{ padding: 14, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = gold} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e24"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProfileImg id={t.person} size={32} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{t.entity}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{t.detail}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#ef4444", fontFamily: mono }}>{t.amount}</div>
                <div style={{ fontSize: 9, color: "#555" }}>{t.source}</div>
              </div>
            </div>
          ))}
          {fm.length === 0 && <p style={{ color: "#666", fontSize: 13, padding: 20 }}>No contracts above this threshold.</p>}
        </div>
      </div>
    );
  }

  // ═══ METHOD (includes "What This Is NOT") ═══
  if (page === "method") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 24px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 8 }}>Methodology & What This Is NOT</h2>
          <p style={{ fontSize: 13, color: "#999", lineHeight: 1.7, marginBottom: 24 }}>This project exists because the anti-conspiracy-theory approach — just documents, sources, and money — is more powerful than speculation.</p>

          <div style={{ padding: 16, background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: 8, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>🚫 What This Is NOT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { myth: "A 'client list'", fact: "DOJ confirmed in July 2025: no client list exists within the Epstein files." },
                { myth: "A murder conspiracy board", fact: "DOJ confirmed Epstein's death was suicide. The IG found custody failures, not foul play." },
                { myth: "Based on a viral social media list", fact: "PolitiFact: 129 of 166 names on the viral 'Epstein list' had NO connection to any released documents." },
                { myth: "An accusation platform", fact: "Contact with Epstein does not equal criminal conduct. Many people in these files had passing acquaintance." },
                { myth: "Partisan", fact: "Profiles span both parties, multiple countries, and all sectors. The Transparency Act passed 427-1." },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>✗</span>
                  <div><strong style={{ color: "#ddd" }}>{m.myth}:</strong> <span style={{ color: "#999" }}>{m.fact}</span></div>
                </div>
              ))}
            </div>
          </div>

          {[
            { t: "Source Hierarchy", d: "Primary sources (DOJ docs, court filings) take precedence. Corroborated = 2+ major outlets. Single-source items are flagged." },
            { t: "Confidence Ratings", d: "🟢 Primary = directly from DOJ/court. 🔵 Corroborated = multiple major outlets. 🟡 Single Source = one outlet, awaiting confirmation." },
            { t: "Before/After 2008 Conviction", d: "Pre-conviction contact (crimes not publicly known) vs. post-conviction (when they were). The meaningful moral distinction." },
            { t: "Tax Dollar Verification", d: "All figures from USASpending.gov, OPM, CRS Reports, DOD budgets, or investigative reporting (WaPo, CNBC). Verified = independently confirmable." },
            { t: "Disinformation Prevention", d: "Every entry cross-referenced against primary DOJ documents. No social media claims without documentation." },
            { t: "Corrections Policy", d: "All edits timestamped in the public corrections log. Errors are owned, not buried." },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ddd", marginBottom: 6 }}>{s.t}</h3>
              <p style={{ fontSize: 13, color: "#999", lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ SOURCES ═══
  if (page === "sources") {
    const sources = [
      { name: "DOJ Epstein Library", url: "https://www.justice.gov/epstein", desc: "Official DOJ repository — 3.5M+ pages, 180K images, 2K videos" },
      { name: "Maxwell Trial Flight Logs", url: "https://lawandcrime.com/live-trials/ghislaine-maxwell/jeffrey-epstein-flight-logs-showing-detailed-passenger-lists-entered-into-evidence-at-ghislaine-maxwell-trial/", desc: "120 pages of handwritten flight logs entered as trial evidence" },
      { name: "USASpending.gov", url: "https://www.usaspending.gov", desc: "Federal contracts, grants, and spending data — primary source for tax dollar figures" },
      { name: "Wikipedia — Epstein Files", url: "https://en.wikipedia.org/wiki/Epstein_files", desc: "Comprehensive sourced overview with full citation list" },
      { name: "Wikipedia — Trump-Epstein Relationship", url: "https://en.wikipedia.org/wiki/Relationship_of_Donald_Trump_and_Jeffrey_Epstein", desc: "Detailed sourced timeline" },
      { name: "House Oversight Committee Releases", url: "https://oversight.house.gov", desc: "Tens of thousands of pages from Congressional investigation" },
      { name: "Bloomberg Epstein Emails", url: "https://www.bloomberg.com", desc: "18,700 authenticated emails from Epstein's Yahoo account (Sep 2025)" },
      { name: "PolitiFact Viral List Analysis", url: "https://www.politifact.com/factchecks/2024/feb/01/instagram-posts/we-fact-checked-a-years-old-epstein-list-with-166/", desc: "Debunked viral list — 129 of 166 names not in any released documents" },
    ];
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 24px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 20 }}>Primary Sources</h2>
          {sources.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: 14, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 6, textDecoration: "none", color: "#ddd", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = gold} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e24"}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6b9eff" }}>{s.name} ↗</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>{s.desc}</div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // ═══ CO-CONSPIRATORS PAGE ═══
  if (page === "coconspirators") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.25em", color: "#ef4444", textTransform: "uppercase", marginBottom: 8 }}>The Biggest Unanswered Question</div>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>The 10 Co-Conspirators</h2>
          <p style={{ fontSize: 13, color: "#999", lineHeight: 1.8, marginBottom: 24 }}>In July 2019, the FBI identified 10 co-conspirators in Epstein's sex trafficking operation. Only one — Ghislaine Maxwell — was ever charged. Four received immunity under the 2008 plea deal. Senator Schumer: "Who are these 10 co-conspirators? Why haven't we seen those memos? Where are the grand jury records?"</p>

          <div style={{ padding: 16, background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>📌 SUBPOENA STATUS (July 2019)</div>
            <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7 }}>{CO_CONSPIRATORS.subpoena_status}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {CO_CONSPIRATORS.named.map((c, i) => (
              <div key={i} style={{ padding: 14, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.status.includes("Convicted") ? "#3a1a1a" : c.status.includes("Deceased") ? "#1a1a2a" : c.status.includes("immunity") ? "#1a2a1a" : "#2a2a1a", border: `2px solid ${c.status.includes("Convicted") ? "#ef4444" : c.status.includes("Deceased") ? "#6366f1" : c.status.includes("immunity") ? "#22c55e" : "#eab308"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</span>
                    {c.profileId && <button onClick={() => go(c.profileId)} style={{ fontSize: 9, color: gold, background: "none", border: `1px solid ${gold}`, borderRadius: 3, padding: "1px 6px", cursor: "pointer" }}>View Profile →</button>}
                  </div>
                  <div style={{ fontSize: 11, color: c.status.includes("Convicted") ? "#ef4444" : c.status.includes("immunity") ? "#22c55e" : "#eab308", fontWeight: 600, marginBottom: 2, fontFamily: mono }}>{c.status}</div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{c.detail}</div>
                </div>
              </div>
            ))}
            {[...Array(CO_CONSPIRATORS.unknown)].map((_, i) => (
              <div key={`unk-${i}`} style={{ padding: 14, background: "#111114", border: "1px dashed #333", borderRadius: 6, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a1a1a", border: "2px dashed #555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#555", flexShrink: 0 }}>?</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#555" }}>REDACTED — Identity Unknown</div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 2, fontFamily: mono }}>Name withheld by DOJ. Never publicly identified.</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 16, background: "#0d0f18", border: "1px solid #1a2040", borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#6b9eff", fontWeight: 700, marginBottom: 6 }}>📊 KEY FINDING</div>
            <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7 }}>{CO_CONSPIRATORS.key_question}</p>
          </div>

          <div style={{ padding: 14, background: "#1a1a0a", border: "1px solid #2a2a0a", borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#eab308", fontWeight: 700, marginBottom: 4 }}>⚠ 2008 Plea Deal Impact</div>
            <p style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>4 named co-conspirators (Kellen, Groff, Ross, Marcinkova) received immunity under the plea deal signed by Alexander Acosta. A federal judge later ruled this deal violated the Crime Victims' Rights Act because victims were not notified. Despite the deal being voided, none were subsequently charged. Acosta became Trump's Labor Secretary in 2017 and resigned in 2019.</p>
          </div>

          {/* Recruitment Pipeline */}
          <div style={{ padding: 20, background: "#111114", border: "1px solid #1e1e24", borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontFamily: sans }}>How the System Worked — The Recruitment Pipeline</div>
            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 16, fontFamily: sans }}>Trial testimony and victim statements reveal a systematic recruitment operation that sustained itself for 25 years:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CO_CONSPIRATORS.recruitment_pipeline.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a0a0a", border: "2px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#ef4444", flexShrink: 0, fontFamily: mono }}>{s.step}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd", marginBottom: 2 }}>{s.title}</div>
                    <p style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 12, background: "rgba(239,68,68,0.05)", borderRadius: 6, borderLeft: "3px solid #ef4444" }}>
              <p style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>This was not a series of isolated incidents. It was a machine — with recruiters, schedulers, property managers, pilots, and bankers all playing defined roles. Yet only one person was ever federally prosecuted.</p>
            </div>
          </div>

          <div style={{ fontSize: 9, color: "#555", marginTop: 12, fontFamily: mono }}>Source: {CO_CONSPIRATORS.source}</div>
        </div>
      </div>
    );
  }

  // ═══ GOVERNMENT FAILURES PAGE ═══
  if (page === "govfailures") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.25em", color: "#ef4444", textTransform: "uppercase", marginBottom: 8 }}>Accountability Goes Both Ways</div>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Government Failures</h2>
          <p style={{ fontSize: 13, color: "#999", lineHeight: 1.8, marginBottom: 10 }}>From the 2008 plea deal to the 2026 release that exposed 43+ victims' names, the institutions meant to protect victims have repeatedly failed them — while shielding perpetrators.</p>
          <p style={{ fontSize: 13, color: "#ef4444", lineHeight: 1.8, marginBottom: 24, fontWeight: 600 }}>Survivor attorneys: "There is no conceivable degree of institutional incompetence sufficient to explain the scale, consistency, and persistence of the failures that occurred."</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {GOV_FAILURES.map((f, i) => (
              <div key={i} style={{ padding: 16, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, borderLeft: `3px solid ${f.title.includes("Nude") || f.title.includes("Egregious") ? "#ef4444" : "#eab308"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontFamily: mono, color: gold, fontWeight: 600 }}>{f.date}</div>
                  {(f.title.includes("Nude") || f.title.includes("Egregious") || f.title.includes("43+")) && <span style={{ fontSize: 8, padding: "2px 6px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 3, fontWeight: 700 }}>CRITICAL</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#e2e2e8" }}>{f.title}</div>
                <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.7, marginBottom: 4 }}>{f.desc}</p>
                <div style={{ fontSize: 9, color: "#555", fontFamily: mono }}>Source: {f.source}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div style={{ padding: 16, background: "#1a0808", border: "1px solid #3a1a1a", borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>43+</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Victims' full names exposed (WSJ count)</div>
            </div>
            <div style={{ padding: 16, background: "#1a0808", border: "1px solid #3a1a1a", borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>1 of 10</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Co-conspirators ever prosecuted</div>
            </div>
            <div style={{ padding: 16, background: "#1a0808", border: "1px solid #3a1a1a", borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>50%</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Of qualifying pages released (3M of 6M)</div>
            </div>
            <div style={{ padding: 16, background: "#1a0808", border: "1px solid #3a1a1a", borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>0</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>People prosecuted besides Maxwell</div>
            </div>
          </div>

          <div style={{ padding: 16, background: "#0d0f18", border: "1px solid #1a2040", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#6b9eff", fontWeight: 700, marginBottom: 6 }}>💬 SURVIVOR STATEMENT</div>
            <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7, fontStyle: "italic" }}>"This latest release of Jeffrey Epstein files is being sold as transparency, but what it actually does is expose survivors. Once again, survivors are having their names and identifying information exposed, while the men who abused us remain hidden and protected. That is outrageous."</p>
            <div style={{ fontSize: 10, color: "#888", marginTop: 6 }}>— Joint statement from Epstein survivors and family of Virginia Giuffre, Jan 30, 2026</div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ CONTRADICTIONS PAGE ═══
  if (page === "contradictions") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.25em", color: "#eab308", textTransform: "uppercase", marginBottom: 8 }}>Statements vs. Documents</div>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Documented Contradictions</h2>
          <p style={{ fontSize: 13, color: "#999", lineHeight: 1.8, marginBottom: 24 }}>What they told the public vs. what primary source documents show. Every entry below is sourced to DOJ files, court records, or corroborated reporting.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CONTRADICTIONS.map((c, i) => (
              <div key={i} style={{ background: "#111114", border: "1px solid #1e1e24", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e24", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ProfileImg id={c.profileId} size={28} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{P[c.profileId]?.name}</span>
                  </div>
                  <button onClick={() => go(c.profileId)} style={{ fontSize: 9, color: gold, background: "none", border: `1px solid ${gold}`, borderRadius: 3, padding: "2px 8px", cursor: "pointer" }}>Full Profile →</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  <div style={{ padding: 14, borderRight: "1px solid #1e1e24" }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#ef4444", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>🗣 Public Claim ({c.claimDate})</div>
                    <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6, fontStyle: "italic" }}>"{c.claim}"</p>
                  </div>
                  <div style={{ padding: 14, background: "#0d0d14" }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#22c55e", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>📄 What Documents Show</div>
                    <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{c.evidence}</p>
                    <div style={{ fontSize: 9, color: "#555", fontFamily: mono, marginTop: 6 }}>{c.evidenceSource}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══ CONSEQUENCES PAGE ═══
  if (page === "consequences") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.25em", color: "#22c55e", textTransform: "uppercase", marginBottom: 8 }}>Real-World Accountability</div>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Consequences Tracker</h2>
          <p style={{ fontSize: 13, color: "#999", lineHeight: 1.8, marginBottom: 24 }}>Resignations, investigations, and accountability actions resulting from the Epstein file releases. Updated as events unfold.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONSEQUENCES.map((c, i) => (
              <div key={i} style={{ padding: 14, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, borderLeft: `3px solid ${c.action.includes("Criminal") || c.action.includes("investigation") ? "#ef4444" : "#22c55e"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>{c.role}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 9, fontFamily: mono, color: "#666" }}>{c.date}</span>
                    {c.profileId && <button onClick={() => go(c.profileId)} style={{ fontSize: 9, color: gold, background: "none", border: `1px solid ${gold}`, borderRadius: 3, padding: "1px 6px", cursor: "pointer" }}>Profile →</button>}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{c.action}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 16, background: "#0a1a0a", border: "1px solid #1a2a1a", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, marginBottom: 6 }}>📊 SCORECARD</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#22c55e", fontFamily: serif }}>{CONSEQUENCES.length}</div>
                <div style={{ fontSize: 10, color: "#888" }}>Total Actions</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#3b82f6", fontFamily: serif }}>{CONSEQUENCES.filter(c => c.type === "resignation").length}</div>
                <div style={{ fontSize: 10, color: "#888" }}>Resignations</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#f59e0b", fontFamily: serif }}>{CONSEQUENCES.filter(c => c.type === "settlement").length}</div>
                <div style={{ fontSize: 10, color: "#888" }}>Settlements</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>1</div>
                <div style={{ fontSize: 10, color: "#888" }}>Convictions</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#666", fontFamily: serif }}>{CONSEQUENCES.filter(c => c.type === "death").length}</div>
                <div style={{ fontSize: 10, color: "#888" }}>Deaths Before Justice</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#eab308", fontFamily: serif }}>0</div>
                <div style={{ fontSize: 10, color: "#888" }}>Powerful Men Charged</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#ef4444", fontFamily: sans, fontWeight: 600 }}>Pattern: Resignations and settlements — but no criminal charges for any powerful associate.</p>
            <p style={{ fontSize: 11, color: "#888", fontFamily: sans, marginTop: 4 }}>Corporations paid fines. Individuals resigned quietly. The only person convicted was the one woman prosecutors chose to charge.</p>
          </div>
        </div>
      </div>
    );
  }

  // ═══ MASTER TIMELINE ═══
  if (page === "mastertl") {
    const decades = [...new Set(masterTL.map(e => Math.floor(e.year / 10) * 10))].sort();
    const ftl = mtYear === "all" ? masterTL : masterTL.filter(e => Math.floor(e.year / 10) * 10 === parseInt(mtYear));
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: gold, textTransform: "uppercase", marginBottom: 6 }}>Every Event, Every Profile</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 6 }}>Master Timeline</h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>{masterTL.length} events across {keys.length} profiles. Patterns emerge when you see everything on one axis.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            <button onClick={() => setMtYear("all")} style={{ padding: "4px 10px", background: mtYear === "all" ? gold : "#111114", color: mtYear === "all" ? "#000" : "#888", border: `1px solid ${mtYear === "all" ? gold : "#1e1e24"}`, borderRadius: 4, cursor: "pointer", fontFamily: mono, fontSize: 10 }}>All</button>
            {decades.map(d => <button key={d} onClick={() => setMtYear(String(d))} style={{ padding: "4px 10px", background: mtYear === String(d) ? gold : "#111114", color: mtYear === String(d) ? "#000" : "#888", border: `1px solid ${mtYear === String(d) ? gold : "#1e1e24"}`, borderRadius: 4, cursor: "pointer", fontFamily: mono, fontSize: 10 }}>{d}s</button>)}
          </div>
          <div style={{ borderLeft: "2px solid #1e1e24", paddingLeft: 16 }}>
            {ftl.map((e, i) => {
              const tc = TYPE_COLORS[e.type] || TYPE_COLORS.contact;
              const cc = CONF[e.confidence] || CONF["single-source"];
              return (
                <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: `3px solid ${tc.border}`, cursor: "pointer" }} onClick={() => go(e.personId)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, fontFamily: mono, color: tc.border, fontWeight: 600, minWidth: 80 }}>{e.date}</span>
                    <span style={{ fontSize: 9, padding: "1px 6px", background: "rgba(201,162,39,0.1)", color: gold, borderRadius: 3, fontWeight: 600 }}>{e.personName}</span>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cc.c, flexShrink: 0 }} title={cc.l} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#ddd", marginTop: 2 }}>{e.title}</div>
                  <div style={{ fontSize: 10, color: "#888", lineHeight: 1.5 }}>{e.desc.slice(0, 140)}{e.desc.length > 140 ? "..." : ""}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ NETWORK GRAPH ═══
  if (page === "network") {
    const { nodes, edges } = networkData;
    const W = 800, H = 600;
    const catColors = { "Politician": "#ef4444", "Business": "#3b82f6", "Royalty": "#a855f7", "Entertainment": "#eab308", "Academic": "#06b6d4", "Government": "#14b8a6", "Convicted": "#f43f5e" };
    const getCC = (cat) => { for (const [k, v] of Object.entries(catColors)) { if (cat.includes(k)) return v; } return "#666"; };
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.37;
    const positions = {};
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      positions[n.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: gold, textTransform: "uppercase", marginBottom: 6 }}>Who Connects to Whom</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 6 }}>Network Graph</h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>{edges.length} documented connections between {nodes.length} individuals. Node size = number of documented events. Click any node for the full profile.</p>
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, background: "#08080a", borderRadius: 8, border: "1px solid #1e1e24" }}>
              {edges.map((e, i) => {
                const f = positions[e.from], t = positions[e.to];
                return f && t ? <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#333" strokeWidth={0.8} opacity={0.5} /> : null;
              })}
              {nodes.map(n => {
                const p = positions[n.id]; const sz = 8 + Math.min(n.events * 1.5, 20);
                return (
                  <g key={n.id} style={{ cursor: "pointer" }} onClick={() => go(n.id)}>
                    <circle cx={p.x} cy={p.y} r={sz} fill={getCC(n.cat)} opacity={0.8} stroke={gold} strokeWidth={0.5} />
                    <text x={p.x} y={p.y + sz + 10} textAnchor="middle" fill="#aaa" fontSize={7} fontFamily={sans}>{n.name.split(" ").pop()}</text>
                    <text x={p.x} y={p.y + 3} textAnchor="middle" fill="#fff" fontSize={7} fontFamily={sans} fontWeight="700">{n.init}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
            {Object.entries(catColors).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v }} />
                <span style={{ fontSize: 10, color: "#888" }}>{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══ UNANSWERED QUESTIONS ═══
  if (page === "unanswered") {
    const statusColors = { "REDACTED": "#ef4444", "WITHHELD": "#f59e0b", "UNANSWERED": "#a855f7", "UNRELEASED": "#3b82f6", "CLOSED — QUESTIONS REMAIN": "#666" };
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#a855f7", textTransform: "uppercase", marginBottom: 6 }}>Driving Accountability Forward</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 6 }}>Still Unanswered</h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 24 }}>The biggest open questions from the Epstein investigation. These aren't conspiracy theories — they're gaps in the public record that lawmakers and journalists are actively pursuing.</p>
          {UNANSWERED.map((q, i) => (
            <div key={i} style={{ padding: 16, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e2e8", flex: 1 }}>{q.q}</div>
                <span style={{ fontSize: 8, padding: "2px 8px", background: `${statusColors[q.status]}15`, color: statusColors[q.status], border: `1px solid ${statusColors[q.status]}40`, borderRadius: 3, fontWeight: 700, fontFamily: mono, whiteSpace: "nowrap" }}>{q.status}</span>
              </div>
              <p style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{q.detail}</p>
              <div style={{ fontSize: 9, color: "#555", fontFamily: mono, marginTop: 4 }}>Source: {q.source}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ CONGRESSIONAL TRACKER ═══
  if (page === "congress") {
    const stanceColors = { pro: "#22c55e", mixed: "#f59e0b", neutral: "#666", silent: "#ef4444" };
    const stanceLabels = { pro: "PUSHING", mixed: "MIXED", neutral: "NEUTRAL", silent: "SILENT" };
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#14b8a6", textTransform: "uppercase", marginBottom: 6 }}>Who's Acting, Who's Silent</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 6 }}>Congressional Accountability Tracker</h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>The Epstein Files Transparency Act passed 427-1 in the House, unanimously in the Senate. Here's who's pushing for more and who's dragging feet.</p>
          <div style={{ padding: 14, background: "#0a1a0a", border: "1px solid #1a2a1a", borderRadius: 8, marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>✅ <strong>Key fact:</strong> The Transparency Act passed with overwhelming bipartisan support. This is not a partisan issue. Both parties have members named in the files. Both parties have members demanding accountability.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { n: CONGRESSIONAL.filter(c=>c.stance==="pro").length, l: "Pushing for Transparency", color: "#22c55e" },
              { n: CONGRESSIONAL.filter(c=>c.stance==="mixed").length, l: "Mixed / Qualified", color: "#f59e0b" },
              { n: CONGRESSIONAL.filter(c=>c.stance==="neutral").length, l: "Neutral", color: "#666" },
              { n: CONGRESSIONAL.filter(c=>c.stance==="silent").length, l: "Silent", color: "#ef4444" },
            ].map((s, i) => (
              <div key={i} style={{ padding: 12, background: "#111114", border: `1px solid ${s.color}33`, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: serif }}>{s.n}</div>
                <div style={{ fontSize: 10, color: "#888", fontFamily: sans }}>{s.l}</div>
              </div>
            ))}
          </div>

          {CONGRESSIONAL.map((c, i) => (
            <div key={i} style={{ padding: 14, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 6, borderLeft: `3px solid ${stanceColors[c.stance]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                  {c.party && <span style={{ fontSize: 8, padding: "1px 6px", background: c.party === "D" ? "rgba(59,130,246,0.1)" : c.party === "R" ? "rgba(239,68,68,0.1)" : "rgba(201,162,39,0.1)", color: c.party === "D" ? "#3b82f6" : c.party === "R" ? "#ef4444" : gold, borderRadius: 3, fontFamily: mono }}>{c.party}</span>}
                </div>
                <span style={{ fontSize: 8, padding: "2px 8px", background: `${stanceColors[c.stance]}15`, color: stanceColors[c.stance], border: `1px solid ${stanceColors[c.stance]}40`, borderRadius: 3, fontWeight: 700, fontFamily: mono }}>{stanceLabels[c.stance]}</span>
              </div>
              <p style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>{c.action}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ CORRECTIONS LOG ═══
  if (page === "corporate") {
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: gold, textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 12 }}>Follow the Institutional Money</div>
          <h2 style={{ fontFamily: serif, fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Corporate <span style={{ color: gold }}>Enablers</span></h2>
          <p style={{ color: "#888", fontFamily: sans, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>Institutions that profited from or facilitated Epstein's operations — and the financial consequences. Zero executives have served jail time.</p>
          <div style={{ color: gold, fontFamily: mono, fontSize: 13, padding: "12px 16px", background: "rgba(201,162,39,0.06)", borderRadius: 6, marginBottom: 24, borderLeft: `3px solid ${gold}` }}>
            Total institutional settlements: <strong>${CORPORATE_ENABLERS.reduce((s,c)=>s+c.settlementNum,0).toLocaleString()}</strong> ({CORPORATE_ENABLERS.filter(c=>c.settlementNum>0).length} entities)
          </div>
          {CORPORATE_ENABLERS.map((c, i) => (
            <div key={i} style={{ background: "#111118", borderRadius: 8, padding: 18, marginBottom: 12, borderLeft: `3px solid ${c.settlementNum > 100e6 ? "#ef4444" : c.settlementNum > 0 ? "#f59e0b" : "#666"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 16, color: "#e0e0e0" }}>{c.name}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: c.settlementNum > 100e6 ? "#ef4444" : c.settlementNum > 0 ? "#f59e0b" : "#666", background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: 10 }}>{c.settlement}</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: 12, color: gold, marginBottom: 6 }}>{c.role}</div>
              <p style={{ fontFamily: sans, fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "8px 0" }}>{c.detail}</p>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#888", marginTop: 8 }}>
                <strong>Key People:</strong> {c.key_people.join(" • ")}
              </div>
              <div style={{ fontFamily: sans, fontSize: 10, color: "#555", marginTop: 4 }}>Status: {c.status} | Source: {c.source}</div>
            </div>
          ))}
          <div style={{ padding: 16, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, marginTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#ef4444", fontFamily: sans, fontWeight: 600, marginBottom: 4 }}>Total settlements paid: ${CORPORATE_ENABLERS.reduce((s,c)=>s+c.settlementNum,0).toLocaleString()}</p>
            <p style={{ fontSize: 11, color: "#888", fontFamily: sans }}>Executives jailed: 0</p>
          </div>
        </main>
      </div>
    );
  }

    if (page === "corrections") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: sans }}>
        <style>{CSS}</style><Nav />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#22c55e", textTransform: "uppercase", marginBottom: 6 }}>Full Edit Transparency</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, fontFamily: serif, marginBottom: 6 }}>Corrections Log</h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>Every edit, correction, and clarification is timestamped and public. This is what separates an accountability tool from a blog. If we get something wrong, we fix it transparently — and that increases credibility.</p>
          <div style={{ padding: 14, background: "#0d0f18", border: "1px solid #1a2040", borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#6b9eff", fontWeight: 600, marginBottom: 4 }}>📊 TRUST METRIC</div>
            <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{CORRECTIONS_LOG.length} entries logged. 0 corrections needed so far. All sourced to DOJ files, court records, or corroborated journalism.</p>
          </div>
          {CORRECTIONS_LOG.map((c, i) => (
            <div key={i} style={{ padding: 12, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 6, borderLeft: "3px solid #22c55e" }}>
              <div style={{ fontSize: 9, fontFamily: mono, color: gold, marginBottom: 4 }}>{c.date}</div>
              <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{c.entry}</p>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: 14, background: "#111114", border: "1px dashed #333", borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>📬 Found an error? Have a correction with sourcing? Submit via the feedback form. All corrections will be logged here with timestamps.</p>
          </div>
        </div>
      </div>
    );
  }


  // ═══ VICTIMS FIRST PAGE ═══
  if (page === "victims") {
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#ef4444", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 16 }}>Before You Read a Single Profile</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>This Is About <span style={{ color: "#ef4444" }}>Real People</span></h1>
            <p style={{ fontSize: 15, color: "#999", lineHeight: 1.8, fontFamily: sans, maxWidth: 560, margin: "0 auto" }}>
              Behind every profile in this index — behind every powerful name, every flight log, every financial connection — there are real victims. Most were children when they were exploited.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { n: VICTIM_STATS.identified + "+", l: "Identified Victims", sub: "In court filings & DOJ records", color: "#ef4444" },
              { n: VICTIM_STATS.minors, l: "Were Minors", sub: "Average age: " + VICTIM_STATS.averageAge, color: "#f59e0b" },
              { n: VICTIM_STATS.countries, l: "Countries", sub: "US, UK, US Virgin Islands+", color: "#3b82f6" },
              { n: VICTIM_STATS.yearsActive, l: "Years of Abuse", sub: "25 years of documented activity", color: "#a855f7" },
              { n: VICTIM_STATS.civilSuits + "+", l: "Civil Lawsuits", sub: "Filed by survivors", color: "#22c55e" },
              { n: VICTIM_STATS.unnamed, l: "May Never Be Named", sub: "Many victims haven't come forward", color: "#666" },
            ].map((s, i) => (
              <div key={i} style={{ padding: 20, background: "#111114", border: `1px solid ${s.color}33`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: serif }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "#ccc", fontFamily: sans, fontWeight: 600, marginTop: 4 }}>{s.l}</div>
                <div style={{ fontSize: 10, color: "#666", fontFamily: sans, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 24, background: "#1a0a0a", border: "1px solid #3b1a1a", borderRadius: 8, marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", fontFamily: sans, marginBottom: 10 }}>From Victim Testimony</div>
            <blockquote style={{ fontSize: 16, color: "#ddd", fontStyle: "italic", lineHeight: 1.8, fontFamily: serif, borderLeft: "3px solid #ef4444", paddingLeft: 16, marginBottom: 12 }}>
              "{VICTIM_STATS.quote}"
            </blockquote>
            <p style={{ fontSize: 11, color: "#666", fontFamily: mono }}>{VICTIM_STATS.quoteSource}</p>
          </div>

          <div style={{ padding: 20, background: "#111114", border: "1px solid #1e1e24", borderRadius: 8, marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, fontFamily: sans }}>The System That Failed Them</h3>
            {[
              { year: "2005", event: "Palm Beach police identify 40+ victims, recommend federal charges" },
              { year: "2006", event: "FBI opens investigation, compiles massive evidence file" },
              { year: "2007", event: "U.S. Attorney Acosta secretly negotiates plea deal — victims not notified" },
              { year: "2008", event: "Epstein pleads to state charges, serves 13 months with work release" },
              { year: "2008-2019", event: "Co-conspirator immunity protections remain in place for 11 years" },
              { year: "2019", event: "SDNY finally brings federal charges — Epstein dies before trial" },
              { year: "2021", event: "Ghislaine Maxwell arrested — only associate ever federally prosecuted" },
              { year: "2024-26", event: "Files partially released — ~50% remain sealed from the public" },
            ].map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, padding: "8px 12px", background: i % 2 === 0 ? "rgba(239,68,68,0.03)" : "transparent", borderRadius: 4 }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: "#ef4444", minWidth: 70, fontWeight: 600 }}>{e.year}</span>
                <span style={{ fontSize: 12, color: "#bbb", fontFamily: sans, lineHeight: 1.5 }}>{e.event}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: 20 }}>
            <p style={{ fontSize: 13, color: "#888", fontFamily: sans, marginBottom: 16 }}>If you or someone you know is a survivor of sexual violence:</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ padding: "10px 20px", background: "#1a1a2e", border: "1px solid #3b82f6", borderRadius: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", fontFamily: sans }}>RAINN Hotline</div>
                <div style={{ fontSize: 14, color: "#ddd", fontFamily: mono }}>1-800-656-4673</div>
              </div>
              <div style={{ padding: "10px 20px", background: "#1a1a2e", border: "1px solid #3b82f6", borderRadius: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", fontFamily: sans }}>Crisis Text Line</div>
                <div style={{ fontSize: 14, color: "#ddd", fontFamily: mono }}>Text HOME to 741741</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ═══ ACCOUNTABILITY SCORECARD ═══
  if (page === "accountability") {
    const pct = (n, d) => Math.round((n / d) * 100);
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#f59e0b", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 12 }}>System Performance Report</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>The Accountability <span style={{ color: "#ef4444" }}>Scorecard</span></h1>
          <p style={{ fontSize: 14, color: "#888", fontFamily: sans, lineHeight: 1.7, marginBottom: 32 }}>How many people named in the Epstein files have actually faced consequences?</p>

          {/* The Funnel */}
          <div style={{ marginBottom: 40 }}>
            {[
              { label: "Named in Released Files", count: ACCOUNTABILITY_SCORE.namedInFiles, pct: 100, color: "#3b82f6", bg: "#0d1a30" },
              { label: "Publicly Questioned / Deposed", count: ACCOUNTABILITY_SCORE.facedQuestions, pct: pct(12, 67), color: "#a855f7", bg: "#1a0d30" },
              { label: "Faced Any Legal Consequence", count: ACCOUNTABILITY_SCORE.facedLegalConsequences, pct: pct(4, 67), color: "#f59e0b", bg: "#1a1508" },
              { label: "Currently Serving Time", count: ACCOUNTABILITY_SCORE.servedTime, pct: pct(2, 67), color: "#ef4444", bg: "#1a0808" },
              { label: "Deaths Before Trial", count: ACCOUNTABILITY_SCORE.deathsBeforeTrial, pct: pct(2, 67), color: "#666", bg: "#111" },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#ccc", fontFamily: sans }}>{row.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: row.color, fontFamily: serif }}>{row.count}</span>
                </div>
                <div style={{ height: 28, background: "#0a0a0c", borderRadius: 4, border: "1px solid #1e1e24", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${row.pct}%`, background: `${row.color}22`, borderRight: `3px solid ${row.color}`, display: "flex", alignItems: "center", paddingLeft: 8, transition: "width 1s ease-out" }}>
                    <span style={{ fontSize: 10, color: row.color, fontFamily: mono, fontWeight: 600 }}>{row.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still in Power callout */}
          <div style={{ padding: 20, background: "#1a0808", border: "1px solid #3b1a1a", borderRadius: 8, marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#ef4444", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 4 }}>Meanwhile</div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>{ACCOUNTABILITY_SCORE.stillInPower} People Named in the Files</div>
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>{ACCOUNTABILITY_SCORE.stillInPower}</div>
            </div>
            <p style={{ fontSize: 13, color: "#bbb", fontFamily: sans, lineHeight: 1.7, marginBottom: 12 }}>
              ...currently hold positions of power, controlling billions in taxpayer money. {ACCOUNTABILITY_SCORE.govPositions} hold government positions. {ACCOUNTABILITY_SCORE.billionaires} are billionaires.
            </p>
            <button onClick={() => setPage("stillinpower")} style={{ padding: "8px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontWeight: 600, fontSize: 12 }}>See Who's Still in Power →</button>
          </div>

          {/* The Question */}
          <div style={{ textAlign: "center", padding: "30px 20px", background: "#111114", borderRadius: 8, border: "1px solid #1e1e24" }}>
            <p style={{ fontSize: 18, color: "#ddd", fontFamily: serif, fontWeight: 700, lineHeight: 1.6, marginBottom: 16 }}>
              {ACCOUNTABILITY_SCORE.namedInFiles} people were named.<br />
              <span style={{ color: "#ef4444" }}>{ACCOUNTABILITY_SCORE.currentlyProsecuted}</span> was prosecuted.<br />
              <span style={{ color: "#f59e0b" }}>Is that accountability?</span>
            </p>
            <button onClick={() => setPage("action")} style={{ padding: "10px 24px", background: gold, color: "#000", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>What You Can Do →</button>
          </div>
        </main>
      </div>
    );
  }

  // ═══ "WHILE THEY SMILED" — JUXTAPOSITION TIMELINE ═══
  if (page === "juxtapose") {
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#a855f7", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 12 }}>The Two Faces</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>While They <span style={{ color: "#a855f7" }}>Smiled</span> in Public</h1>
          <p style={{ fontSize: 14, color: "#888", fontFamily: sans, lineHeight: 1.7, marginBottom: 32 }}>What powerful people were doing publicly — and what was happening behind closed doors.</p>

          {JUXTAPOSE_TIMELINE.map((e, i) => (
            <div key={i} style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 12, alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 900, color: gold }}>{e.year}</span>
                {P[e.person] && <span onClick={() => go(e.person)} style={{ fontSize: 9, color: "#666", fontFamily: sans, cursor: "pointer", textDecoration: "underline", textAlign: "center", marginTop: 2 }}>{P[e.person]?.name?.split(" ").pop()}</span>}
              </div>
              <div style={{ padding: 14, background: "#0d1a0d", border: "1px solid #1a3a1a", borderRadius: 6 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#22c55e", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 6 }}>🎭 Public Image</div>
                <p style={{ fontSize: 12, color: "#bbb", fontFamily: sans, lineHeight: 1.6 }}>{e.public}</p>
              </div>
              <div style={{ padding: 14, background: "#1a0d0d", border: "1px solid #3b1a1a", borderRadius: 6 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#ef4444", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 6 }}>🔍 What Was Happening</div>
                <p style={{ fontSize: 12, color: "#bbb", fontFamily: sans, lineHeight: 1.6 }}>{e.private}</p>
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // ═══ TAKE ACTION PAGE ═══
  if (page === "action") {
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#22c55e", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 12 }}>Turn Knowledge Into Action</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>What You <span style={{ color: "#22c55e" }}>Can Do</span></h1>
          <p style={{ fontSize: 14, color: "#888", fontFamily: sans, lineHeight: 1.7, marginBottom: 12 }}>Outrage without action changes nothing. Here are concrete steps — from 2 minutes to ongoing commitment.</p>
          <p style={{ fontSize: 12, color: "#666", fontFamily: sans, lineHeight: 1.6, marginBottom: 32, fontStyle: "italic" }}>Every phone call to a representative gets logged. Every vote matters. The powerful count on you forgetting.</p>

          {ACTION_ITEMS.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: 24 }}>
              <div onClick={() => setActionExpanded(actionExpanded === ci ? null : ci)} style={{ padding: "16px 20px", background: "#111114", border: "1px solid #1e1e24", borderRadius: actionExpanded === ci ? "8px 8px 0 0" : 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: sans }}>{cat.category}</div>
                    <div style={{ fontSize: 11, color: "#666", fontFamily: sans }}>{cat.items.length} actions</div>
                  </div>
                </div>
                <span style={{ color: "#666", fontSize: 18 }}>{actionExpanded === ci ? "−" : "+"}</span>
              </div>
              {actionExpanded === ci && (
                <div style={{ border: "1px solid #1e1e24", borderTop: "none", borderRadius: "0 0 8px 8px", background: "#0d0d10" }}>
                  {cat.items.map((item, ii) => (
                    <div key={ii} style={{ padding: "14px 20px", borderBottom: ii < cat.items.length - 1 ? "1px solid #1a1a1e" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#ddd", fontFamily: sans }}>{item.action}</div>
                        {item.effort && <span style={{ padding: "2px 8px", background: "rgba(34,197,94,0.1)", color: "#22c55e", borderRadius: 12, fontSize: 10, fontFamily: mono, flexShrink: 0 }}>{item.effort}</span>}
                      </div>
                      <p style={{ fontSize: 12, color: "#999", fontFamily: sans, lineHeight: 1.6, marginBottom: item.link ? 6 : 0 }}>{item.detail}</p>
                      {item.link && <span style={{ fontSize: 11, color: "#3b82f6", fontFamily: sans }}>🔗 {item.link}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ padding: 20, background: "#0d1a0d", border: "1px solid #1a3a1a", borderRadius: 8, textAlign: "center", marginTop: 16 }}>
            <p style={{ fontSize: 14, color: "#22c55e", fontFamily: sans, fontWeight: 600, marginBottom: 8 }}>The most powerful thing you can do is vote.</p>
            <p style={{ fontSize: 12, color: "#888", fontFamily: sans, lineHeight: 1.6 }}>Check if your elected officials have called for full Epstein file declassification. If they haven't — ask them why. If they still won't — remember that in the voting booth.</p>
          </div>
        </main>
      </div>
    );
  }

  // ═══ WHAT'S STILL SEALED ═══
  if (page === "sealed") {
    const urgencyColor = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6" };
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#f59e0b", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 12 }}>What You're Not Allowed to See</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Still <span style={{ color: "#f59e0b" }}>Sealed</span></h1>
          <p style={{ fontSize: 14, color: "#888", fontFamily: sans, lineHeight: 1.7, marginBottom: 32 }}>Roughly half of all Epstein-related documents remain hidden from the public. Here's what we know is still locked away.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { n: SEALED_INFO.totalPages, l: "Total Pages" },
              { n: SEALED_INFO.pagesReleased, l: "Released" },
              { n: SEALED_INFO.stillSealed, l: "Still Sealed" },
              { n: SEALED_INFO.redactedNames, l: "Redacted Names" },
            ].map((s, i) => (
              <div key={i} style={{ padding: 16, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: i === 2 ? "#ef4444" : gold, fontFamily: serif }}>{s.n}</div>
                <div style={{ fontSize: 10, color: "#666", fontFamily: sans }}>{s.l}</div>
              </div>
            ))}
          </div>

          {SEALED_INFO.items.map((item, i) => (
            <div key={i} style={{ padding: 16, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 8, borderLeft: `3px solid ${urgencyColor[item.urgency]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#ddd", fontFamily: sans }}>{item.what}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ padding: "2px 8px", fontSize: 9, background: `${urgencyColor[item.urgency]}15`, color: urgencyColor[item.urgency], border: `1px solid ${urgencyColor[item.urgency]}33`, borderRadius: 3, fontFamily: mono, textTransform: "uppercase" }}>{item.urgency}</span>
                  <span style={{ padding: "2px 8px", fontSize: 9, background: item.status === "Sealed" || item.status === "Classified" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: item.status === "Sealed" || item.status === "Classified" ? "#ef4444" : "#f59e0b", borderRadius: 3, fontFamily: mono }}>{item.status}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#999", fontFamily: sans, lineHeight: 1.6 }}>{item.detail}</p>
            </div>
          ))}

          <div style={{ padding: 20, background: "#1a1508", border: "1px solid #332a10", borderRadius: 8, textAlign: "center", marginTop: 24 }}>
            <p style={{ fontSize: 14, color: "#f59e0b", fontFamily: sans, fontWeight: 600, marginBottom: 8 }}>Why does this matter?</p>
            <p style={{ fontSize: 12, color: "#888", fontFamily: sans, lineHeight: 1.6, marginBottom: 16 }}>Every sealed page potentially contains names, connections, and evidence that the public has a right to see. The Epstein Files Transparency Act has bipartisan support — but it only covers specific releases, not everything.</p>
            <button onClick={() => setPage("action")} style={{ padding: "8px 20px", background: gold, color: "#000", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontWeight: 600, fontSize: 12 }}>Demand Full Transparency →</button>
          </div>
        </main>
      </div>
    );
  }

  // ═══ STILL IN POWER ═══
  if (page === "stillinpower") {
    const cats = ["all", "Government", "Tech/Business", "Finance", "Media/Other"];
    const fPower = STILL_IN_POWER.filter(p => {
      if (powerFilter === "all") return true;
      const cat = P[p.id]?.cat || "";
      if (powerFilter === "Government") return cat.includes("Politician") || cat.includes("Government");
      if (powerFilter === "Tech/Business") return cat.includes("Tech") || cat.includes("Business");
      if (powerFilter === "Finance") return cat.includes("Finance");
      return !cat.includes("Politician") && !cat.includes("Tech") && !cat.includes("Finance");
    });
    return (
      <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
        <style>{CSS}</style><Nav />
        <main style={{ flex: 1, overflowY: "auto", maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#ef4444", textTransform: "uppercase", fontFamily: sans, fontWeight: 700, marginBottom: 12 }}>Right Now, Today</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Still in <span style={{ color: "#ef4444" }}>Power</span></h1>
          <p style={{ fontSize: 14, color: "#888", fontFamily: sans, lineHeight: 1.7, marginBottom: 20 }}>These individuals appear in the Epstein files and currently hold positions controlling billions in public resources.</p>

          <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setPowerFilter(c)} style={{ padding: "5px 14px", border: `1px solid ${powerFilter === c ? gold : "#333"}`, background: powerFilter === c ? "rgba(201,162,39,0.1)" : "transparent", color: powerFilter === c ? gold : "#888", borderRadius: 20, cursor: "pointer", fontFamily: sans, fontSize: 11 }}>{c}</button>
            ))}
          </div>

          <div style={{ marginBottom: 24, padding: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, textAlign: "center" }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", fontFamily: serif }}>{fPower.length}</span>
            <span style={{ fontSize: 13, color: "#bbb", fontFamily: sans }}> people in the files currently hold power or influence</span>
          </div>

          {fPower.map((p, i) => (
            <div key={i} onClick={() => go(p.id)} style={{ padding: 16, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 8, cursor: "pointer", display: "flex", gap: 14, alignItems: "center", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#ef4444"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e24"}>
              <ProfileImg id={p.id} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#ddd", fontFamily: sans }}>{P[p.id]?.name}</div>
                  <span style={{ padding: "2px 8px", fontSize: 9, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 3, fontFamily: mono }}>ACTIVE</span>
                </div>
                <div style={{ fontSize: 12, color: gold, fontFamily: sans, marginBottom: 2 }}>{p.position}</div>
                <div style={{ fontSize: 11, color: "#ef4444", fontFamily: mono }}>Controls: {p.controls}</div>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", padding: 20, marginTop: 16 }}>
            <button onClick={() => setPage("action")} style={{ padding: "10px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>What You Can Do About It →</button>
          </div>
        </main>
      </div>
    );
  }

  // ═══ PROFILES ═══
  const ftl = filterTL(profile.tl);
  const cp = comp ? P[comp] : null;

  return (
    <div style={{ height: "100vh", background: "#0a0a0c", color: "#e2e2e8", fontFamily: serif, display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style><Nav />
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ 
          display: "none",
          position: "fixed",
          top: 54,
          left: 8,
          zIndex: 100,
          background: gold,
          border: "none",
          borderRadius: 4,
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: 16,
          color: "#000",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .main-nav {
            padding: 6px 8px !important;
          }
          .nav-links {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
          }
          .nav-links::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }
          .nav-stats {
            display: none !important;
          }
          .sidebar {
            position: fixed !important;
            left: ${mobileMenuOpen ? '0' : '-250px'} !important;
            top: 0 !important;
            height: 100vh !important;
            z-index: 99 !important;
            transition: left 0.3s ease !important;
            width: 250px !important;
          }
          .sidebar-overlay {
            display: ${mobileMenuOpen ? 'block' : 'none'} !important;
            position: fixed !important;
            inset: 0 !important;
            background: rgba(0,0,0,0.7) !important;
            z-index: 98 !important;
          }
          .main-content {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div 
        className="sidebar-overlay"
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <aside className="sidebar" style={{ width: 210, borderRight: "1px solid #1a1a1e", background: "#0d0d10", overflowY: "auto", flexShrink: 0, padding: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "7px 9px", background: "#111", border: "1px solid #222", borderRadius: 4, color: "#ddd", fontFamily: sans, fontSize: 11, marginBottom: 8 }} />
          {filtered.map(k => (
            <button key={k} onClick={() => { go(k); setMobileMenuOpen(false); window.scrollTo(0, 0); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px", border: ap === k ? `1px solid ${gold}` : "1px solid transparent", background: ap === k ? "#1a1a10" : "transparent", color: ap === k ? gold : "#999", borderRadius: 4, cursor: "pointer", textAlign: "left", fontFamily: sans, fontSize: 11, marginBottom: 2 }}>
              <ProfileImg id={k} size={24} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 11 }}>{P[k].name}</div>
                <div style={{ fontSize: 9, opacity: 0.5 }}>{P[k].cat}</div>
              </div>
            </button>
          ))}
          <div style={{ marginTop: 12, padding: 8, background: "#111", borderRadius: 4, border: "1px solid #1e1e24" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>Legend</div>
            {Object.entries(TYPE_COLORS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: v.border }} />
                <span style={{ fontSize: 9, color: "#777" }}>{v.label}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1e1e24", marginTop: 6, paddingTop: 6 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase", marginBottom: 3 }}>Confidence</div>
              {Object.entries(CONF).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: v.c }} />
                  <span style={{ fontSize: 8, color: "#777" }}>{v.l}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="main-content" style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "20px 24px 0", borderBottom: "1px solid #1a1a1e" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
              <ProfileImg id={ap} size={52} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 2, fontFamily: serif }}>{profile.name}</h2>
                <div style={{ fontFamily: sans, fontSize: 11, color: "#888" }}><span style={{ color: gold }}>{profile.role}</span>{profile.prev && <span> · Prev: {profile.prev}</span>}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#999", maxWidth: 650, marginBottom: 10, fontFamily: sans }}>{profile.sum}</p>
            <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3 }}>
              <span style={{ fontFamily: sans, fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Connected:</span>
              {(profile.conn || []).map(c => P[c] ? (
                <span key={c} onClick={() => go(c)} style={{ padding: "2px 8px", border: "1px solid #333", borderRadius: 14, fontSize: 10, color: "#aaa", cursor: "pointer", fontFamily: sans }}
                  onMouseEnter={e => { e.target.style.borderColor = gold; e.target.style.color = gold; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#333"; e.target.style.color = "#aaa"; }}>
                  {P[c].name}
                </span>
              ) : null)}
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[["timeline", "Timeline"], ["statements", "Statements vs Docs"], ["taxdollars", "Tax Dollars"], ["compare", "Compare"]].map(([id, l]) => (
                <button key={id} onClick={() => setTab(id)} style={{ padding: "6px 14px", border: "none", background: "none", color: tab === id ? gold : "#666", cursor: "pointer", fontFamily: sans, fontSize: 10, fontWeight: 600, borderBottom: tab === id ? `2px solid ${gold}` : "2px solid transparent", textTransform: "uppercase" }}>{l}</button>
              ))}
            </div>
          </div>

          {tab === "timeline" && (
            <div style={{ padding: "16px 24px 24px 48px", position: "relative" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: "#555", fontFamily: sans, textTransform: "uppercase" }}>Filter:</span>
                {[["all", "All"], ["before", "Pre-2008"], ["after", "Post-2008"]].map(([v, l]) => (
                  <button key={v} onClick={() => setFConv(v)} style={{ padding: "3px 10px", border: `1px solid ${fConv === v ? gold : "#333"}`, background: fConv === v ? "rgba(201,162,39,0.1)" : "transparent", color: fConv === v ? gold : "#888", borderRadius: 16, cursor: "pointer", fontFamily: sans, fontSize: 10 }}>{l}</button>
                ))}
                <select value={fType} onChange={e => setFType(e.target.value)} style={{ padding: "3px 6px", background: "#111", border: "1px solid #333", color: "#888", borderRadius: 4, fontFamily: sans, fontSize: 10 }}>
                  <option value="all">All types</option>
                  {Object.entries(TYPE_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <span style={{ fontSize: 10, color: "#555", fontFamily: mono, marginLeft: 8 }}>{ftl.length} events</span>
              </div>
              <div style={{ position: "absolute", left: 38, top: 50, bottom: 24, width: 2, background: "linear-gradient(to bottom, #c9a227, #333 10%, #333 90%, transparent)" }} />
              {ftl.length === 0 && <div style={{ padding: 16, color: "#666", fontFamily: sans, fontSize: 12 }}>No events match filter.</div>}
              {ftl.map((ev, i) => {
                const tc = TYPE_COLORS[ev.type] || TYPE_COLORS.contact;
                const cc = CONF[ev.confidence] || CONF["single-source"];
                const isExp = exp === i;
                return (
                  <div key={i} style={{ position: "relative", paddingLeft: 20, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${tc.border}`, position: "absolute", left: -5, top: 5, background: isExp ? tc.border : "#0a0a0c", zIndex: 2, cursor: "pointer" }} onClick={() => setExp(isExp ? null : i)} />
                    <div onClick={() => setExp(isExp ? null : i)} style={{ padding: "10px 14px", borderRadius: 4, borderLeft: `3px solid ${tc.border}`, background: isExp ? tc.bg : "#111114", cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: mono, fontSize: 10, color: tc.border }}>{ev.date}</span>
                        <span style={{ fontSize: 9, color: "#555", fontFamily: sans, textTransform: "uppercase" }}>{tc.label}</span>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: cc.c }} title={cc.l} />
                        {ev.contradicted && <span style={{ padding: "1px 5px", fontSize: 8, background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 3, fontFamily: mono }}>CONTRADICTED</span>}
                        {ev.year >= CY && <span style={{ padding: "1px 5px", fontSize: 8, background: "rgba(239,68,68,0.08)", color: "#f87171", borderRadius: 3, fontFamily: mono }}>Post-conviction</span>}
                      </div>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: "#ddd", fontFamily: sans }}>{ev.title}</h4>
                      <p style={{ fontSize: 11, lineHeight: 1.6, color: isExp ? "#ccc" : "#888", fontFamily: sans }}>{ev.desc}</p>
                      {isExp && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${tc.border}33` }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: 9, color: "#555" }}>Source:</span>
                            <span style={{ fontSize: 11, color: "#999", fontFamily: sans }}>{ev.source}</span>
                            <span style={{ padding: "1px 6px", fontSize: 9, background: `${cc.c}15`, color: cc.c, border: `1px solid ${cc.c}33`, borderRadius: 3, fontFamily: mono }}>{ev.confidence?.replace("-", " ")}</span>
                          </div>
                          {ev.url && <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 6, padding: "3px 8px", background: "rgba(59,130,246,0.1)", color: "#6b9eff", borderRadius: 3, fontSize: 10, textDecoration: "none", fontFamily: mono }}>↗ View Source</a>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "statements" && (
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div style={{ padding: 16, background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#a855f7", textTransform: "uppercase", marginBottom: 6, fontFamily: sans, fontWeight: 600 }}>Their Statement</div>
                  <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6, fontFamily: sans, fontStyle: "italic" }}>"{profile.resp}"</p>
                  <div style={{ fontSize: 10, color: "#666", marginTop: 6, fontFamily: mono }}>{profile.respDate}</div>
                </div>
                <div style={{ padding: 16, background: "#1a1a10", border: "1px solid #2a2a10", borderRadius: 8 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#eab308", textTransform: "uppercase", marginBottom: 6, fontFamily: sans, fontWeight: 600 }}>What Documents Show</div>
                  {profile.tl.filter(e => e.confidence === "primary").slice(0, 5).map((e, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#ccc", lineHeight: 1.5, fontFamily: sans, paddingLeft: 10, borderLeft: "2px solid #eab308", marginBottom: 6 }}>
                      <strong style={{ color: "#eab308" }}>{e.date}:</strong> {e.title}
                    </div>
                  ))}
                </div>
              </div>
              {profile.tl.filter(e => e.contradicted).length > 0 && (
                <div style={{ padding: 14, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, marginBottom: 6, fontFamily: sans }}>⚠ Documented Contradictions</div>
                  {profile.tl.filter(e => e.contradicted).map((e, i) => (
                    <p key={i} style={{ fontSize: 11, color: "#ccc", lineHeight: 1.5, marginBottom: 4, fontFamily: sans }}><strong>{e.date}:</strong> {e.title} — {e.desc}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "taxdollars" && (
            <div style={{ padding: 24 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.15em", color: gold, textTransform: "uppercase", marginBottom: 14, fontFamily: sans }}>Public Money Connections</div>
              {(profile.tax || []).length === 0 ? (
                <p style={{ fontSize: 12, color: "#888", fontFamily: sans }}>No direct tax dollar connections identified.</p>
              ) : (profile.tax || []).map((t, i) => (
                <div key={i} style={{ padding: 14, background: "#111114", border: "1px solid #1e1e24", borderRadius: 6, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#22c55e", textTransform: "uppercase", fontFamily: sans }}>{t.type}</span>
                      {t.verified && <span style={{ padding: "1px 5px", fontSize: 8, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 3, fontFamily: mono }}>✓ VERIFIED</span>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", fontFamily: mono }}>{t.amount}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5, fontFamily: sans }}>{t.detail}</p>
                  <div style={{ fontSize: 9, color: "#555", fontFamily: mono, marginTop: 4 }}>Source: {t.source} · Status: {t.status}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "compare" && (
            <div style={{ padding: 24 }}>
              <select value={comp || ""} onChange={e => setComp(e.target.value || null)} style={{ padding: "7px 10px", background: "#111", border: "1px solid #333", color: "#ddd", borderRadius: 4, fontFamily: sans, fontSize: 12, minWidth: 200, marginBottom: 16 }}>
                <option value="">Select profile to compare...</option>
                {keys.filter(k => k !== ap).map(k => <option key={k} value={k}>{P[k].name}</option>)}
              </select>
              {cp ? (
                <div>
                  {/* Shared connections */}
                  {(() => {
                    const shared = (profile.conn || []).filter(c => (cp.conn || []).includes(c));
                    const bothYears = profile.tl.filter(e => cp.tl.some(e2 => Math.abs(e.year - e2.year) <= 1));
                    return (shared.length > 0 || bothYears.length > 0) ? (
                      <div style={{ padding: 12, background: "#1a1a10", border: "1px solid #2a2a10", borderRadius: 8, marginBottom: 16 }}>
                        {shared.length > 0 && <div style={{ fontSize: 11, color: gold, marginBottom: 4 }}>🔗 Shared connections: {shared.map(c => P[c]?.name).join(", ")}</div>}
                        {bothYears.length > 0 && <div style={{ fontSize: 11, color: "#3b82f6" }}>📅 {bothYears.length} events in overlapping years</div>}
                      </div>
                    ) : null;
                  })()}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[profile, cp].map((p, pi) => (
                      <div key={pi}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: pi === 0 ? gold : "#3b82f6", marginBottom: 10, fontFamily: sans }}>{p.name}</div>
                        {p.tl.map((e, j) => {
                          const tc = TYPE_COLORS[e.type] || TYPE_COLORS.contact;
                          return (
                            <div key={j} style={{ padding: "6px 10px", borderLeft: `2px solid ${tc.border}`, marginBottom: 4, background: e.contradicted ? "rgba(239,68,68,0.05)" : "#111114", borderRadius: "0 4px 4px 0" }}>
                              <div style={{ fontSize: 9, color: tc.border, fontFamily: mono }}>{e.date} {e.contradicted && "⚠"}</div>
                              <div style={{ fontSize: 11, color: "#ccc", fontFamily: sans }}>{e.title}</div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : <p style={{ fontSize: 12, color: "#888", fontFamily: sans }}>Select a profile to compare timelines, shared connections, and overlapping events.</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
