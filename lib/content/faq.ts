export type FAQ = {
  question: string;
  answer: string;
};

export const faq: FAQ[] = [
  {
    question: "How is NAMI different from a typical agency?",
    answer:
      "Most studios stop at the edge of their lane. The brand team hands off to the web team. The web team hands off to whoever owns the leads. NAMI keeps those decisions in one place, so the voice, site, content, and follow-up system do not drift apart.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Founder-led businesses, independent operators, and small teams that have something real behind the brand but need the front end and the operating layer to catch up. If the work matters and the current setup feels patched together, we are likely in range.",
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
      "It depends on what needs rebuilding. A clean landing funnel is a different job to a full brand, website, and automation reset. We talk first, diagnose the shape of the work, then quote against that. If the budget or brief is wrong for NAMI, we say so early.",
  },
  {
    question: "Can you work with our existing brand?",
    answer:
      "Yes, when the base is worth keeping. We look at the positioning, voice, visuals, site, and current workflow before recommending a reset. Sometimes the right move is to keep the identity and rebuild the way it is used.",
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
        "Positioning, messaging architecture, tone of voice, visual direction, identity rules, and applied examples your team can use the next time they write a page, brief a designer, or launch an offer.",
    },
    {
      question: "Do you do naming?",
      answer:
        "Yes. Brand naming, product naming, sub-brand architecture. We only suggest a rename if the current name is holding you back; otherwise we work with what you have.",
    },
    {
      question: "We already have a logo and some assets. Do we start over?",
      answer:
        "Not by default. If the current identity still has equity, we keep what works and tighten the system around it. If the assets are causing the drift, we show you where before any redesign starts.",
    },
    {
      question: "How long does a brand build take?",
      answer:
        "Four to six weeks for a focused brand reset. Around eight when the website and content system are part of the work. If the timeline changes, it is usually because the brief changed.",
    },
  ],

  "content-systems": [
    {
      question: "Do you only build the system, or also write the content?",
      answer:
        "Both. We define the formats, then write and brief real pieces against them: posts, scripts, emails, page sections, or visual prompts. Your team can take over from the playbook, or we keep producing with you.",
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
        "Yes. We start by looking at what has actually worked, what has only created work, and where the voice has drifted. Then we rebuild the formats and cadence around the pieces worth repeating.",
    },
  ],

  "website-funnel": [
    {
      question: "How do you decide what to build the site on?",
      answer:
        "The stack follows the job. A simple funnel does not need the same build as a dashboard, portal, or integration-heavy site. You know the recommendation during scoping, before anything is designed.",
    },
    {
      question: "Do you handle hosting and ongoing maintenance?",
      answer:
        "Hosting setup is part of every build, on a stack matched to the site. Ongoing maintenance is part of a partnership engagement; one-off fixes run on a small retainer.",
    },
    {
      question: "Rebuild on top of our current site, or full restart?",
      answer:
        "We check the structure first. If the routes, copy, and content model still make sense, we can redesign around them. If the site is fighting the business, a clean rebuild is usually cheaper than months of patching.",
    },
    {
      question: "Will the site be fast and SEO-ready?",
      answer:
        "Yes. Semantic structure, performance, metadata, structured data, analytics, and sensible crawl paths are part of the build, not a cleanup job after launch.",
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
        "Usually. We look for the assets that already feel like the brand, then build rules around them so the next shoot, deck, or campaign does not start from taste alone.",
    },
    {
      question: "Is creative direction a one-off or ongoing?",
      answer:
        "Both work. A one-off engagement gives you the system and asset rules. Ongoing direction keeps that system honest when new campaigns, shoots, launches, and channels start adding pressure.",
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
        "We start with the workflow, not the tool. If an existing platform can handle it cleanly, we use it. If the logic needs custom work, we build it. Either way, the handoff includes documentation your team can understand.",
    },
    {
      question: "Will my team be able to maintain this after you leave?",
      answer:
        "That is the point. Builds come with documentation, training, and a handoff session. If a workflow will need ongoing technical support, we say that during scoping rather than hiding it in the handover.",
    },
    {
      question: "Do you do custom integrations or only no-code?",
      answer:
        "Both. Standard workflows should stay simple. Custom code only earns its place when the platforms cannot handle the logic, the data shape, or the level of control the business needs.",
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
