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
 * pages under /offers/[slug]. Not surfaced in primary nav.
 */

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
  /** Headline override specific to this proof slot. */
  headline: { lead: string; accent: string };
  /** Body copy specific to this proof slot. */
  body: string;
  /** Optional closing line beneath the body. */
  closing?: string;
};

export type OfferFlowPhase = {
  day: string;
  title: string;
  body: string;
};

export type OfferPerformanceTerms = {
  buildFee: number;
  perLeadFee: number;
  monthlyCap: number;
  minimumMonths: number;
  /** What the minimum applies to. "rate-lock" = the rate is fixed for N months, not a payment floor. */
  monthsApplyTo: "rate-lock";
};

export type OfferPricing = {
  eyebrow: string;
  headline: { lead: string; accent: string };
  formula: {
    buildLabel: { amount: string; unit: string; note: string };
    perLeadLabel: { amount: string; unit: string; note: string };
    capLabel: { amount: string; unit: string; note: string };
    chips: string[];
  };
  workedExample: {
    month: string;
    label: string;
    amount: string;
    note?: string;
  }[];
  qualifiedLeadCriteria: {
    eyebrow: string;
    items: string[];
  };
  comparison: {
    eyebrow: string;
    rows: { label: string; price: string; weakness: string }[];
  };
  cta: { label: string; href: string };
};

