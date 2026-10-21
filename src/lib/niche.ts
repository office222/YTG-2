// FACELESS — Niche Research data & simulated analysis engine.
// All results are deterministic demonstration data (no external APIs).

export const NICHES = [
  "Personal Finance",
  "Making Money Online",
  "Business and Entrepreneurship",
  "Artificial Intelligence",
  "Technology",
  "Health and Fitness",
  "Weight Loss",
  "Food and Cooking",
  "Travel",
  "History",
  "True Crime",
  "Mystery",
  "Celebrity News",
  "Sports",
  "Cars",
  "Home Improvement",
  "Pets and Animals",
  "Relationships",
  "Motivation and Self-Improvement",
  "Education",
  "Music",
  "Gaming",
  "Product Reviews",
  "Other",
] as const;

export const AUDIENCES = [
  "General Audience",
  "Children and Families",
  "Teenagers",
  "Young Adults",
  "Parents",
  "Professionals",
  "Business Owners",
  "Retirees",
  "Hobbyists",
  "Local Audience",
  "Worldwide Audience",
  "Not Sure Yet",
] as const;

export const FORMATS = [
  "Narrated Videos",
  "Stock Footage Videos",
  "Animated Videos",
  "Screen Recordings",
  "Slideshows",
  "News and Commentary",
  "Tutorials and How-To Videos",
  "Documentary Style",
  "Compilation Videos",
  "Shorts",
  "Long-Form Videos",
  "Not Sure—Recommend One",
] as const;

export const FREQUENCIES = [
  "Daily",
  "Three Times Per Week",
  "Twice Per Week",
  "Weekly",
  "Twice Per Month",
  "Monthly",
  "Not Sure—Recommend a Schedule",
] as const;

export const GOALS = [
  "Generate Income",
  "Grow an Audience",
  "Build Authority",
  "Generate Business Leads",
  "Promote Products or Services",
  "Build a Sellable Channel",
  "Hobby or Personal Interest",
  "Not Sure Yet",
] as const;

export const EXPERIENCE_LEVELS = [
  "Complete Beginner",
  "Some Experience",
  "Experienced Creator",
] as const;

export const TIME_OPTIONS = [
  "Less Than 2 Hours Per Week",
  "2–5 Hours Per Week",
  "5–10 Hours Per Week",
  "More Than 10 Hours Per Week",
  "I Want Maximum Automation",
  "Not Sure",
] as const;

export const BUDGET_OPTIONS = [
  "No Budget",
  "Under $50",
  "$50–$100",
  "$100–$250",
  "More Than $250",
  "Not Sure Yet",
] as const;

export const LIFESPAN_OPTIONS = [
  {
    value: "Evergreen",
    blurb: "Helpful content that can attract viewers for years",
  },
  {
    value: "Trending",
    blurb: "Timely content designed to capture current interest",
  },
  {
    value: "Hybrid",
    blurb: "Mostly evergreen content supported by selected trends",
  },
  {
    value: "Not Sure—Recommend One",
    blurb: "We'll recommend a strategy based on your other answers",
  },
] as const;

export type NicheInput = {
  niche: string;
  customNiche: string;
  audiences: string[];
  formats: string[];
  frequency: string;
  goal: string;
  experience: string;
  time: string;
  budget: string;
  lifespan: string;
};

export type Rating = "Low" | "Moderate" | "High" | "Very High";

