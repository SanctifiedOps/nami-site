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
    best: "For a defined brand, website, or positioning reset.",
    description:
      "A focused engagement with a fixed brief and a clean handoff. Useful when one part of the business needs rebuilding properly before the rest can move.",
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
    best: "For teams that need regular creative direction and hands-on support.",
    description:
      "Ongoing creative partnership for brands that need the work to keep moving: content, funnel iteration, new assets, automation, and the decisions between them.",
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
    best: "For founders turning repeatable work into a system or product.",
    description:
      "Standalone systems work: operations stacks, content pipelines, lead capture, dashboards, and templates your team can run without asking how it was built.",
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
