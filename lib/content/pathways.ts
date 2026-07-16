export type PressurePath = {
  problem: string;
  detail: string;
  href: string;
  cta: string;
};

export const pressurePaths: PressurePath[] = [
  {
    problem: "The brand feels patched together",
    detail:
      "The deck, website, and content all describe the business slightly differently. You need the centre rebuilt before more output makes the drift worse.",
    href: "/services/brand-strategy",
    cta: "Start with brand",
  },
  {
    problem: "The website is not earning enquiries",
    detail:
      "People visit, read, maybe follow you somewhere else, then disappear. You need a clearer path from attention to a real next step.",
    href: "/services/website-funnel",
    cta: "Fix the funnel",
  },
  {
    problem: "Content starts from scratch every week",
    detail:
      "Ideas live in notes, formats keep changing, and the voice depends on who had time to post. You need repeatable formats and a workflow that survives busy weeks.",
    href: "/services/content-systems",
    cta: "Build the content system",
  },
  {
    problem: "Automation still lives in your head",
    detail:
      "Enquiries arrive through forms, DMs, email, and referrals, but the automation still depends on memory. You need the recurring work moved into the stack.",
    href: "/services/automation-growth",
    cta: "Wire the system",
  },
];

export type StartingPoint = {
  name: string;
  when: string;
  includes: string;
};

export const commonStartingPoints: StartingPoint[] = [
  {
    name: "Brand reset + website",
    when:
      "The positioning is fuzzy and the site has become a polite brochure.",
    includes:
      "Messaging, visual direction, conversion copy, page structure, build, and handoff.",
  },
  {
    name: "Website + lead capture",
    when:
      "The brand is usable, but attention is not turning into qualified enquiries.",
    includes:
      "Landing flow, form logic, analytics, lead routing, and automation structure.",
  },
  {
    name: "Content system + visual direction",
    when:
      "The business has something to say, but every post still feels like a one-off.",
    includes:
      "Pillars, repeatable formats, templates, visual rules, and production workflow.",
  },
  {
    name: "Automation cleanup",
    when:
      "The weekly admin is now the bottleneck: reporting, leads, reminders, or handoffs.",
    includes:
      "Workflow mapping, tool decisions, build, documentation, and team handover.",
  },
];
