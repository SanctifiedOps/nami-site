import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Inbox,
  Bell,
  BarChart3,
  PlayCircle,
  Timer,
} from "lucide-react";
import type { FAQ } from "@/lib/content/faq";

/**
 * Productised offers. Sit below the studio's main engagement ladder
 * (lib/content/engagement.ts). Entry-tier offers with their own sales
 * pages under /offers/[slug]. Not surfaced in primary nav. Brand
 * dilution protection.
 */

export type OfferTier = {
  index: string;
  name: string;
  price: string;
  cadence: string;
  best: string;
  description: string;
  scope: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

export type OfferDeliverable = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type OfferProofRef = {
  /** Matches a slug in lib/content/work.ts */
  slug: string;
  /** Treatment in the proof section. */
  variant: "primary" | "range";
  /** Bespoke headline override for this proof slot. */
  headline: { lead: string; accent: string };
  /** Bespoke body copy for this proof slot. */
  body: string;
  /** Optional closing line beneath the body. */
  closing?: string;
};

export type Offer = {
  slug: string;
  name: string;
  /** Headline price for meta + schema. */
  priceLabel: string;
  /** Numeric price for schema (GBP). */
  priceGBP: number;
  /** Calendly URL (or any external CTA). */
  callUrl: string;
  /** ICP description used in copy + meta. */
  icp: string;
  /** SLA promise. */
  sla: string;
  /** Hero copy. */
  hero: {
    eyebrow: string;
    title: { lead: string; accent: string };
    subhead: string;
    /** Three small fact chips beneath the subhead. Scannable in 2 seconds. */
    chips: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    trustStrip: string;
  };
  /** Recognition stack pains. */
  recognition: {
    eyebrow: string;
    pains: string[];
    closing: { lead: string; accent: string };
  };
  /** Diagnosis section. */
  diagnosis: {
    eyebrow: string;
    headline: { lead: string; accent: string };
    paragraphs: string[];
  };
  /** Possibility section. Future-pacing imagery. */
  possibility: {
    eyebrow: string;
    lines: string[];
    pivot: string;
  };
  /** Proof references. Case studies pulled from work.ts. */
  proof: OfferProofRef[];
  /** Primary testimonial (large pull-quote treatment). */
  testimonial: { quote: string; author: string; role: string };
  /** Supporting voices strip (short quotes, smaller treatment). */
  voices: {
    eyebrow: string;
    headline: { lead: string; accent: string };
    items: { quote: string; author: string; role: string }[];
  };
  /** Five-piece deliverable list. */
  deliverables: {
    eyebrow: string;
    headline: { lead: string; accent: string };
    items: OfferDeliverable[];
  };
  /** Tier ladder. */
  tiers: OfferTier[];
  /** Tier section heading. */
  tiersHeading: {
    eyebrow: string;
    headline: { lead: string; accent: string };
  };
  /** Qualification section. */
  qualification: {
    eyebrow: string;
    forYou: string[];
    notForYou: string[];
  };
  /** Final CTA / scarcity. */
  finalCta: {
    eyebrow: string;
    headline: { lead: string; accent: string };
    body: string;
    button: { label: string; href: string };
  };
  /** FAQ specific to this offer. */
  faq: FAQ[];
};

const CALENDLY_URL = "https://calendly.com/hello-nami";

export const flowFunnel: Offer = {
  slug: "flow-funnel",
  name: "The Flow Funnel",
  priceLabel: "£500",
  priceGBP: 500,
  callUrl: CALENDLY_URL,
  icp: "founders, freelancers, and creatives",
  sla: "Live in 7 days",
  hero: {
    eyebrow: "The Flow Funnel",
    title: {
      lead: "You've built the audience.",
      accent: "Now convert it.",
    },
    subhead:
      "A landing page, lead capture, and lead dashboard for founders, freelancers, artists, and small businesses whose website is leaving money on the table.",
    chips: ["£500", "Live in 7 days", "4 slots open"],
    primaryCta: { label: "Book the fit-call", href: CALENDLY_URL },
    secondaryCta: { label: "See the case study", href: "#proof" },
    trustStrip:
      "Currently building for founders, freelancers, artists, and small businesses.",
  },
  recognition: {
    eyebrow: "If any of this sounds familiar",
    pains: [
      "You see traffic, DMs, and enquiries land. You can't tell which one will pay.",
      "You spend hours answering 'what does this cost?' before anyone buys.",
      "Your Linktree, Squarespace, or one-pager isn't doing the work your business needs.",
      "Attention is going up. Revenue isn't.",
    ],
    closing: {
      lead: "Your work isn't the problem.",
      accent: "Your funnel is.",
    },
  },
  diagnosis: {
    eyebrow: "Why this keeps happening",
    headline: {
      lead: "You have the people. You don't have",
      accent: "the path.",
    },
    paragraphs: [
      "Anyone building something pours energy into the work before they pour any into the path that turns interest into money. Every visit, every enquiry, every quiet message is a warm lead landing somewhere that isn't built to catch them. The work that should be sitting in a structured pipeline ends up sitting in your head.",
      "The fix isn't more posts, more ads, or more hustle. It's an actual path. A place to send the people who already want to buy from you, designed to capture, qualify, and notify you the moment they show up.",
    ],
  },
  possibility: {
    eyebrow: "Imagine this",
    lines: [
      "Imagine waking up to a sale, a booking, or an enquiry that landed while you slept.",
      "Imagine knowing exactly which post, ad, or referral brought your last customer in.",
      "Imagine your funnel doing the work while you make the work.",
    ],
    pivot: "That's what the Flow Funnel is.",
  },
  proof: [
    {
      slug: "vessl",
      variant: "primary",
      headline: { lead: "For VESSL.", accent: "A funnel that converts." },
      body: "A premium landing funnel for a movement-first fitness platform. Single corridor from ad traffic to plan signup, three-tier pricing flow, 7-day free trial built in, and lead automation wired behind every form submission. Built mobile-first with iOS-grade polish and a restrained palette so the brand reads premium on the smallest device first.",
    },
    {
      slug: "millions",
      variant: "range",
      headline: {
        lead: "We built live intelligence for MILLIONS.",
        accent: "Sub-second alerts.",
      },
      body: "A real-time intelligence platform with a live dashboard, automated alerts that fire the moment something happens, and infrastructure that runs around the clock. Shipped as one piece, end to end.",
      closing: "If we can ship that, your funnel is well within range.",
    },
  ],
  testimonial: {
    quote:
      "We had the brand. We had the audience. We didn't have anywhere to send them. Joe built the funnel that turned that around. Trial signups doubled in the first month, the brand looks better than anything I could've briefed, and the whole thing went live in seven days.",
    author: "Andrew Miller",
    role: "Founder, VESSL",
  },
  voices: {
    eyebrow: "More voices",
    headline: { lead: "Not a one-off.", accent: "A pattern." },
    items: [
      {
        quote:
          "Joe's work is amazing. Incredibly easy to work with, meets his commitments, and a creative genius making waves.",
        author: "Chris Howe",
        role: "Executive Performance Coach",
      },
      {
        quote:
          "Working with Joe was so easy. From initial contact, through design, to revisions.",
        author: "John McKie",
        role: "Email Revenue Systems for Coaches and Founders",
      },
      {
        quote:
          "The transformation he's brought to my brand is exceptional.",
        author: "Orange John",
        role: "Three Peaks Mountain Guide",
      },
    ],
  },
  deliverables: {
    eyebrow: "What you get",
    headline: { lead: "Six pieces.", accent: "One working funnel." },
    items: [
      {
        icon: Globe,
        title: "A conversion-built landing page",
        description:
          "Designed and shipped by NAMI. Mobile-first, fast, on-brand. Built to convert from the first scroll.",
      },
      {
        icon: Inbox,
        title: "Lead capture into your dashboard",
        description:
          "Every submission lands in a private lead dashboard we build for you. You own it. Always.",
      },
      {
        icon: Bell,
        title: "Instant new-lead notification",
        description:
          "Email alert the moment a lead lands. Optional auto-reply so nobody waits on you.",
      },
      {
        icon: BarChart3,
        title: "Lead-source analytics",
        description:
          "See exactly which post, ad, or channel sent each lead. Know where to double down and where to stop.",
      },
      {
        icon: PlayCircle,
        title: "Handover walkthrough",
        description:
          "A 15-minute training video on how to read the data and what to do with it. One-page domain guide if you bring your own.",
      },
      {
        icon: Timer,
        title: "Live in 7 days",
        description:
          "From kickoff call to working funnel inside a week. Four builds open per month.",
      },
    ],
  },
  tiers: [
    {
      index: "01",
      name: "Flow",
      price: "£500",
      cadence: "One-off",
      best: "The Flow Funnel build. Start here.",
      description:
        "A complete Flow Funnel build, end to end. Landing page, lead capture, lead dashboard, instant notification, handover walkthrough. Live in 7 days.",
      scope: [
        "Conversion-built landing page",
        "Lead capture form + private lead dashboard",
        "Instant email notification on every lead",
        "Lead-source analytics built in",
        "15-min handover walkthrough",
        "Built and live in 7 days",
      ],
      cta: { label: "Book the fit-call", href: CALENDLY_URL },
      highlight: true,
    },
    {
      index: "02",
      name: "Stream",
      price: "£150",
      cadence: "Per month",
      best: "Keep getting better. Add on after Flow.",
      description:
        "Ongoing monthly partnership. We keep your funnel sharp: tightening copy as your offer evolves, reviewing performance, and chasing higher conversion every month. So the funnel keeps growing instead of going stale.",
      scope: [
        "Monthly performance review delivered to your inbox",
        "Copy and design tweaks as your offer evolves",
        "One A/B test per month to chase higher conversion",
        "Funnel iteration based on real lead data",
        "Priority 24-hour support",
      ],
      cta: { label: "Add on the call", href: CALENDLY_URL },
    },
    {
      index: "03",
      name: "Tide",
      price: "£1.5k",
      cadence: "Per month",
      best: "Drive traffic to the funnel you just built.",
      description:
        "Ongoing retainer. Paid ads management across Meta and Google driving qualified traffic into your Flow Funnel, with monthly performance review and creative refresh. Includes Stream.",
      scope: [
        "Paid ads management (Meta + Google)",
        "Ongoing creative refresh",
        "Monthly performance review",
        "Funnel conversion iteration",
        "Includes Stream",
      ],
      cta: { label: "Ask about Tide on the call", href: CALENDLY_URL },
    },
  ],
  tiersHeading: {
    eyebrow: "The ladder",
    headline: { lead: "Start with Flow.", accent: "Grow from there." },
  },
  qualification: {
    eyebrow: "Be honest with yourself",
    forYou: [
      "Your work is better than the website doing the selling for it.",
      "Bookings, sales, enquiries. They all run through your DMs and your inbox.",
      "You can't tell which post, ad, or referral drove your last sale.",
      "You're ready to stop being the bottleneck between interest and revenue.",
    ],
    notForYou: [
      "You need a full multi-page website. We build those too, just not for £500.",
      "You don't have an audience, list, or customer base to send to the page yet.",
      "You want 100 leads in week one with no plan to drive traffic. That's what Tide solves.",
    ],
  },
  finalCta: {
    eyebrow: "Open this month",
    headline: {
      lead: "Four Flow Funnel slots open this month.",
      accent: "The next is yours.",
    },
    body:
      "Fifteen minutes, no pitch. If we're not the right fit on the call, we'll say so honestly. Worst case you leave with clarity on what you actually need.",
    button: { label: "Book the fit-call", href: CALENDLY_URL },
  },
  faq: [
    {
      question: "Why only £500?",
      answer:
        "We've engineered the build process down to a sharp seven days. You get a premium funnel without the £4k brand-build overhead because we know exactly how to ship one fast. The price reflects scope, not quality.",
    },
    {
      question: "Who owns the page and the data?",
      answer:
        "You. Always. The page, the lead dashboard, the leads, the source files. Everything ships to you on handover, and you keep it whether you continue with us or not.",
    },
    {
      question: "What if I already have a brand and logo?",
      answer:
        "We build into your existing visual language. Bring colours, fonts, and the logo. The Flow Funnel reads as an extension of your brand, not a NAMI template.",
    },
    {
      question: "Can I edit the page myself later?",
      answer:
        "Yes. Sign up to Stream (£150/mo) and we handle every change. Otherwise small tweaks run at £75 per change. We send you the source files either way, so you're never locked in.",
    },
    {
      question: "What about driving traffic to the page?",
      answer:
        "That's what Tide is. £1.5k/month for paid ads management across Meta and Google, monthly performance review, ongoing creative refresh. Let's talk about it on the fit-call once the funnel is live.",
    },
    {
      question: "What if I want a full website later?",
      answer:
        "Your Flow fee credits against a future Project engagement. You won't pay twice for the same thinking.",
    },
    {
      question: "Can I see a Flow Funnel in action?",
      answer:
        "VESSL above is the closest reference build. We'll walk you through it on the fit-call and show you a few others off the record.",
    },
  ],
};

export function getOffer(slug: string): Offer | undefined {
  if (slug === flowFunnel.slug) return flowFunnel;
  return undefined;
}

export const offers: Offer[] = [flowFunnel];
