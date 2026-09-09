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
    name: "One-off project",
    best: "For one clear job with an agreed finish point.",
    description:
      "We agree what needs doing, the price and the timescale before I start. This works well when your brand, website or another part of the business needs focused attention.",
    scope: [
      "Branding and visual identity",
      "A new or improved website",
      "Content planning and templates",
      "Launch and practical handover",
    ],
    timeline: "Usually 4-8 weeks",
    starting: "Quoted for the agreed work",
    cta: { label: "Talk about a project", href: "/contact" },
  },
  {
    index: "02",
    name: "Monthly support",
    best: "For businesses that need reliable help each month.",
    description:
      "I stay involved and help with the marketing jobs that keep coming back. We agree the priorities together, then I take care of the work each month.",
    scope: [
      "Regular planning and advice",
      "Content writing and production",
      "Website improvements",
      "Email and follow-up improvements",
      "Design work when you need it",
    ],
    timeline: "Agreed month to month",
    starting: "An agreed monthly fee",
    cta: { label: "Talk about monthly support", href: "/contact" },
    highlight: true,
  },
  {
    index: "03",
    name: "Systems and automation",
    best: "For a repetitive process that needs fixing properly.",
    description:
      "I organise and automate work such as enquiries, follow-ups, reporting and content admin. Your team gets a reliable setup and clear instructions for using it.",
    scope: [
      "Forms and automatic follow-ups",
      "Customer records and email processes",
      "Templates and repeatable workflows",
      "Instructions and team training",
    ],
    timeline: "Usually 2-5 weeks",
    starting: "Quoted for the agreed work",
    cta: { label: "Talk about automation", href: "/contact" },
  },
];
