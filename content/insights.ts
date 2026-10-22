import type { Insight } from "@/types";

/**
 * Starter articles. Edit freely; add new entries and they will appear on the
 * homepage, the /insights index, the sitemap and their own /insights/[slug] page.
 */
export const insights: Insight[] = [
  {
    slug: "lead-quality-over-lead-volume",
    title: "Why lead quality matters more than lead volume",
    category: "Lead generation",
    readingMinutes: 6,
    published: "2026-10-01",
    summary:
      "A low cost per lead can hide an expensive problem. Here's how to define a qualified lead, measure it by campaign, and point your ad platforms at the leads your sales team actually wants.",
    sections: [
      {
        paragraphs: [
          "Most lead-generation campaigns are judged on two numbers: how many leads came in, and what each one cost. Both are easy to read in an ad platform, and both can improve while the business gets worse.",
          "If a cheaper campaign brings in enquiries that never answer the phone, are outside your service area, or have no budget, the low cost per lead is an illusion. Your sales team spends time on those leads, real opportunities wait longer for a response, and the ad platform keeps learning to find more of the same people.",
        ],
      },
      {
        heading: "Start by defining “qualified”",
        paragraphs: [
          "A qualified lead is not a universal concept. It is an agreement between marketing and sales about which enquiries are worth pursuing. Write it down in plain language, using criteria someone can check within a day or two of the lead arriving.",
        ],
        list: [
          "Reachable: valid contact details and a response to the first follow-up",
          "In scope: the product, service area or course matches what you sell",
          "Able to buy: budget, timeline or eligibility that fits",
          "Intent: the enquiry is a genuine request, not research or spam",
        ],
      },
      {
        heading: "Connect each lead to the campaign that produced it",
        paragraphs: [
          "Quality can only be measured by campaign if the campaign travels with the lead. That means consistent UTM parameters on every ad, hidden fields on forms that capture them, and CRM fields that store them. Where possible, store the click identifier (such as gclid or fbclid) too, which makes it possible to send outcomes back to the ad platforms later.",
          "Once that link exists, a simple weekly report becomes possible: for each campaign, show leads, qualified leads, the qualified-lead rate and the cost per qualified lead. It is often the most useful single view a lead-generation business can have.",
        ],
      },
      {
        heading: "Expect the ranking to change",
        paragraphs: [
          "When campaigns are ranked by cost per qualified lead instead of cost per lead, the order frequently changes. Broad prospecting campaigns that look efficient can fall behind narrower, higher-intent campaigns that looked expensive. That doesn't mean broad campaigns are bad. It means their role, and their budget, should be decided with full information.",
        ],
      },
      {
        heading: "Feed quality back to the platforms",
        paragraphs: [
          "Meta and Google both optimize toward whatever conversion event you give them. If that event is a form submission, they will find people who submit forms. Where the data allows it, importing qualified-lead or sale events (through offline conversion imports or CRM integrations) lets the platforms optimize toward the outcome you care about.",
          "This needs volume and consistency to work well, and it depends on the sales team updating lead statuses promptly. That operational habit is often the real bottleneck, and worth solving first.",
        ],
      },
      {
        heading: "A practical starting point",
        paragraphs: [
          "You don't need a sophisticated attribution model to begin. Agree on a definition, make sure campaign data reaches the CRM, and review cost per qualified lead every week alongside the platform numbers. Within a few cycles you will know far more about which spend is working, and so will the people deciding where the next budget goes.",
        ],
      },
    ],
  },
  {
    slug: "evaluating-advertising-beyond-roas",
    title: "How to evaluate advertising beyond ROAS",
    category: "Measurement",
    readingMinutes: 7,
    published: "2026-10-06",
    summary:
      "Return on ad spend is a useful signal and a poor decision rule. A look at margin, new-customer share, incrementality and payback, and how to use them together.",
    sections: [
      {
        paragraphs: [
          "Return on ad spend (ROAS) divides attributed revenue by advertising cost. It is simple, available in every ad platform, and easy to compare. It is also easy to over-trust, because it leaves out several things that determine whether advertising is actually profitable.",
        ],
      },
      {
        heading: "1. Revenue is not profit",
        paragraphs: [
          "A ROAS of 4 means very different things for a product with a 70% gross margin and one with a 25% margin. Before comparing campaigns, convert revenue into contribution margin: revenue minus cost of goods, shipping, payment fees, discounts and expected returns. A break-even ROAS for each product line follows directly from that margin, and it is a far better target than a single account-wide number.",
        ],
      },
      {
        heading: "2. Platform-attributed revenue overlaps",
        paragraphs: [
          "Each advertising platform reports the conversions it can claim under its own attribution rules. When a customer sees a Meta ad and later clicks a Google search ad, both platforms may count the same order. Summing platform-reported revenue therefore often exceeds the revenue your store or CRM actually recorded.",
          "A useful habit is to compare total platform-attributed revenue with actual revenue for the same period. The gap won't tell you which platform is right, but it shows how much overlap you are dealing with and stops double-counting from inflating your sense of performance.",
        ],
      },
      {
        heading: "3. Not every sale is new",
        paragraphs: [
          "Retargeting and brand-search campaigns often show the highest ROAS because they reach people who were already likely to buy. Some of that revenue would have arrived anyway. Splitting results by new versus returning customers shows how much of your spend is genuinely acquiring customers, and how much is collecting demand that already existed.",
        ],
      },
      {
        heading: "4. Incrementality is the real question",
        paragraphs: [
          "The question that matters is: what would have happened without this spend? Incrementality tests (geographic holdouts, platform conversion-lift studies, or carefully timed on/off tests) estimate it directly. They need planning and enough volume to be meaningful, and the results come with confidence intervals rather than certainties. Even an occasional, well-designed test can recalibrate how much weight you give to day-to-day attributed numbers.",
        ],
      },
      {
        heading: "5. Customers have a lifetime, not just a first order",
        paragraphs: [
          "For businesses with repeat purchases or subscriptions, the first order rarely tells the full story. Customer acquisition cost (CAC) compared against expected contribution margin over a defined period, and the payback period that implies, is a more durable lens than first-order ROAS. Be conservative with lifetime-value assumptions, especially for young businesses with limited purchase history.",
        ],
      },
      {
        heading: "Putting it together",
        paragraphs: ["A balanced weekly view might include:"],
        list: [
          "Spend, platform-attributed revenue and actual revenue, side by side",
          "Contribution margin after ad spend, by channel",
          "New-customer share and cost per new customer",
          "Payback period for recent acquisition cohorts",
          "Notes on any incrementality evidence and its limits",
        ],
      },
      {
        paragraphs: [
          "ROAS remains useful for spotting changes quickly inside a platform. It just shouldn't be the only number deciding where the budget goes.",
        ],
      },
    ],
  },
  {
    slug: "conversion-tracking-mistakes",
    title: "Five conversion tracking mistakes that distort marketing decisions",
    category: "Analytics",
    readingMinutes: 6,
    published: "2026-10-12",
    summary:
      "Duplicate events, missing UTMs, the wrong optimization goal, and more. Common tracking errors that quietly mislead campaign decisions, and how to check for each.",
    sections: [
      {
        paragraphs: [
          "Campaign decisions are only as good as the conversion data behind them. Tracking problems rarely announce themselves. Reports keep filling with numbers, and nobody notices that the numbers mean something different from what they appear to. These five issues are among the most common, and each can be checked in an afternoon.",
        ],
      },
      {
        heading: "1. Counting the same conversion twice",
        paragraphs: [
          "Duplicate conversions happen when a thank-you page fires an event on every reload, when both a browser pixel and a server-side integration report the same event without de-duplication, or when the same goal is configured in two tools that are both imported into the ad platform.",
          "How to check: compare the conversion count in each platform with the number of real records (orders, CRM leads) for the same period. Large, consistent differences in one direction usually point to duplication.",
        ],
      },
      {
        heading: "2. Optimizing for the wrong event",
        paragraphs: [
          "If a campaign is told to optimize for page views, button clicks or “add to cart”, it will find people who do those things, which may not be the people who buy. Micro-conversions can help new campaigns gather data, but the primary optimization goal should be as close to real business value as your volume allows.",
          "How to check: list the primary conversion action for every active campaign and confirm each one is the outcome you would actually pay for.",
        ],
      },
      {
        heading: "3. Losing the source between the click and the CRM",
        paragraphs: [
          "Inconsistent or missing UTM parameters, redirects that strip query strings, and forms that don't capture campaign data all break the chain from ad to lead. The result is a CRM full of leads labelled “direct” or “unknown”, and no way to judge campaigns by lead quality.",
          "How to check: submit a test enquiry from each live ad and confirm the campaign details arrive intact in the CRM record.",
        ],
      },
      {
        heading: "4. Ignoring consent and browser restrictions",
        paragraphs: [
          "Consent requirements, ad blockers and browser privacy features mean that some conversions are never observed by client-side tags. That is expected and, in many regions, legally required. The mistake is treating the observed numbers as complete. Trends may still be useful, but absolute totals and cross-channel comparisons need care.",
          "How to check: understand your consent setup and estimate the share of conversions you can observe, for example by comparing tagged conversions with backend records. Server-side or modelled approaches can help, within the limits of your consent obligations.",
        ],
      },
      {
        heading: "5. Mixing attribution windows and definitions",
        paragraphs: [
          "Platforms use different default attribution windows and models, and those defaults change over time. Comparing a 7-day-click figure from one platform with a 30-day-click-plus-view figure from another isn't a fair comparison, and neither matches what your analytics tool reports.",
          "How to check: document the attribution setting behind every number in your reports, align settings where possible, and label any figure that uses a different basis.",
        ],
      },
      {
        heading: "Make tracking a maintained system",
        paragraphs: [
          "Tracking isn't a one-time setup. Site changes, new forms, platform updates and new campaigns all introduce risk. A short monthly check, comparing platform conversions with real records and testing a few key journeys end-to-end, catches most problems before they influence a budget decision.",
        ],
      },
    ],
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}
