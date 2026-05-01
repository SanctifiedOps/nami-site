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
    best: "For brands ready to rebuild the foundation in a sprint.",
    description:
      "Single defined engagement — typically a brand + website rebuild or a positioning + content system reset. Fixed scope, fixed timeline, deliverable handoff.",
    scope: [
      "Brand strategy + identity",
      "Conversion-led website",
      "Content + visual system",
      "Launch handoff",
    ],
    timeline: "6–8 weeks",
    starting: "Mid five figures",
    cta: { label: "Scope a project", href: "/contact" },
  },
  {
    index: "02",
    name: "Partnership",
    best: "For teams scaling the brand across content, ops, and growth.",
    description:
      "Ongoing creative partnership — we sit close, ship regularly, and evolve the brand as the business grows. Usually starts after a foundational project; sometimes ports from another team's work.",
    scope: [
      "Monthly creative direction",
      "Content pipeline + production",
      "Funnel + conversion iteration",
      "Automation + lifecycle marketing",
      "New surface design as needed",
    ],
    timeline: "6–12 month minimum",
    starting: "Monthly retainer",
    cta: { label: "Discuss a partnership", href: "/contact" },
    highlight: true,
  },
  {
    index: "03",
    name: "Systems + product",
    best: "For founders ready to productise their brand or content engine.",
    description:
      "Standalone systems work — Notion stacks, automated content pipelines, lead-capture infrastructure, brand templates. Built to be operated by your team, not us.",
    scope: [
      "Notion + Make automation builds",
      "CRM + lifecycle pipelines",
      "Brand template systems",
      "Internal team training",
    ],
    timeline: "3–5 weeks",
    starting: "Low five figures",
    cta: { label: "Talk systems", href: "/contact" },
  },
];
