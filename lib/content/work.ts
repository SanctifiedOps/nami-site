import type { LucideIcon } from "lucide-react";
import { Crown, Activity, Dog, Dumbbell, Zap, Building2 } from "lucide-react";

export type CaseStudyAccent = "magenta" | "cyan" | "amber" | "violet";

export type CaseStudy = {
  slug: string;
  index: string;
  client: string;
  sector: string;
  year: string;
  status: "Live" | "Ongoing" | "Complete" | "Recently launched" | "In delivery";
  liveUrl: string;
  cover: string;
  pillars: string[];
  tagline: string;
  /** Hero-title split: lead in default colour, accent in gradient on a new line. */
  heroTitle: { lead: string; accent: string };
  oneLiner: string;
  brief: string;
  approach: string[];
  deliverables: string[];
  outcomes?: { label: string; value: string }[];
  testimonial?: { quote: string; author: string; role: string };
  icon: LucideIcon;
  accent: CaseStudyAccent;
  featured?: boolean;
};

export const work: CaseStudy[] = [
  {
      slug: "whittaker-property-group",
      index: "01",
      client: "Whittaker Property Group",
      sector: "Property · North East",
      year: "2026",
      status: "Ongoing",
      liveUrl: "https://whittakerpropertygroup.co.uk",
      cover: "/case-study/WPG%20Cover%20(1).png",
      pillars: [
        "Content Strategy",
        "Website",
        "Automation",
        "CRM",
        "Paid Social",
      ],
      tagline: "North East property, done properly",
      heroTitle: {
        lead: "North East property,",
        accent: "done properly",
      },
      oneLiner:
        "Website, content, lead flow, CRM, and paid social support for a property group moving into its next phase.",
      brief:
        "Whittaker Property Group needed more than a tidy website. The business was moving from a mainly investor-led model into a broader estate agency and property group, with vendor lead generation becoming the priority. The public face had to feel sharper, and the working parts behind it had to stop creating extra admin for the team.",
      approach: [
        "The work started with the positioning: WPG as a North East property group that can speak to vendors, buyers, investors, and landlords without blurring the message. Content strategy gave each audience a clearer route through the business, while keeping the tone direct, local, and commercially useful.",
        "The website and landing pages were built around the new supply-led priority. Core pages, campaign pages, and contact routes were shaped so different audiences could land in the right place: selling, buying, investment, portfolio work, or a more direct campaign-specific enquiry.",
        "Behind the scenes, the lead flow was tightened through HubSpot, forms, CRM tagging, GA4 tracking, and campaign attribution. Paid social could then drive people into specific journeys, with the team getting cleaner context when a lead came in.",
      ],
      deliverables: [
        "Content strategy and positioning refresh",
        "Website development for the main WPG site",
        "Campaign landing pages for vendor lead generation",
        "Automation and lead-flow wiring",
        "HubSpot CRM development and contact tagging",
        "GA4 conversion tracking and campaign attribution",
        "Paid social management across WPG vendor campaigns",
      ],
      outcomes: [
        { label: "Campaign stack", value: "Meta · GA4 · HubSpot" },
        { label: "Lead routes", value: "Sell · Buy · Source · Contact" },
        { label: "Core focus", value: "Vendor supply" },
        { label: "Region", value: "North East" },
      ],
      icon: Building2,
      accent: "magenta",
      featured: true,
    },
  {
      slug: "the-league",
      index: "02",
      client: "The League",
      sector: "Members club · United Kingdom",
      year: "2026",
      status: "Ongoing",
      liveUrl: "https://jointheleague.uk",
      cover: "/case-study/league-cs.png",
      pillars: ["Brand", "Website", "Content", "Email"],
      tagline: "Where Extraordinary Humans Meet",
      heroTitle: {
        lead: "Where Extraordinary",
        accent: "Humans Meet.",
      },
      oneLiner: "A members club brand built around character, not status.",
      brief:
        "The League is a private dining society for people who have defied the odds. The brand had to carry that level of selectivity without sliding into the usual luxury-club tropes, and the digital infrastructure had to run nationwide events, invite-only applications, and ongoing member communications.",
      approach: [
        "Positioning came first: 'we don't measure worth by wealth, title, or fame.' Voice, identity, and applied guidelines designed to read as confident and quietly elitist, never loud about it. Selection is by character, story, and achievement; the brand had to embody that.",
        "The website was built as the application entry point. Every visitor is a potential member, every page nudges toward the invitation conversation. Conversion structure runs underneath an editorial-feeling experience.",
        "Content and lifecycle email tie the brand into how members meet the club between events: gathering announcements, speaker reveals, post-event automations, and the steady-state communications that hold a private community together.",
      ],
      deliverables: [
        "Positioning, voice, and identity system",
        "Conversion-led website (jointheleague.uk)",
        "Editorial content direction",
        "Lifecycle email design + templates",
      ],
      outcomes: [
        { label: "Members per gathering", value: "30" },
        { label: "Access model", value: "Invitation only" },
        { label: "Reach", value: "Nationwide UK" },
      ],
      icon: Crown,
      accent: "violet",
      featured: false,
    },
  {
      slug: "vessl",
      index: "03",
      client: "VESSL",
      sector: "Fitness · Direct-to-consumer",
      year: "2026",
      status: "Complete",
      liveUrl: "https://vessl-ltd.co.uk",
      cover: "/case-study/vessl-cs.png",
      pillars: ["Website", "Funnel", "Automation"],
      tagline: "Strength in Motion",
      heroTitle: {
        lead: "Strength in",
        accent: "Motion.",
      },
      oneLiner: "A premium landing funnel for a movement-first fitness platform.",
      brief:
        "VESSL needed a high-conversion landing page for a tiered fitness subscription, built mobile-first with iOS-grade polish, designed as a single conversion path from ad traffic to plan signup. Honest by design: no fake metrics, no inflated trust badges.",
      approach: [
        "One funnel, one ask. The page reads as a single corridor: hero, proof of system, three-tier pricing, signup. Every section earns its place against the conversion goal; nothing decorative, nothing detouring.",
        "Premium feel without a heavy framework. Lightweight build, CSS-only styling, prefers-reduced-motion respected, motion used only where it carries information. iOS-feel typography and a restrained palette (Charcoal, Mist, Core Teal) so the brand reads premium on the smallest device first.",
        "Automation wired behind the form: lead capture, qualification, and routing. Every signup gets handled the same way without manual triage.",
      ],
      deliverables: [
        "Conversion-led landing page (mobile-first)",
        "Three-tier pricing + signup flow",
        "Form + lead automation pipeline",
        "Brand-aligned design system (CSS-only)",
      ],
      outcomes: [
        {
          label: "Subscription tiers",
          value: "Foundation · Premium · Elite",
        },
        { label: "Trial", value: "7-day free, no commitment" },
      ],
      icon: Dumbbell,
      accent: "cyan",
      featured: false,
    },
  {
      slug: "millions",
      index: "04",
      client: "MILLIONS",
      sector: "On-chain intelligence · Solana",
      year: "2025",
      status: "Complete",
      liveUrl: "https://thiswilldomillions.com",
      cover: "/case-study/millions-cs.png",
      pillars: ["Brand", "Dashboard", "AI Systems", "Automation"],
      tagline: "If you're checking Dexscreener, you're already late",
      heroTitle: {
        lead: "If you're checking Dexscreener,",
        accent: "you're already late.",
      },
      oneLiner: "Brand and live infrastructure for an on-chain signal service.",
      brief:
        "MILLIONS is a real-time signal service for Solana: wallet scoring, dev-pattern detection, cluster alerts, alpha-funding detection. The brand had to feel as sharp as the data underneath it, and the product had to launch as one piece: identity, dashboard, and automated alerting in lockstep.",
      approach: [
        "Brand work set the tone: confident, technical, transparent. Identity leans into the precision side of on-chain rather than the speculation side, separating MILLIONS from the noise of generic alpha groups. The voice quotes the product's own logic: 'we follow the money.'",
        "The live dashboard pulls four scoring engines into one place: smart-wallet tracking, dev-wallet scoring, cluster detection, alpha-funding detection. Re-ranking runs continuously, cold wallets auto-demote, hot ones rise. Methodology is published, not black-boxed.",
        "Automation closes the loop. Signals fire to Discord and Telegram in under a second of the on-chain event, hitting subscribers where they already are instead of asking them to refresh another tab.",
      ],
      deliverables: [
        "Identity system + brand voice",
        "Live signal dashboard (web)",
        "Wallet-scoring + dev-pattern intelligence pipeline",
        "Discord + Telegram automated alerting (sub-1s latency)",
        "Subscription + access infrastructure",
      ],
      outcomes: [
        { label: "Smart wallets tracked", value: "583" },
        { label: "Deployer wallets scored", value: "37,340" },
        { label: "Cumulative call multiplier", value: "19,840×" },
        { label: "Biggest single call", value: "531×" },
      ],
      icon: Activity,
      accent: "magenta",
      featured: false,
    },
  {
      slug: "energy-consultants-association",
      index: "05",
      client: "Energy Consultants Association",
      sector: "Trade body · UK energy industry",
      year: "2024",
      status: "Complete",
      liveUrl: "https://energyconsultantsassociation.co.uk",
      cover: "/case-study/eca-cs.webp",
      pillars: ["Brand", "Content", "Events", "Membership Ops"],
      tagline: "A trade body built to be heard",
      heroTitle: {
        lead: "A trade body",
        accent: "built to be heard.",
      },
      oneLiner:
        "Brand, member operations, and a Westminster-ready presence for the UK's independent energy consultants.",
      brief:
        "The ECA is the independent, not-for-profit trade body for UK energy consultants. The brand had to carry weight with members, suppliers, regulators, and Westminster in the same breath, and the operations had to scale from a standing start into a recognised industry voice. Identity, member ops, content, and live presence built as one piece.",
      approach: [
        "Positioning came first. Independent. Not-for-profit. Built by consultants, for consultants. Identity, voice, and applied guidelines designed to read as serious enough for regulators and policymakers while staying clearly owned by the members it represents. The brand had to sit on a Westminster briefing or an industry main stage without missing a beat.",
        "Member operations wired end-to-end. Onboarding campaigns, membership billing, and the steady-state communications that hold a trade body together between events. A webinar programme built around the issues members care about: Commission Claims Defence, Ofgem Non-Domestic Reviews, Flexible Purchasing. Members hear from the association consistently, not just at renewal.",
        "Visibility was the multiplier. AGMs and member events run in person, speaking spaces secured at Energy Live News (one of the largest utilities roadshows in the UK), and direct campaign work alongside Sarah Edwards MP that took the association inside Downing Street. Every appearance reinforced the same message: consultants deserve a seat at the table.",
      ],
      deliverables: [
        "Brand identity, voice, and applied guidelines",
        "Member onboarding campaigns",
        "Membership onboarding + billing operations",
        "Webinar programme (regulatory + commercial topics)",
        "AGMs and in-person member events",
        "Speaker placements + Westminster campaign presence",
      ],
      outcomes: [
        { label: "Members onboarded", value: "75" },
        { label: "Time to scale", value: "18 months" },
        { label: "Industry stage", value: "Energy Live News" },
        { label: "Westminster", value: "Downing Street campaign" },
      ],
      icon: Zap,
      accent: "cyan",
      featured: false,
    },
  {
      slug: "barking-puppy",
      index: "06",
      client: "Barking Puppy",
      sector: "Community brand · Solana",
      year: "2026",
      status: "Complete",
      liveUrl: "https://barkingpuppysol.com",
      cover: "/case-study/barking-puppy-cs.png",
      pillars: ["Brand", "Content", "Community", "Automation"],
      tagline: "Bark Louder. Become Undeniable",
      heroTitle: {
        lead: "Bark Louder.",
        accent: "Become Undeniable.",
      },
      oneLiner: "A full-stack community brand. Identity, tooling, and 7,000+ holders.",
      brief:
        "Barking Puppy needed every layer at once: brand identity, copy and content, on-chain tooling holders interact with daily, and the day-to-day community management that keeps a Solana memecoin community aligned over months, not just at launch.",
      approach: [
        "Voice came first. 'Actions before words. Proof before promises.' / 'The blockchain doesn't lie.' / 'Stand with the underdog.' Applied everywhere holders touch the brand, from the website to Discord pinned posts to charity drop announcements.",
        "Tooling layer: a PFP generator for holders to mint identity in the brand, a community game, and a live dashboard with automated Discord alerts on contract activity. The community has utility to point at, not just promises.",
        "Community management runs in parallel: moderation, content cadence, holder communications, and the steady drumbeat that turns a launch crowd into a real community of 7,000+ holders.",
      ],
      deliverables: [
        "Identity system, copy, and content direction",
        "PFP generator (on-chain holder identity)",
        "Live dashboard + automated Discord alerts",
        "Community game design",
        "Telegram bot infrastructure",
        "Day-to-day community management",
      ],
      outcomes: [
        { label: "Active holders", value: "7,000+" },
        { label: "Supply burned (community-driven)", value: "2.5%+" },
        {
          label: "Community stack",
          value: "Game · PFP gen · Dashboard · Bot",
        },
      ],
      icon: Dog,
      accent: "amber",
      featured: false,
    },

];

export function getCaseStudy(slug: string) {
  return work.find((w) => w.slug === slug);
}

export function getFeaturedWork(): CaseStudy[] {
  return work.filter((w) => w.featured);
}

export const ACCENT_GRADIENTS: Record<
  CaseStudyAccent,
  { from: string; to: string; glow: string }
> = {
  magenta: {
    from: "rgb(255 0 188 / 0.55)",
    to: "rgb(100 200 255 / 0.18)",
    glow: "rgb(255 0 188 / 0.25)",
  },
  cyan: {
    from: "rgb(100 200 255 / 0.5)",
    to: "rgb(40 120 200 / 0.18)",
    glow: "rgb(100 200 255 / 0.22)",
  },
  amber: {
    from: "rgb(255 180 80 / 0.5)",
    to: "rgb(255 0 188 / 0.2)",
    glow: "rgb(255 180 80 / 0.22)",
  },
  violet: {
    from: "rgb(180 100 255 / 0.5)",
    to: "rgb(80 50 200 / 0.2)",
    glow: "rgb(180 100 255 / 0.22)",
  },
};
