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
  approach: { title: string; body: string }[];
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
      liveUrl: "https://www.whittakerpropertygroup.co.uk/sell/flagship",
      cover: "/case-study/WPG%20Cover%20(1).png",
      pillars: [
        "Content",
        "Website",
        "Automation",
        "Customer records",
        "Paid advertising",
      ],
      tagline: "North East property, done properly",
      heroTitle: {
        lead: "North East property,",
        accent: "done properly",
      },
      oneLiner:
        "Ongoing help with the website, content, enquiries, CRM and paid social as the property group grows.",
      brief:
        "Whittaker Property Group was growing from an investor-focused business into a wider estate agency and property group. Its website and marketing still reflected the old business, while vendor enquiries created too much admin for the team. The job was to explain the wider offer clearly and make new enquiries easier to handle.",
      approach: [
        { title: "Make the offer clear", body: "I positioned WPG as a North East property group with clear routes for vendors, buyers, investors and landlords. Each audience can quickly find the part of the business that applies to them." },
        { title: "Build around enquiries", body: "The main website and campaign pages were rebuilt around the priority of winning more property instructions, with direct routes for selling, buying, investment and portfolio work." },
        { title: "Sort what happens next", body: "Forms, customer records and campaign tracking were connected so the team receives useful information with every enquiry and spends less time moving details by hand." },
      ],
      deliverables: [
        "Clearer positioning and website wording",
        "The main WPG website",
        "Landing pages for vendor campaigns",
        "Connected forms and follow-ups",
        "Customer records and contact tagging",
        "Enquiry and campaign tracking",
        "Paid social campaigns for vendors",
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
      oneLiner: "A members club brand and website built around the character of its members.",
      brief:
        "The League is a private dining society for people who have defied the odds. It needed to feel selective without looking like every other private club. The team also needed a clear way to handle applications, nationwide events and regular member emails.",
      approach: [
        { title: "Set the right tone", body: "The brand centres on character, story and achievement rather than wealth or status. Its voice and identity feel confident and selective without becoming loud or predictable." },
        { title: "Make applying simple", body: "The website introduces the club, explains who it is for and gives prospective members one clear route into the invitation process." },
        { title: "Keep members informed", body: "Event announcements, speaker news and follow-up emails give members a consistent experience between gatherings." },
      ],
      deliverables: [
        "Brand positioning, voice and identity",
        "Website and application journey",
        "Content direction",
        "Member email templates",
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
      liveUrl: "https://vessl-ltd.co.uk/summer-shred",
      cover: "/case-study/vessl-cs.png",
      pillars: ["Website", "Sign-up journey", "Follow-ups"],
      tagline: "Strength in Motion",
      heroTitle: {
        lead: "Strength in",
        accent: "Motion.",
      },
      oneLiner: "A mobile-first landing page that helps people understand the membership and choose a plan.",
      brief:
        "VESSL needed one mobile-friendly page that could explain three fitness memberships and turn advertising clicks into trial sign-ups. It had to feel polished without relying on fake figures, inflated claims or distracting sections.",
      approach: [
        { title: "Keep the journey simple", body: "The page moves from the offer to the membership choices and then to sign-up. Every section helps someone decide whether VESSL is right for them." },
        { title: "Make mobile the priority", body: "The design is lightweight, easy to read on a small screen and uses movement only where it helps someone understand the page." },
        { title: "Handle every sign-up properly", body: "The form, qualification questions and follow-ups are connected so each new enquiry follows the same route without manual sorting." },
      ],
      deliverables: [
        "Mobile-first landing page",
        "Three membership choices and sign-up",
        "Form and automatic follow-ups",
        "Reusable website styles",
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
      pillars: ["Brand", "Dashboard", "Data", "Alerts"],
      tagline: "If you're checking Dexscreener, you're already late",
      heroTitle: {
        lead: "If you're checking Dexscreener,",
        accent: "you're already late.",
      },
      oneLiner: "A sharper brand, live dashboard and instant alerts for a Solana signal service.",
      brief:
        "MILLIONS tracks Solana wallets and sends trading signals in real time. The underlying data was serious, but the brand and customer experience needed to match it. The identity, dashboard and alerts all had to work together from launch.",
      approach: [
        { title: "Make the product feel credible", body: "The brand is confident, technical and open about how the service works. It focuses on the quality of the data rather than the noise common in trading groups." },
        { title: "Put the signals in one place", body: "The dashboard brings wallet tracking, developer scoring, cluster detection and funding activity together. Rankings update continuously as wallet behaviour changes." },
        { title: "Send alerts where people are", body: "Subscribers receive alerts through Discord and Telegram in under a second, so they do not need to keep refreshing another screen." },
      ],
      deliverables: [
        "Brand identity and voice",
        "Live web dashboard",
        "Wallet and developer scoring",
        "Discord and Telegram alerts in under one second",
        "Subscription and customer access",
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
      pillars: ["Brand", "Member communications", "Events", "Member admin"],
      tagline: "A trade body built to be heard",
      heroTitle: {
        lead: "A trade body",
        accent: "built to be heard.",
      },
      oneLiner:
        "A stronger brand, clearer member communications and practical support for a national trade body.",
      brief:
        "The Energy Consultants Association began as a new independent trade body for UK energy consultants. It needed to earn the confidence of members, suppliers, regulators and policymakers while building the practical systems needed to run memberships, events and communications from day one.",
      approach: [
        { title: "Build a credible voice", body: "The identity and language made the association feel serious enough for regulators and policymakers while remaining clearly owned by the consultants it represents." },
        { title: "Make membership easier to run", body: "Member onboarding, billing, regular emails and a programme of useful webinars gave the association a practical way to support members between renewals." },
        { title: "Give the association a public presence", body: "Member events, industry speaking slots and campaign work with Sarah Edwards MP helped take the consultants' concerns into Westminster and Downing Street." },
      ],
      deliverables: [
        "Brand identity, voice and guidelines",
        "New-member email campaign",
        "Membership sign-up and billing",
        "Webinars on regulatory and commercial issues",
        "AGMs and member events",
        "Industry speaking and Westminster campaign support",
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
      oneLiner: "Brand, content, tools and day-to-day support for a community of more than 7,000 holders.",
      brief:
        "Barking Puppy needed more than a launch campaign. The brand, content, holder tools and daily community support all had to feel connected so the project could keep people involved after the initial excitement passed.",
      approach: [
        { title: "Give the community a clear voice", body: "The writing and identity were applied across the website, community channels and announcements so members met the same brand wherever they took part." },
        { title: "Build things holders could use", body: "A profile-picture generator, community game, live dashboard and automated alerts gave holders practical reasons to stay involved." },
        { title: "Keep the community moving", body: "Regular content, moderation and holder updates supported the community day to day as it grew beyond 7,000 holders." },
      ],
      deliverables: [
        "Brand identity, writing and content",
        "Profile-picture generator for holders",
        "Live dashboard and Discord alerts",
        "Community game design",
        "Telegram bot",
        "Daily community management",
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
