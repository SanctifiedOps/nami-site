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
    title: "Talk through what is not working",
    duration: "Weeks 1-2",
    summary:
      "We start with the problem you are trying to solve, look at what you already have and agree what needs attention first.",
    detail: [
      "Talk through the business and its customers",
      "Review your brand, website and content",
      "Agree the priorities",
      "Set a clear plan and price",
    ],
  },
  {
    number: "02",
    title: "Do the work",
    duration: "Weeks 3-6",
    summary:
      "I write, design and build the parts we agreed, with regular check-ins so nothing disappears behind the scenes.",
    detail: [
      "Write the wording",
      "Design the brand and materials",
      "Build the website",
      "Set up content and admin",
    ],
  },
  {
    number: "03",
    title: "Put it live",
    duration: "Week 7",
    summary:
      "Everything is checked, connected and put to work. I will also show you how to use what has been built.",
    detail: [
      "Test the pages and forms",
      "Connect enquiries and follow-ups",
      "Set up website tracking",
      "Hand over everything you need",
    ],
  },
  {
    number: "04",
    title: "Stay involved if you need me",
    duration: "Ongoing partnership",
    summary:
      "If you want ongoing help, I can keep an eye on the work, make improvements and take care of the next job.",
    detail: [
      "Regular check-ins",
      "Help with ongoing content",
      "Improve pages that need attention",
      "Handle new work as it comes up",
    ],
  },
];
