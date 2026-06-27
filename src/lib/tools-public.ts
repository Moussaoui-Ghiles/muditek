// Public lead-finder tool pages. Static data module.
// Each entry powers a crawlable /tools/<slug> page that explains a real,
// working portal tool plus an example of its output, then gates the live run
// behind a free account at /portal/tools/<toolSlug>. Mirrors the skills pattern.
//
// Honesty rules baked in: the "sample" rows are clearly labelled illustrative
// examples of the OUTPUT SHAPE, never presented as real scraped records. Every
// claim about what the tool does is grounded in the actual portal tool.

export type ToolCategory = "local-leads" | "linkedin-leads";
export type ToolAccent = "emerald" | "sky" | "primary";

export interface PublicToolPage {
  /** public URL segment: /tools/<slug> */
  slug: string;
  /** gated target: /portal/tools/<toolSlug> */
  toolSlug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  hook: string;
  whoItsFor: string;
  outcome: string;
  category: ToolCategory;
  keywords: string[];
  /** what you type into the tool */
  inputs: { label: string; example: string }[];
  /** how it works, step by step */
  steps: string[];
  /** illustrative example of the output shape */
  sample: { columns: string[]; rows: string[][] };
  /** 150-300 words of real info-gain */
  excerpt: string;
  date: string;
}

export const TOOL_CATEGORY_META: Record<
  ToolCategory,
  { label: string; accent: ToolAccent; toolName: string }
> = {
  "local-leads": {
    label: "Local Business Leads",
    accent: "emerald",
    toolName: "Google Maps Lead Finder",
  },
  "linkedin-leads": {
    label: "LinkedIn Leads",
    accent: "sky",
    toolName: "LinkedIn Lead Finder",
  },
};

const DATE = "2026-06-27";

