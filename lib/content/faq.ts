export type FAQ = {
  question: string;
  answer: string;
};

export const faq: FAQ[] = [
  {
    question: "How is NAMI different from a typical agency?",
    answer:
      "We don't sit in one lane. Most studios do brand, or content, or websites, or automation. We build all four into one cohesive structure so the work compounds instead of fragmenting. The trade is depth over volume: fewer clients, more thinking, sharper output.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Founders, small businesses, and teams who care about doing the work properly. Independent trades through to growing service brands. The common thread is intent, whatever the size. If you're trying to build something deliberate and want a partner who treats it that way, we're a fit.",
  },
  {
    question: "How long does a typical engagement run?",
    answer:
      "A foundational brand + website project usually lands in 6–8 weeks. From there, most clients continue on an ongoing partnership for content, automation, and creative direction. We shape the cadence to whatever fits the business.",
  },
  {
    question: "Do you only do digital, or campaigns + print too?",
    answer:
      "Both. Digital is the default home (sites, content, automation), but visual direction extends across whatever the brand needs. Photography, video, print, packaging. The brand has to hold everywhere it shows up.",
  },
  {
    question: "What does it cost?",
    answer:
      "Engagements are sized to the work, not bundled into packages. We talk to every potential client first, understand what's needed, then quote against the brief. If we're not the right fit on budget or shape, we'll say so and point you somewhere that is.",
  },
  {
    question: "Can you work with our existing brand?",
    answer:
      "Often, yes. If the brand foundation is strong and what's missing is execution, content systems, or growth infrastructure, we'll plug into what exists. If the foundation needs work, we'll tell you. Sometimes you have to fix the base before scaling on top of it.",
  },
];

/**
 * Per-service FAQ. Keyed by service slug. Falls back to the general `faq`
 * above if a slug isn't covered here.
 */
export const serviceFaq: Record<string, FAQ[]> = {
  "brand-strategy": [
    {
      question: "What actually ships at the end of a brand engagement?",
      answer:
        "Positioning, messaging architecture, tone of voice, visual identity system, and a brand framework you can run a business off. Decisions, not a 60-page deck.",
    },
    {
      question: "Do you do naming?",
      answer:
        "Yes. Brand naming, product naming, sub-brand architecture. We only suggest a rename if the current name is holding you back; otherwise we work with what you have.",
    },
    {
      question: "We already have a logo and some assets. Do we start over?",
      answer:
        "Not always. If the foundation is workable, we keep it and rebuild around it. If it's in the way, we'll tell you. Either way, you'll know before any redesign work starts.",
    },
    {
      question: "How long does a brand build take?",
      answer:
        "Four to six weeks for a focused brand reset. Eight when website and content sit alongside it. Faster than that usually means the strategy isn't being done; slower usually means a brief that keeps growing.",
    },
  ],

  "content-systems": [
    {
      question: "Do you only build the system, or also write the content?",
      answer:
        "We design the formats and frameworks, then produce against them: copy, scripts, visual briefs. After launch your team can take over with the playbook, or we keep producing alongside you.",
    },
    {
      question: "Which platforms do you cover?",
      answer:
        "LinkedIn, Instagram, YouTube, email, and long-form essays are the usual core. We pick platforms based on where your audience buys, not where the trend is loudest.",
    },
    {
      question: "How does AI fit in?",
      answer:
        "Selectively. AI accelerates research, drafts, and asset variations. It does not replace voice, judgement, or strategy. Anything that ships is human-checked.",
    },
    {
      question: "Can you take over an existing content function?",
      answer:
        "We can, and often do. We audit what's working, kill what isn't, and rebuild around the formats that compound. Most takeovers cut output volume and grow reach in the same quarter.",
    },
  ],

  "website-funnel": [
    {
      question: "How do you decide what to build the site on?",
      answer:
        "We pick the stack against the brief. Lightweight when speed of iteration matters most. Custom code when the site needs to do real work: apps, dashboards, integrations. You know the decision in scoping, before we build.",
    },
    {
      question: "Do you handle hosting and ongoing maintenance?",
      answer:
        "Hosting setup is part of every build, on a stack matched to the site. Ongoing maintenance is part of a partnership engagement; one-off fixes run on a small retainer.",
    },
    {
      question: "Rebuild on top of our current site, or full restart?",
      answer:
        "Both options exist. If the structure and content are sound and the issue is design or conversion, we redesign. If the foundations don't hold, we restart cleanly. An audit happens before any quote.",
    },
    {
      question: "Will the site be fast and SEO-ready?",
      answer:
        "Yes by default. Performance budgets, semantic HTML, Core Web Vitals, structured data, and analytics are part of the build, not add-ons.",
    },
  ],

  "visual-direction": [
    {
      question: "Do you shoot photography and video, or only direct it?",
      answer:
        "Depends on the brief. Smaller shoots run in-house; larger productions are art-directed with trusted shooters and editors. You stay the one point of contact.",
    },
    {
      question: "We already have visual assets. Can you direct from those?",
      answer:
        "Most engagements blend new direction with your existing libraries. The point is consistency across the brand, not throwing everything out.",
    },
    {
      question: "Is creative direction a one-off or ongoing?",
      answer:
        "Both work. One-off direction sets the visual system and asset library. Ongoing direction means we're in the loop on every campaign, content piece, and channel the brand shows up on.",
    },
    {
      question: "Do you deliver editable assets and templates?",
      answer:
        "You always get the editable layer: design libraries, source files, asset catalogues, and applied templates. Everything you need to keep producing on-brand without us in the room.",
    },
  ],

  "automation-growth": [
    {
      question: "How do you decide what to build with?",
      answer:
        "We pick the stack for fit, not preference, and lean toward tooling your team can operate after handoff. Where the workflow needs custom logic, we build custom; where standard tooling holds up, we use it. Either way you get documentation and training, not a black box.",
    },
    {
      question: "Will my team be able to maintain this after you leave?",
      answer:
        "That's the goal. Builds come with documentation, training, and a handoff session. If something needs ongoing engineering, we say so up front and propose a partnership rather than pretending it's plug-and-play.",
    },
    {
      question: "Do you do custom integrations or only no-code?",
      answer:
        "No-code is faster for standard workflows; custom code shows up where the system needs to do something the platforms don't. The trade-off is cost vs flexibility, and we'll be straight about it.",
    },
    {
      question: "How do you decide what's worth automating?",
      answer:
        "A workflow earns automation when it runs at least weekly, has a clear trigger, and the build pays back inside three months. Anything below that bar is usually faster left manual.",
    },
  ],
};

export function getServiceFaq(slug: string): FAQ[] {
  return serviceFaq[slug] ?? faq;
}
