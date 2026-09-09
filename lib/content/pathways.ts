export type PressurePath = {
  problem: string;
  detail: string;
  href: string;
  cta: string;
};

export const pressurePaths: PressurePath[] = [
  {
    problem: "Your business looks different everywhere",
    detail:
      "Your website, social posts and sales materials do not feel like the same business. I can bring them together so customers recognise and trust you.",
    href: "/contact",
    cta: "Sort out the brand",
  },
  {
    problem: "Your website is not bringing in enquiries",
    detail:
      "People visit the site but do not get in touch. I can make your offer clearer and give visitors an obvious next step.",
    href: "/contact",
    cta: "Improve the website",
  },
  {
    problem: "You never know what to post",
    detail:
      "You lose time deciding what to say, then post whenever you find a spare minute. I can give you a practical plan and ideas you can use again.",
    href: "/contact",
    cta: "Make content easier",
  },
  {
    problem: "Too much admin depends on you",
    detail:
      "Enquiries, follow-ups and routine jobs are spread across your inbox, notes and memory. I can automate the repetitive parts and give you time back.",
    href: "/contact",
    cta: "Cut the admin",
  },
];

export type StartingPoint = {
  name: string;
  when: string;
  includes: string;
};

export const commonStartingPoints: StartingPoint[] = [
  {
    name: "Your brand and website no longer fit the business",
    when:
      "The business has moved on, but the way it looks and explains itself has not.",
    includes:
      "Clearer wording, an updated look and a website that makes it easier for customers to choose you.",
  },
  {
    name: "People visit the website but do not get in touch",
    when:
      "You are getting attention, but too many potential customers disappear without enquiring.",
    includes:
      "Clearer pages, better calls to action, simpler forms and reliable follow-ups.",
  },
  {
    name: "Content keeps slipping to the bottom of the list",
    when:
      "You know you should post, but deciding what to say takes too long every time.",
    includes:
      "Useful topics, repeatable post formats, templates and a realistic way to keep it going.",
  },
  {
    name: "Routine admin is taking up too much of your week",
    when:
      "Enquiries, reminders, reporting or other repeat jobs still depend on you remembering them.",
    includes:
      "A review of the current process, sensible automation and a clear handover you can understand.",
  },
];
