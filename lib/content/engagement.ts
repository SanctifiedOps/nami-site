export type EngagementModel = {
  index: string;
  name: string;
  best: string;
  description: string;
  scope: string[];
  timeline: string;
  starting: string;
  cta: { label: string; href: string };
  highlight?: boolean;
};

export const engagements: EngagementModel[] = [
  {
    index: "01",
    name: "Project",
    best: "For a defined brand or website build with a clear brief.",
    description:
      "Single engagement: typically a brand build, a website, or a positioning + content reset. Fixed brief, fixed timeline, deliverable handoff. We talk first, plan to the brief, then build.",
    scope: [
      "Brand strategy + identity",
      "Conversion-led website",
      "Content + visual system",
      "Launch handoff",
    ],
    timeline: "4–8 weeks",
    starting: "Sized to the work",
    cta: { label: "Plan a project", href: "/contact" },
  },
  {
    index: "02",
    name: "Partnership",
    best: "For teams scaling brand, content, and systems together.",
    description:
      "Ongoing creative partnership. We sit close, ship regularly, and evolve the brand as the business grows. Usually starts after a foundational project; sometimes ports from another team's work.",
    scope: [
      "Monthly creative direction",
      "Content pipeline + production",
      "Funnel + conversion iteration",
      "Automation + lifecycle marketing",
      "New design work as needed",
    ],
    timeline: "Monthly cadence",
    starting: "Monthly retainer",
    cta: { label: "Discuss a partnership", href: "/contact" },
    highlight: true,
  },
  {
    index: "03",
    name: "Systems + product",
    best: "For founders productising their brand or content engine.",
    description:
      "Standalone systems work: operations stacks, automated content pipelines, lead-capture infrastructure, brand templates. Built to be operated by your team, not us.",
    scope: [
      "Workflow + automation builds",
      "CRM + lifecycle pipelines",
      "Brand template systems",
      "Internal team training",
    ],
    timeline: "2–5 weeks",
    starting: "Sized to the work",
    cta: { label: "Talk systems", href: "/contact" },
  },
];
