export type ProcessStep = {
  number: string;
  title: string;
  duration: string;
  summary: string;
  detail: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery + positioning",
    duration: "Weeks 1–2",
    summary:
      "Get inside the business, uncover what's true, and lock the strategic narrative.",
    detail: [
      "Stakeholder + customer interviews",
      "Market + competitor audit",
      "Positioning workshop + statement",
      "Messaging architecture draft",
    ],
  },
  {
    number: "02",
    title: "Design + build",
    duration: "Weeks 3–6",
    summary:
      "Translate strategy into an applied system: visual identity, content, and the website that carries them.",
    detail: [
      "Visual identity + design tokens",
      "Content format + platform plan",
      "Conversion-led website build",
      "Brand book + applied guidelines",
    ],
  },
  {
    number: "03",
    title: "Launch + integrate",
    duration: "Week 7",
    summary:
      "Ship the brand live, wired into the systems that keep it running.",
    detail: [
      "Live site + analytics in place",
      "Lead-capture + nurture flows",
      "Content + ops handoff",
      "Launch sequence + comms",
    ],
  },
  {
    number: "04",
    title: "Scale + evolve",
    duration: "Ongoing partnership",
    summary:
      "Stay close. Refine what's working, kill what isn't, and grow the system as the business grows.",
    detail: [
      "Monthly creative direction",
      "Content pipeline support",
      "Conversion + funnel iteration",
      "New design work as needed",
    ],
  },
];