export type NicheReport = {
  nicheLabel: string;
  score: number;
  demand: Rating;
  competition: Rating;
  monetization: Rating;
  longevity: Rating;
  difficulty: Rating;
  evergreenPotential: Rating;
  trendDependence: Rating;
  recommendedFrequency: string;
  timeToTraction: string;
  opportunities: string[];
  risks: string[];
  videoLifespan: string;
  refreshNote: string;
  recommendation: string;
  conclusion: "Strong Opportunity" | "Promising With Adjustments" | "High-Risk Niche";
  conclusionNote: string;
  recommendedFormats: string[];
  lifespanStrategy: string;
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ratingOf(v: number): Rating {
  if (v < 30) return "Low";
  if (v < 55) return "Moderate";
  if (v < 80) return "High";
  return "Very High";
}

export const RATING_PCT: Record<Rating, number> = {
  Low: 22,
  Moderate: 48,
  High: 74,
  "Very High": 96,
};

const HIGH_COMPETITION = [
  "Personal Finance",
  "Making Money Online",
  "Weight Loss",
  "Health and Fitness",
  "Celebrity News",
  "Gaming",
];

export function analyzeNiche(input: NicheInput): NicheReport {
  const nicheLabel =
    input.niche === "Other" && input.customNiche.trim()
      ? input.customNiche.trim()
      : input.niche;
  const h = hash(nicheLabel + input.goal + input.experience);
  const base = 50 + (h % 28); // 50–77 deterministic baseline

  const lowTime =
    input.time === "Less Than 2 Hours Per Week" ||
    input.time === "2–5 Hours Per Week";
  const beginner = input.experience === "Complete Beginner";
  const noBudget = input.budget === "No Budget";
  const wantsAutomation = input.time === "I Want Maximum Automation";
  const worldwide = input.audiences.includes("Worldwide Audience");

  // Resolve "Not Sure" selections into concrete recommendations.
  let lifespan = input.lifespan;
  if (lifespan === "Not Sure—Recommend One") {
    lifespan = lowTime || beginner ? "Hybrid" : "Evergreen";
  }

  let recommendedFormats: string[] = [];
  if (input.formats.includes("Not Sure—Recommend One") || input.formats.length === 0) {
    if (wantsAutomation) recommendedFormats = ["Narrated Videos", "Slideshows", "Compilation Videos"];
    else if (lowTime) recommendedFormats = ["Shorts", "Narrated Videos"];
    else recommendedFormats = ["Narrated Videos", "Tutorials and How-To Videos"];
  }

  // Ratings (simulated, logically adjusted)
  let demandN = base + (worldwide ? 8 : 0) + (input.goal === "Grow an Audience" ? 6 : 0);
  let competitionN =
    50 + (hash(nicheLabel) % 30) + (HIGH_COMPETITION.includes(input.niche) ? 14 : 0);
  let monetizationN =
    base +
    (input.goal === "Generate Income" ? 12 : 0) +
    (input.goal === "Generate Business Leads" ? 9 : 0) +
    (input.goal === "Hobby or Personal Interest" ? -16 : 0) +
    (noBudget ? -6 : 0);
  let difficultyN =
    35 +
    (beginner ? 14 : input.experience === "Some Experience" ? 6 : 0) +
    (input.formats.includes("Animated Videos") ? 14 : 0) +
    (input.formats.includes("Documentary Style") ? 12 : 0) +
    (input.formats.includes("Shorts") ? -8 : 0) +
    (input.formats.includes("Slideshows") ? -10 : 0) +
    (noBudget && (input.formats.includes("Animated Videos") || input.formats.includes("Documentary Style")) ? 10 : 0);

  let longevityN: number;
  let evergreenN: number;
  let trendN: number;
  let videoLifespan: string;
  let refreshNote: string;
  let lifespanStrategy: string;
  if (lifespan === "Evergreen") {
    longevityN = 78; evergreenN = 86; trendN = 16;
    videoLifespan = "2–5+ years per video";
    refreshNote = "Refresh titles and thumbnails once a year to keep strong videos climbing.";
    lifespanStrategy = "Evergreen";
  } else if (lifespan === "Trending") {
    longevityN = 30; evergreenN = 18; trendN = 88;
    videoLifespan = "2–12 weeks per video";
    refreshNote = "Trending videos date quickly — plan follow-ups instead of refreshing old uploads.";
    lifespanStrategy = "Trending";
  } else {
    longevityN = 62; evergreenN = 66; trendN = 46;
    videoLifespan = "1–3 years per video";
    refreshNote = "Update evergreen videos yearly; let trending uploads fade naturally.";
    lifespanStrategy = "Hybrid (~80% evergreen / 20% trending)";
  }

  demandN = Math.min(demandN, 96);
  competitionN = Math.min(competitionN, 96);
  monetizationN = Math.max(10, Math.min(monetizationN, 96));
  difficultyN = Math.max(10, Math.min(difficultyN, 96));

  // Recommended frequency
  let recommendedFrequency = input.frequency;
  let schedulePenalty = 0;
  if (input.frequency === "Not Sure—Recommend a Schedule") {
    recommendedFrequency = lowTime
      ? "Weekly"
      : input.time === "More Than 10 Hours Per Week"
        ? "Three Times Per Week"
        : "Twice Per Week";
  } else if (input.frequency === "Daily" && (lowTime || beginner)) {
    recommendedFrequency = lowTime ? "Weekly" : "Twice Per Week";
    schedulePenalty = 10;
  } else if (lifespan === "Trending" && (input.frequency === "Monthly" || input.frequency === "Twice Per Month")) {
    recommendedFrequency = "Twice Per Week";
    schedulePenalty = 6;
  }

  // Overall score
  let score =
    0.3 * demandN + 0.25 * monetizationN + 0.2 * longevityN +
    0.15 * (100 - competitionN) + 0.1 * (100 - difficultyN) - schedulePenalty;
  score = Math.round(Math.max(18, Math.min(score, 95)));

  const conclusion: NicheReport["conclusion"] =
    score >= 70 ? "Strong Opportunity" : score >= 52 ? "Promising With Adjustments" : "High-Risk Niche";
  const conclusionNote =
    conclusion === "Strong Opportunity"
      ? "This niche lines up well with your time, budget, and goals. You can move forward with confidence."
      : conclusion === "Promising With Adjustments"
        ? "This niche can work, but a few adjustments — mostly around format and publishing pace — will improve your odds."
        : "This combination is risky for your current time and budget. Consider an easier format or a related niche.";

  // Time to traction
  const timeToTraction =
    lifespan === "Trending"
      ? beginner ? "6–10 weeks" : "4–8 weeks"
      : beginner ? "4–8 months" : "3–6 months";

  // Opportunities
  const opportunities: string[] = [];
  if (lifespan === "Evergreen") {
    opportunities.push(`Build a library of lasting "${nicheLabel}" videos that keep attracting search viewers for years.`);
  } else if (lifespan === "Trending") {
    opportunities.push(`Ride current interest in ${nicheLabel} for faster early views and subscriber growth.`);
  } else {
    opportunities.push(`Anchor the channel with evergreen ${nicheLabel} topics, then add roughly 2 in 10 videos on trends for bursts of growth.`);
  }
  if (wantsAutomation) {
    opportunities.push("Formats like narrated videos, slideshows, and compilations can eventually be produced efficiently through FACELESS automation.");
  } else if (recommendedFormats.length > 0) {
    opportunities.push(`Start with ${recommendedFormats.join(" and ")} — a good match for your available time and experience.`);
  } else {
    opportunities.push(`Your chosen formats fit a faceless workflow, so you never need to appear on camera.`);
  }
  if (input.goal === "Build a Sellable Channel") {
    opportunities.push("Evergreen, consistently published channels are the easiest to sell later — keep a steady schedule.");
  } else if (input.goal === "Generate Business Leads") {
    opportunities.push("Tutorial-style videos double as trust builders that can funnel viewers to your business.");
  } else if (worldwide) {
    opportunities.push("A worldwide audience gives you room to grow even if early videos reach a small slice of viewers.");
  } else {
    opportunities.push("Clear audience targeting helps the YouTube algorithm find your first viewers faster.");
  }

  // Risks
  const risks: string[] = [];
  if (input.frequency === "Daily" && (lowTime || beginner)) {
    risks.push(`Daily publishing is likely unrealistic with your ${beginner ? "beginner experience" : "available time"} — we recommend ${recommendedFrequency.toLowerCase()} instead so you don't burn out.`);
  }
  if (lifespan === "Trending") {
    risks.push("Trending videos lose value quickly, so you'll need to publish more often to keep momentum.");
  }
  if (noBudget && (input.formats.includes("Animated Videos") || input.formats.includes("Documentary Style"))) {
    risks.push("Animation and documentary formats are expensive to produce — with no budget, stick to simpler formats first.");
  } else if (noBudget) {
    risks.push("With no budget, avoid paid tools and stock footage subscriptions until the channel earns its first income.");
  }
  if (competitionN >= 75) {
    risks.push(`${nicheLabel} is a competitive space — you'll need distinctive titles and thumbnails to stand out.`);
  }
  if (beginner) {
    risks.push("As a complete beginner, expect a learning curve in the first 1–2 months; keep videos simple at the start.");
  }
  if (risks.length < 3) {
    risks.push("Consistency matters more than perfection — most new channels quit before the algorithm learns who to show them to.");
  }
  const topRisks = risks.slice(0, 3);

  // Recommendation paragraph
  const parts: string[] = [];
  const strat = lifespanStrategy.toLowerCase();
  const article = /^[aeiou]/.test(strat) ? "an" : "a";
  parts.push(
    `For a ${input.experience.toLowerCase()} creator focused on ${nicheLabel}, we suggest ${article} ${strat} content strategy published ${recommendedFrequency.toLowerCase()}.`
  );
  if (wantsAutomation) {
    parts.push("Because you want maximum automation, lean on narrated videos, slideshows, and compilations — these are the formats FACELESS can help you produce most efficiently as the platform grows.");
  }
  if (noBudget) {
    parts.push("Since you have no budget, keep production simple: free editing tools and simple narration or slideshow formats until revenue starts.");
  }
  if (lifespan === "Trending") {
    parts.push("Expect faster early growth from trends, but remember each video has a short shelf life — momentum depends on frequent publishing.");
  } else if (lifespan === "Hybrid") {
    parts.push("Aim for roughly 80% evergreen videos and 20% trend-based uploads for steady long-term growth with occasional spikes.");
  } else {
    parts.push("Prioritize topics with lasting search demand rather than current events so every video keeps working for you.");
  }
  if (schedulePenalty > 0) {
    parts.push(`We've adjusted your schedule to ${recommendedFrequency.toLowerCase()} — a pace you can sustain beats an ambitious one you abandon.`);
  }

  return {
    nicheLabel,
    score,
    demand: ratingOf(demandN),
    competition: ratingOf(competitionN),
    monetization: ratingOf(monetizationN),
    longevity: ratingOf(longevityN),
    difficulty: ratingOf(difficultyN),
    evergreenPotential: ratingOf(evergreenN),
    trendDependence: ratingOf(trendN),
    recommendedFrequency,
    timeToTraction,
    opportunities: opportunities.slice(0, 3),
    risks: topRisks,
    videoLifespan,
    refreshNote,
    recommendation: parts.join(" "),
    conclusion,
    conclusionNote,
    recommendedFormats,
    lifespanStrategy,
  };
}