export const PUBLIC_TOOLS: PublicToolPage[] = [
  // ---------- GOOGLE MAPS LEAD FINDER ----------
  {
    slug: "google-maps-lead-finder",
    toolSlug: "google-maps-lead-finder",
    title: "Google Maps Lead Finder",
    metaTitle: "Free Google Maps Lead Finder: Scrape Local Business Leads | Muditek",
    metaDescription:
      "Pull local business leads from Google Maps for free. Enter a business type and city, get names, websites, phones, ratings, review counts, and any emails found. No card.",
    hook: "Turn any business type and city into a clean list of local leads from Google Maps, free.",
    whoItsFor:
      "Agencies, local service businesses, and outbound teams that sell to local companies and need a fast, targeted list of prospects with contact details.",
    outcome:
      "A list of real businesses matching your search, each with website, phone, address, category, star rating, review count, and any emails the scraper finds. Export it and start outreach the same day.",
    category: "local-leads",
    keywords: [
      "google maps lead finder",
      "scrape google maps leads",
      "find local business leads",
      "google maps scraper free",
      "local lead generation tool",
      "extract business emails from google maps",
    ],
    inputs: [
      { label: "Business type / keyword", example: "dentist, marketing agency, gym" },
      { label: "Location", example: "Austin TX, Lyon France, Manchester UK" },
      { label: "Max results", example: "1 to 25 per run" },
    ],
    steps: [
      "Enter the business type you sell to and the city or area you want to target",
      "The tool runs the Google Maps scraper and reads the live business listings for that search",
      "It returns each business with its website, phone, full address, category, rating, and review count",
      "Where a business publishes an email, it pulls that too, so you can reach the owner directly",
      "Review the list, then export and load it into your outreach or CRM",
    ],
    sample: {
      columns: ["Business", "Website", "Phone", "Rating", "Reviews", "Email"],
      rows: [
        ["Brightsmile Dental", "brightsmiledental.com", "+1 512 555 0143", "4.7", "212", "front desk listed"],
        ["North Loop Family Dentistry", "northloopdental.com", "+1 512 555 0198", "4.9", "486", "contact form"],
        ["Riverside Dental Care", "riversidedental.io", "+1 512 555 0117", "4.5", "98", "info@ listed"],
      ],
    },
    excerpt:
      "The Google Maps Lead Finder does the manual work of building a local prospect list in seconds. You give it two things: the type of business you sell to, and the place you want to target. It searches Google Maps the same way a buyer would, then reads the listings and pulls the details that matter for outreach. For every business it returns the name, website, phone number, full address, primary category, star rating, and total review count, plus any email the business has published.\n\nThat combination is what makes the list usable instead of just a pile of names. The rating and review count tell you how established a business is, so you can prioritize the ones worth a call. The website and phone give you two channels to reach them. The category confirms you are targeting the right segment. You set how many results to pull per run, from one up to twenty five, so you can test a niche before you scale it.\n\nIt works for any local segment with a Maps presence: dentists, gyms, law firms, contractors, salons, restaurants, real estate offices, and local agencies. Run it city by city to build territory lists, or niche by niche to test which segment responds. The full tool runs inside a free account, and the results are yours to export.",
    date: DATE,
  },
  {
    slug: "find-agency-leads",
    toolSlug: "google-maps-lead-finder",
    title: "Find Agency Leads",
    metaTitle: "Find Marketing & Creative Agency Leads (Free Tool) | Muditek",
    metaDescription:
      "Build a list of marketing, creative, and digital agency leads by city. Get agency names, websites, phones, ratings, and emails from Google Maps. Free, no card.",
    hook: "Build a targeted list of marketing and creative agencies in any city, with the contact details to reach them.",
    whoItsFor:
      "Vendors, recruiters, white-label providers, and partnership teams who sell to agencies and need a clean, city-level list of agency prospects.",
    outcome:
      "A list of real agencies in your target city, each with website, phone, rating, review count, and any published email, ready for partnership or sales outreach.",
    category: "local-leads",
    keywords: [
      "find agency leads",
      "marketing agency leads list",
      "digital agency prospect list",
      "agency lead generation tool",
      "list of agencies by city",
      "creative agency contacts",
    ],
    inputs: [
      { label: "Agency type / keyword", example: "marketing agency, web design agency, SEO agency" },
      { label: "Location", example: "London, Toronto, Dubai" },
      { label: "Max results", example: "1 to 25 per run" },
    ],
    steps: [
      "Enter the agency type you want (marketing, creative, web design, SEO, PR) and the city",
      "The tool reads the live Google Maps listings for agencies in that area",
      "It returns each agency with website, phone, address, rating, and review count",
      "Published agency emails are pulled so you can reach the owner or new-business contact",
      "Export the list and load it into your outreach sequence or CRM",
    ],
    sample: {
      columns: ["Agency", "Website", "Phone", "Rating", "Reviews", "Email"],
      rows: [
        ["Northbound Creative", "northboundcreative.co", "+44 20 7946 0321", "4.8", "67", "hello@ listed"],
        ["Pixel & Pitch Agency", "pixelandpitch.com", "+44 161 555 0190", "4.6", "34", "contact form"],
        ["Range Digital", "rangedigital.io", "+44 20 7946 0288", "5.0", "21", "new business listed"],
      ],
    },
    excerpt:
      "If you sell to agencies, the hardest part is building a clean list of the right ones in the right place. This tool does it from Google Maps. You enter the kind of agency you want to reach, marketing, web design, SEO, PR, creative, branding, and the city you are targeting, and it reads the live listings and returns the agencies that match.\n\nEach result comes with the details you need to open a conversation: the agency name, website, phone number, address, star rating, and review count, plus any email the agency publishes. Agencies tend to list a new-business or hello address, which is exactly the inbox you want for a partnership or vendor pitch. The rating and review count help you separate established shops from brand-new one-person operations, so you spend your outreach time on the agencies most likely to have budget and clients.\n\nThis is built for white-label providers, SaaS vendors, recruiters, freelancers, and partnership teams who need agency lists by territory. Run it one city at a time to build a regional pipeline, or test several agency niches to see which one books the most calls. The full tool runs inside a free account and the list is yours to export and use.",
    date: DATE,
  },
  {
    slug: "find-local-service-leads",
    toolSlug: "google-maps-lead-finder",
    title: "Find Local Service Business Leads",
    metaTitle: "Find Local Service Business Leads Free (Dentists, Gyms, Contractors) | Muditek",
    metaDescription:
      "Build lead lists for any local service business: dentists, gyms, salons, contractors, clinics. Names, websites, phones, ratings, emails from Google Maps. Free.",
    hook: "Build a lead list for any local service niche, from dentists to contractors, in one search.",
    whoItsFor:
      "Agencies and B2B sellers who serve local service businesses and need targeted, niche-by-niche prospect lists with real contact details.",
    outcome:
      "A list of local service businesses in your chosen niche and city, each with website, phone, rating, review count, and any published email, ready for outreach.",
    category: "local-leads",
    keywords: [
      "find local service business leads",
      "dentist leads list",
      "contractor leads tool",
      "gym leads scraper",
      "local business email finder",
      "niche local lead generation",
    ],
    inputs: [
      { label: "Service niche / keyword", example: "dentist, plumber, gym, med spa, law firm" },
      { label: "Location", example: "Phoenix AZ, Birmingham UK, Marseille" },
      { label: "Max results", example: "1 to 25 per run" },
    ],
    steps: [
      "Pick the local service niche you sell to and the city you want to work",
      "The tool reads the live Google Maps listings for that niche and area",
      "It returns each business with website, phone, address, rating, and review count",
      "Any published email is pulled so you can reach the owner directly",
      "Export the list and start your calls, emails, or door-to-door outreach",
    ],
    sample: {
      columns: ["Business", "Website", "Phone", "Rating", "Reviews", "Email"],
      rows: [
        ["Summit Physical Therapy", "summitptcare.com", "+1 602 555 0172", "4.9", "311", "info@ listed"],
        ["Apex Plumbing Co", "apexplumbingaz.com", "+1 602 555 0144", "4.6", "188", "contact form"],
        ["Iron Forge Gym", "ironforgegym.fit", "+1 602 555 0109", "4.8", "274", "front desk listed"],
      ],
    },
    excerpt:
      "Local service businesses are one of the best segments to sell into, because there are thousands of them in every city and most are easy to find on Google Maps. This tool turns that into a repeatable list. You choose a niche, dentists, plumbers, gyms, med spas, law firms, clinics, contractors, salons, and a city, and it reads the live listings and returns the businesses that match.\n\nEvery result carries the details that make outreach possible: the business name, website, phone number, address, star rating, review count, and any email the business publishes. For local owners, the phone number is often the fastest route in, while the website and email give you a softer first touch. The rating and review count let you filter for established businesses that already have customers and revenue, which usually means budget for whatever you sell.\n\nBecause you set the niche and the city, you control exactly who lands on your list. Run one niche across several cities to scale a proven pitch, or test several niches in one city to find the segment that converts. This is built for agencies, local SaaS, and B2B sellers who want clean, targeted local lists without paying for a heavy data platform. The full tool runs inside a free account and your results are yours to export.",
    date: DATE,
  },
  {
    slug: "find-restaurant-leads",
    toolSlug: "google-maps-lead-finder",
    title: "Find Restaurant & Hospitality Leads",
    metaTitle: "Find Restaurant & Hospitality Leads Free | Muditek",
    metaDescription:
      "Build restaurant, cafe, bar, and hotel lead lists by city from Google Maps. Get names, websites, phones, ratings, review counts, and emails. Free, no card.",
    hook: "Build a list of restaurants, cafes, bars, and hotels in any city, with the details to reach the owner.",
    whoItsFor:
      "Vendors, POS and software sellers, suppliers, and agencies that serve hospitality and need targeted local lists by city.",
    outcome:
      "A list of hospitality businesses in your target area, each with website, phone, rating, review count, and any published email, ready for outreach.",
    category: "local-leads",
    keywords: [
      "find restaurant leads",
      "restaurant email list tool",
      "hospitality lead generation",
      "cafe and bar leads",
      "restaurant owner contacts",
      "hotel leads scraper",
    ],
    inputs: [
      { label: "Venue type / keyword", example: "restaurant, cafe, bar, hotel, catering" },
      { label: "Location", example: "Miami FL, Barcelona, Lyon" },
      { label: "Max results", example: "1 to 25 per run" },
    ],
    steps: [
      "Enter the venue type you sell to and the city you want to target",
      "The tool reads the live Google Maps listings for that area",
      "It returns each venue with website, phone, address, rating, and review count",
      "Published emails are pulled so you can reach owners and managers",
      "Export the list and start your outreach",
    ],
    sample: {
      columns: ["Venue", "Website", "Phone", "Rating", "Reviews", "Email"],
      rows: [
        ["Olive & Ember", "oliveandember.com", "+1 305 555 0166", "4.7", "529", "events@ listed"],
        ["Harbor House Cafe", "harborhousecafe.co", "+1 305 555 0121", "4.5", "203", "contact form"],
        ["The Copper Tap", "coppertapbar.com", "+1 305 555 0188", "4.8", "417", "manager listed"],
      ],
    },
    excerpt:
      "Hospitality is a high-volume, high-turnover market, which makes a fresh, targeted list more valuable than an old database. This tool builds that list from Google Maps. You enter the kind of venue you sell to, restaurants, cafes, bars, hotels, catering, and the city you want, and it reads the live listings and returns the venues that match your search.\n\nEach result includes the venue name, website, phone number, address, star rating, review count, and any email the business publishes. In hospitality the phone is usually the front line, but many venues also list an events or manager email, which is the right inbox for suppliers, software, and agency pitches. The rating and review volume give you a quick read on how busy and established a venue is, so you can focus on the ones with real footfall and revenue.\n\nThis works for POS and reservation software sellers, food and beverage suppliers, marketing agencies, and anyone who needs venue lists by neighborhood or city. Run it area by area to cover a region, or by venue type to test which segment responds best to your offer. The full tool runs inside a free account and your list is yours to export and use.",
    date: DATE,
  },

  // ---------- LINKEDIN LEAD FINDER ----------
  {
    slug: "linkedin-lead-finder",
    toolSlug: "linkedin-serper-lead-finder",
    title: "LinkedIn Lead Finder",
    metaTitle: "Free LinkedIn Lead Finder: Find Decision-Makers by Role | Muditek",
    metaDescription:
      "Find LinkedIn decision-makers by role, market, and company. Build targeted searches and get live LinkedIn profile results without a Sales Navigator seat. Free.",
    hook: "Find the exact LinkedIn decision-makers you want by role, market, and company, without a Sales Navigator seat.",
    whoItsFor:
      "Founders, SDRs, recruiters, and B2B sellers who need to find named decision-makers on LinkedIn fast and start targeted outreach.",
    outcome:
      "A list of live LinkedIn profile results matching your role, market, and company filters, each with the person's headline and profile link, ready to research and reach out.",
    category: "linkedin-leads",
    keywords: [
      "linkedin lead finder",
      "find linkedin decision makers",
      "linkedin prospecting tool free",
      "find linkedin profiles by role",
      "linkedin lead generation tool",
      "b2b decision maker search",
    ],
    inputs: [
      { label: "Role / title", example: "Head of Marketing, VP Sales, Founder" },
      { label: "Market / location", example: "United States, DACH, Gulf" },
      { label: "Company (optional)", example: "a named company or leave blank" },
    ],
    steps: [
      "Enter the role you want to reach, plus the market and an optional company",
      "The tool builds a precise LinkedIn profile search and runs it through live Google results",
      "It returns matching LinkedIn profiles with each person's name, headline, and profile link",
      "Open the strongest matches, confirm fit, and add them to your outreach list",
      "Repeat with new roles or markets to expand your pipeline",
    ],
    sample: {
      columns: ["Name / Headline", "Profile", "Match"],
      rows: [
        ["Head of Growth at a B2B SaaS company", "linkedin.com/in/...", "role + market"],
        ["VP Marketing, enterprise software", "linkedin.com/in/...", "role + company"],
        ["Founder & CEO, martech startup", "linkedin.com/in/...", "role + market"],
      ],
    },
    excerpt:
      "The LinkedIn Lead Finder helps you find named decision-makers without paying for a Sales Navigator seat or scraping in a way that risks your account. You describe who you want to reach with three inputs: the role or title, the market or location, and optionally a specific company. The tool turns that into a precise search that targets public LinkedIn profiles, then runs it through live Google results and returns the people who match.\n\nEach result gives you the person's name, their LinkedIn headline, and a direct link to the profile. That is enough to confirm fit at a glance and decide who is worth a connection request or a researched message. Because you control the role, market, and company filters, you can be as broad or as surgical as you need: find every Head of Marketing in a region, or zero in on the VP of Sales at one target account.\n\nThis is built for founders running their own outbound, SDRs building account lists, recruiters sourcing candidates, and partnership teams mapping a market. Run it role by role to build a segmented list, or company by company to map the buying committee inside a target account. The full tool runs inside a free account and your results are yours to keep and work.",
    date: DATE,
  },
  {
    slug: "find-b2b-saas-leads",
    toolSlug: "linkedin-serper-lead-finder",
    title: "Find B2B SaaS Decision-Makers",
    metaTitle: "Find B2B SaaS Decision-Makers on LinkedIn (Free) | Muditek",
    metaDescription:
      "Find B2B SaaS buyers on LinkedIn by role and market: founders, VPs of Sales, Heads of Growth, RevOps. Live profile results, no Sales Navigator. Free.",
    hook: "Find the founders, VPs, and growth leaders inside B2B SaaS companies you want to sell to.",
    whoItsFor:
      "Sellers, agencies, and tool vendors targeting B2B SaaS companies who need to reach the real decision-makers, not a generic info inbox.",
    outcome:
      "A list of LinkedIn profiles for SaaS decision-makers matching your role and market, each with headline and link, ready for connection requests and outreach.",
    category: "linkedin-leads",
    keywords: [
      "find b2b saas leads",
      "saas decision makers linkedin",
      "b2b saas prospecting",
      "find saas founders linkedin",
      "saas revops leads",
      "software buyer list tool",
    ],
    inputs: [
      { label: "Role / title", example: "VP Sales, Head of Growth, RevOps Lead, Founder" },
      { label: "Market / location", example: "United States, UK, DACH" },
      { label: "Company (optional)", example: "a named SaaS company or leave blank" },
    ],
    steps: [
      "Enter the SaaS buying role you want, plus the market and an optional company",
      "The tool builds a LinkedIn profile search tuned to that role and runs it live",
      "It returns matching SaaS decision-maker profiles with name, headline, and link",
      "Confirm fit from each headline and add the strongest to your outreach list",
      "Repeat across roles to map the full buying committee",
    ],
    sample: {
      columns: ["Name / Headline", "Profile", "Match"],
      rows: [
        ["VP of Sales at a Series B SaaS company", "linkedin.com/in/...", "role + market"],
        ["Head of Growth, product-led SaaS", "linkedin.com/in/...", "role + market"],
        ["Co-Founder & CEO, vertical SaaS", "linkedin.com/in/...", "role + company"],
      ],
    },
    excerpt:
      "Selling into B2B SaaS means reaching specific people: the founder, the VP of Sales, the Head of Growth, the RevOps lead, the person who owns the budget for what you offer. This tool finds them on LinkedIn without a Sales Navigator seat. You enter the role you want, the market, and optionally a named SaaS company, and it builds a precise search for public LinkedIn profiles and returns the people who match.\n\nEvery result comes with the person's name, their LinkedIn headline, and a direct profile link, so you can confirm seniority and fit before you spend a connection request. SaaS buying is usually a committee, so you can run the tool several times with different roles to map everyone who touches the decision: the economic buyer, the champion, and the user. Or point it at one target account to build the full org map inside that company.\n\nThis is built for SaaS vendors, agencies, and service providers who sell to software companies and need named contacts instead of a generic inbox. Run it role by role to build a segmented pipeline, or account by account to prepare for a focused outbound push. The full tool runs inside a free account and your list is yours to export and work.",
    date: DATE,
  },
  {
    slug: "find-ecommerce-leads",
    toolSlug: "linkedin-serper-lead-finder",
    title: "Find Ecommerce Brand Decision-Makers",
    metaTitle: "Find Ecommerce Brand Decision-Makers on LinkedIn (Free) | Muditek",
    metaDescription:
      "Find ecommerce and DTC brand decision-makers on LinkedIn: founders, ecommerce managers, CMOs, retention leads. Live profile results, no Sales Navigator. Free.",
    hook: "Find the founders and growth leaders inside ecommerce and DTC brands you want to work with.",
    whoItsFor:
      "Agencies, app and tool vendors, and service providers selling to ecommerce and DTC brands who need to reach the people who run growth.",
    outcome:
      "A list of LinkedIn profiles for ecommerce decision-makers matching your role and market, each with headline and link, ready for targeted outreach.",
    category: "linkedin-leads",
    keywords: [
      "find ecommerce leads",
      "dtc brand decision makers",
      "ecommerce founders linkedin",
      "shopify brand leads",
      "ecommerce marketing leads tool",
      "find dtc brands to pitch",
    ],
    inputs: [
      { label: "Role / title", example: "Founder, Ecommerce Manager, CMO, Retention Lead" },
      { label: "Market / location", example: "United States, UK, Europe" },
      { label: "Company (optional)", example: "a named DTC brand or leave blank" },
    ],
    steps: [
      "Enter the ecommerce role you want, plus the market and an optional brand",
      "The tool builds a LinkedIn profile search for that role and runs it live",
      "It returns matching ecommerce decision-makers with name, headline, and link",
      "Confirm fit from each headline and add the best to your outreach list",
      "Repeat across roles and brands to grow the pipeline",
    ],
    sample: {
      columns: ["Name / Headline", "Profile", "Match"],
      rows: [
        ["Founder at a DTC skincare brand", "linkedin.com/in/...", "role + market"],
        ["Ecommerce Manager, fashion brand", "linkedin.com/in/...", "role + market"],
        ["Head of Retention, DTC supplements", "linkedin.com/in/...", "role + company"],
      ],
    },
    excerpt:
      "Ecommerce and DTC brands buy from agencies, apps, and freelancers constantly, but only if you reach the person who owns growth. This tool finds that person on LinkedIn. You enter the role you want, founder, ecommerce manager, CMO, head of retention, performance marketer, plus the market and optionally a named brand, and it builds a precise LinkedIn profile search and returns the people who match.\n\nEach result gives you the person's name, their LinkedIn headline, and a direct profile link, so you can confirm they actually run the function you serve before you reach out. Many DTC brands are lean, so the founder is often the buyer, and the tool lets you target that role directly. For larger brands you can map the team: the ecommerce manager, the retention lead, the paid media owner, each with their own profile.\n\nThis is built for ecommerce agencies, Shopify app makers, email and SMS tools, and service providers who need named brand contacts instead of a support inbox. Run it by role to build a segmented list of brands, or by named brand to map who to pitch inside an account. The full tool runs inside a free account and your results are yours to export and use.",
    date: DATE,
  },
  {
    slug: "find-agency-decision-makers",
    toolSlug: "linkedin-serper-lead-finder",
    title: "Find Agency Owners & Decision-Makers",
    metaTitle: "Find Agency Owners & Decision-Makers on LinkedIn (Free) | Muditek",
    metaDescription:
      "Find agency owners, founders, and new-business leads on LinkedIn by market. Live profile results for partnership and vendor outreach, no Sales Navigator. Free.",
    hook: "Find agency owners, founders, and new-business leads on LinkedIn, ready for a partnership pitch.",
    whoItsFor:
      "White-label providers, SaaS vendors, recruiters, and partnership teams who sell to agencies and need to reach the people who actually decide.",
    outcome:
      "A list of LinkedIn profiles for agency decision-makers matching your market, each with headline and link, ready for partnership or vendor outreach.",
    category: "linkedin-leads",
    keywords: [
      "find agency owners linkedin",
      "agency decision makers list",
      "agency founder outreach",
      "white label agency leads",
      "agency new business contacts",
      "find agency partners linkedin",
    ],
    inputs: [
      { label: "Role / title", example: "Agency Owner, Founder, Managing Director, Head of New Business" },
      { label: "Market / location", example: "United States, UK, Canada" },
      { label: "Company (optional)", example: "a named agency or leave blank" },
    ],
    steps: [
      "Enter the agency role you want, plus the market and an optional agency name",
      "The tool builds a LinkedIn profile search for that role and runs it live",
      "It returns matching agency decision-makers with name, headline, and link",
      "Confirm fit and add the best contacts to your partnership outreach list",
      "Repeat across roles and markets to expand your partner pipeline",
    ],
    sample: {
      columns: ["Name / Headline", "Profile", "Match"],
      rows: [
        ["Founder at a performance marketing agency", "linkedin.com/in/...", "role + market"],
        ["Managing Director, creative agency", "linkedin.com/in/...", "role + market"],
        ["Head of New Business, digital agency", "linkedin.com/in/...", "role + company"],
      ],
    },
    excerpt:
      "If your offer is for agencies, white-label delivery, a SaaS tool, recruiting, or a partnership, you need to reach the owner or the new-business lead, not a generic studio inbox. This tool finds those people on LinkedIn. You enter the role you want, owner, founder, managing director, head of new business, and the market, plus an optional named agency, and it builds a precise profile search and returns the people who match.\n\nEach result gives you the person's name, their LinkedIn headline, and a direct profile link, so you can confirm they hold the seat that decides before you reach out. Most agencies are founder-led, so targeting the owner role gets you straight to the buyer. For larger agencies you can target the new-business or partnerships role, which is the person whose job is literally to take your call.\n\nThis is built for vendors and partners who sell to or through agencies and need named decision-makers by market. Run it role by role to build a segmented partner list, or agency by agency to map who to approach inside a specific shop. The full tool runs inside a free account and your list is yours to export and use.",
    date: DATE,
  },
];

export const PUBLIC_TOOL_SLUGS = PUBLIC_TOOLS.map((t) => t.slug);

export function getPublicTool(slug: string | null | undefined): PublicToolPage | null {
  if (!slug) return null;
  return PUBLIC_TOOLS.find((t) => t.slug === slug) ?? null;
}