export type Offer = {
  slug: string;
  name: string;
  /** Headline price for meta + schema. */
  priceLabel: string;
  /** Numeric build fee for schema (GBP). */
  priceGBP: number;
  /** Performance pricing mechanics. */
  performanceTerms: OfferPerformanceTerms;
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
    /** Small fact chips beneath the subhead. Scannable in 2 seconds. */
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
  /** Qualification (for you / not for you). */
  qualification: {
    eyebrow: string;
    forYou: string[];
    notForYou: string[];
  };
  /** Proof references. Case studies pulled from work.ts. */
  proof: OfferProofRef[];
  /** Primary testimonial (rendered inline within the VESSL proof block). */
  testimonial: { quote: string; author: string; role: string };
  /** Six-piece deliverable list. */
  deliverables: {
    eyebrow: string;
    headline: { lead: string; accent: string };
    items: OfferDeliverable[];
  };
  /** Day 0 to Day 7 build process. */
  flowPhases: OfferFlowPhase[];
  /** Risk-reversal manifesto statement, sits immediately before pricing. */
  riskReversal: {
    eyebrow: string;
    headline: { lead: string; accent: string };
    subline: string;
  };
  /** Pricing section: formula, worked example, criteria, comparison. */
  pricing: OfferPricing;
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
  priceLabel: "£750 build + £50 / qualified lead",
  priceGBP: 750,
  performanceTerms: {
    buildFee: 750,
    perLeadFee: 50,
    monthlyCap: 750,
    minimumMonths: 6,
    monthsApplyTo: "rate-lock",
  },
  callUrl: CALENDLY_URL,
  icp: "UK independent service operators with a personal brand",
  sla: "Live in 7 days",
  hero: {
    eyebrow: "The Flow Funnel",
    title: {
      lead: "You've already done the hard part.",
      accent: "The website is where it dies.",
    },
    subhead:
      "We build the page, the capture, the dashboard, and the attribution in 7 days for £750. After that you only pay monthly if qualified leads actually land.",
    chips: [
      "£750 build",
      "£50 / qualified lead",
      "Capped at £750 / mo",
      "Live in 7 days",
    ],
    primaryCta: { label: "Book the fit-call", href: CALENDLY_URL },
    secondaryCta: { label: "See the pricing", href: "#pricing" },
    trustStrip:
      "Same hands that shipped MILLIONS' live alerting stack and VESSL's premium funnel. Not a template. Not a GHL skin. Built into your brand, owned by you, priced on the outcome.",
  },
  recognition: {
    eyebrow: "If any of this sounds familiar",
    pains: [
      "You see traffic, DMs, and warm introductions land. You can't tell which ones will pay.",
      "Half your week is replying to 'do you have availability?' before anyone has agreed a price.",
      "Your Squarespace, Linktree, or one-pager sends every lead back into your inbox to die.",
      "Audience is going up. Diary is full of admin. Revenue isn't keeping pace.",
    ],
    closing: {
      lead: "There's a name for that feeling.",
      accent: "Attribution shame.",
    },
  },
  diagnosis: {
    eyebrow: "Why this keeps happening",
    headline: {
      lead: "You have the people. You don't have",
      accent: "the path.",
    },
    paragraphs: [
      "When you sell time, every warm conversation is a warm lead. Yours land in DMs, replies, and forwarded emails, and they sit in your head instead of a system. The work that should be queued and qualified ends up being remembered, half-answered, or quietly lost.",
      "The fix isn't more posts, more ads, or another funnel builder. It's a route that catches the leads you already have, qualifies them automatically, and tells you which post, ad, or reply each one came from. So you stop guessing and start spending your hours on the people who can actually pay.",
    ],
  },
  qualification: {
    eyebrow: "Be honest with yourself",
    forYou: [
      "You're a UK service operator, £80k to £300k revenue, selling time at a premium price.",
      "You have a real audience or referral base. Bookings come through DMs, replies, and word of mouth.",
      "You can't tell which post, ad, or introduction sent your last paying client.",
      "You're ready to stop being the bottleneck between interest and revenue.",
    ],
    notForYou: [
      "You don't have an audience or referral base yet. Build that first.",
      "You sell products at low margin. This is built for service operators who sell time.",
      "You want a full multi-page corporate website. We build those too, just not for £750.",
      "You're based outside the UK. We're optimised for UK service operators right now.",
    ],
  },
  proof: [
    {
      slug: "vessl",
      variant: "primary",
      headline: { lead: "For VESSL.", accent: "A funnel that converts." },
      body: "A premium landing funnel for a movement-first fitness platform. Single corridor from ad traffic to plan signup, three-tier pricing flow, 7-day free trial built in, lead automation wired behind every form submission. Built mobile-first with iOS-grade polish so the brand reads premium on the smallest device first. Same hands, same system, applied to your category.",
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
  deliverables: {
    eyebrow: "What you get",
    headline: { lead: "Six pieces.", accent: "One working funnel." },
    items: [
      {
        icon: Globe,
        title: "A conversion-built landing page",
        description:
          "Designed and shipped by NAMI. Mobile-first, fast, on-brand. Built to convert from the first scroll, not to look like a template.",
      },
      {
        icon: Inbox,
        title: "Lead capture into your dashboard",
        description:
          "Every submission lands in a private lead dashboard we build for you. Live status, contact info, source data. You own it. Always.",
      },
      {
        icon: Bell,
        title: "Instant new-lead notification",
        description:
          "Email alert the moment a qualified lead lands. Optional auto-reply so nobody waits on you. Cuts the inbox-shame loop at the root.",
      },
      {
        icon: BarChart3,
        title: "Attribution wired in",
        description:
          "See exactly which post, ad, or referral sent each lead. Know where to spend the next hour and where to stop. The bit ClickFunnels and GHL can't give you.",
      },
      {
        icon: PlayCircle,
        title: "Handover walkthrough",
        description:
          "A 15-minute Loom on how to read the dashboard, what each metric means, and what to do with it. One-page DNS guide if you bring your own domain.",
      },
      {
        icon: Timer,
        title: "Live in 7 days",
        description:
          "From kickoff to working funnel inside a week. Four builds open per month, no exceptions.",
      },
    ],
  },
  flowPhases: [
    {
      day: "Day 0",
      title: "15-min fit-call",
      body: "We confirm we're a fit, scope the brief, and answer your questions. No pitch deck, no high-pressure close. If we're not right for each other, we say so on the call.",
    },
    {
      day: "Day 1",
      title: "Kickoff and brief",
      body: "Deposit invoice sent. You fill in a 20-minute brief on your audience, your offer, and your ICP. We sign off the qualified-lead criteria together in writing. Work starts the same day.",
    },
    {
      day: "Days 2 to 6",
      title: "Build",
      body: "Landing page, lead capture form, dashboard, attribution tagging, email automation. Every layer wired against your brief and your written ICP, not a template.",
    },
    {
      day: "Day 7",
      title: "Live and handover",
      body: "Training Loom, DNS guide if needed, and your funnel live. Qualified leads landing in your dashboard from the first share. Performance pricing kicks in from day 8.",
    },
  ],
  riskReversal: {
    eyebrow: "The deal",
    headline: {
      lead: "We build it.",
      accent: "If it doesn't bring leads, you don't pay past the build.",
    },
    subline:
      "Most agencies charge a retainer whether they perform or not. We don't. After day 7, every pound you spend with us is a pound a qualified lead landed.",
  },
  pricing: {
    eyebrow: "Priced on the outcome",
    headline: {
      lead: "One number you control.",
      accent: "One we earn.",
    },
    formula: {
      buildLabel: {
        amount: "£750",
        unit: "build",
        note: "One-off, paid on kickoff",
      },
      perLeadLabel: {
        amount: "£50",
        unit: "per qualified lead",
        note: "Billed monthly, only on delivery",
      },
      capLabel: {
        amount: "£750",
        unit: "monthly ceiling",
        note: "Rate locked for 6 months",
      },
      chips: ["7-day SLA", "You own everything", "Built for UK service operators"],
    },
    workedExample: [
      {
        month: "Month 1",
        label: "Build",
        amount: "£750",
        note: "One-off build fee. Funnel goes live on day 7.",
      },
      {
        month: "Month 2",
        label: "8 qualified leads × £50",
        amount: "£400",
        note: "Below the cap. You pay only for what landed.",
      },
      {
        month: "Month 3",
        label: "18 qualified leads × £50",
        amount: "£750",
        note: "Hits the monthly ceiling. Anything above is free.",
      },
    ],
    qualifiedLeadCriteria: {
      eyebrow: "What counts as qualified",
      items: [
        "Matches your written ICP, signed off together at kickoff.",
        "Submits a complete form. No bots, no spam, no half-fills.",
        "Contactable and responds to outreach inside the dashboard.",
        "Not an existing client, employee, or known competitor.",
        "Disputes resolved by review. Ambiguous cases don't count.",
      ],
    },
    comparison: {
      eyebrow: "Compared to everything else",
      rows: [
        {
          label: "What you've probably tried",
          price: "Free, plus your time",
          weakness: "No attribution. No capture. Every lead lost in DMs.",
        },
        {
          label: "Hire a freelancer",
          price: "£2k to £5k up front",
          weakness: "No skin in the game once invoice is paid.",
        },
        {
          label: "Agency retainer",
          price: "£2k to £4k per month",
          weakness: "You pay whether leads land or not.",
        },
        {
          label: "NAMI Flow Funnel",
          price: "£750 + only when leads land",
          weakness: "Performance pricing. Locked for 6 months.",
        },
      ],
    },
    cta: { label: "Book the fit-call", href: CALENDLY_URL },
  },
  finalCta: {
    eyebrow: "Open this month",
    headline: {
      lead: "Four Flow Funnel slots open this month.",
      accent: "The next is yours.",
    },
    body:
      "Fifteen minutes, no pitch. If we're not the right fit on the call, we say so honestly. Worst case you leave with clarity on what you actually need.",
    button: { label: "Book the fit-call", href: CALENDLY_URL },
  },
  faq: [
    {
      question: "What counts as a 'qualified lead'?",
      answer:
        "Anyone who matches your written ICP (signed off at kickoff), submits a complete form, is contactable, and isn't already a client, an employee, or a known competitor. Bots, spam, and half-fills don't count. Ambiguous cases we review together; if it stays ambiguous, it doesn't count.",
    },
    {
      question: "What if no leads land in month 1?",
      answer:
        "Then you owe £0 that month. The £50 fee is only charged when a qualified lead is delivered. No retainer, no floor, no minimum payment. Build a track record together, and only pay for what works.",
    },
    {
      question: "Why £750 now and not £500?",
      answer:
        "The £750 covers the new attribution layer, the written ICP sign-off, and the dispute-resolution time the performance model needs. It also signals what this is: a senior productised build, not a cheap template. The performance tail is where the value compounds.",
    },
    {
      question: "The 6-month minimum, am I locked into paying you for 6 months?",
      answer:
        "No. The minimum locks the rate (£50 per qualified lead, £750/mo cap) in your favour for 6 months. It is not a payment floor. If zero qualified leads land in a month, that month's invoice is zero. You're committing to the pricing structure, not to spend.",
    },
    {
      question: "Do I own the page, the dashboard, and the lead data?",
      answer:
        "Yes. Always. The page, the dashboard, the leads, the source files all ship to you on handover. You keep everything whether we continue working together or not. No lock-in, no hostage data.",
    },
    {
      question: "What if I want to drive paid traffic too?",
      answer:
        "Paid traffic is a separate project quoted off-page. We'll only suggest it once the funnel is live and converting organic, so we know what the page actually does before we spend on ads. Most clients run organic for 60 days before paid.",
    },
    {
      question: "What if I'm based outside the UK?",
      answer:
        "Right now this is built for UK service operators. The ICP, the dispute-resolution process, and the contract are all UK-tuned. If you're international and the work still fits, talk to us on the fit-call. We'll be straight about whether it's a sensible match.",
    },
    {
      question: "Do I need a brand or audience first?",
      answer:
        "Brand: helpful, not required. We build into whatever visual language you have, or sharpen one as part of the work. Audience: yes. The Flow Funnel converts the audience you already have. If you're starting from zero traffic, you need content and reach first; we can talk about that on the call.",
    },
    {
      question: "Can I edit the page myself after launch?",
      answer:
        "Yes. Source files ship to you on day 7. Small tweaks run at £75 per change. If you want continuous iteration, that's part of the partnership conversation; the Flow Funnel itself stops at day 7 by design.",
    },
    {
      question: "Can I see a live Flow Funnel in action?",
      answer:
        "VESSL above is the closest reference build. We'll walk you through it on the fit-call and show you a few others off the record so you can see the dashboard, the attribution layer, and the lead-flow before you commit.",
    },
  ],
};

export function getOffer(slug: string): Offer | undefined {
  if (slug === flowFunnel.slug) return flowFunnel;
  return undefined;
}

export const offers: Offer[] = [flowFunnel];
