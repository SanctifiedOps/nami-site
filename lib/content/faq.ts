export type FAQ = {
  question: string;
  answer: string;
};

export const faq: FAQ[] = [
  {
    question: "How is NAMI different from a typical agency?",
    answer:
      "You work directly with me throughout the job. Because I can handle the brand, website, content and automation together, you do not have to manage several different people or keep repeating the brief.",
  },
  {
    question: "Who do you work with?",
    answer:
      "I mainly work with small businesses, founders and independent teams. They are usually good at what they do but need help explaining it, presenting it properly or taking repetitive marketing jobs off their plate.",
  },
  {
    question: "How long does a typical engagement run?",
    answer:
      "A brand and website project usually takes six to eight weeks. Smaller jobs can be quicker. Some clients keep me involved each month for content, improvements and ongoing support. I will give you a realistic timescale before we agree the work.",
  },
  {
    question: "Do you only work on websites and digital marketing?",
    answer:
      "No. I also work on printed materials, campaigns, photography, video and packaging when the job needs them. The aim is to make the business look and sound consistent wherever customers see it.",
  },
  {
    question: "What does it cost?",
    answer:
      "It depends on what you need. A single landing page is a different job from a new brand and website. We talk first, then I give you a clear price for the agreed work. If I am not the right fit for your budget or the job, I will tell you early.",
  },
  {
    question: "Can you work with an existing brand?",
    answer:
      "Yes. I will look at what you already have and keep anything that is still doing its job. Sometimes the brand is fine and only needs to be used more consistently. I will not recommend starting again unless there is a good reason.",
  },
];

/**
 * Per-service FAQ. Keyed by service slug. Falls back to the general `faq`
 * above if a slug isn't covered here.
 */
export const serviceFaq: Record<string, FAQ[]> = {
  "brand-strategy": [
    {
      question: "What will I receive at the end of a branding project?",
      answer:
        "You receive the agreed wording, logo and visual files, practical brand guidance and examples showing how everything should be used. The exact list depends on what your business needs, and it will be written clearly in your proposal.",
    },
    {
      question: "Do you do naming?",
      answer:
      "Yes. I can help name a business, service or product. I will only recommend changing an existing name when there is a clear reason to do it.",
    },
    {
      question: "We already have a logo and some assets. Do we start over?",
      answer:
      "No. I review what you already have and keep anything that is still useful. A complete redesign only makes sense when the current identity is actively holding the business back.",
    },
    {
      question: "How long does a brand build take?",
      answer:
      "A focused branding project usually takes four to six weeks. A larger job that also includes the website may take around eight weeks. I confirm the timescale before the work begins.",
    },
  ],

  "content-systems": [
    {
      question: "Do you only build the system, or also write the content?",
      answer:
      "Both. I can create the plan and templates, then write real posts, scripts, emails or articles to get everything moving. You can take it over afterwards or keep me involved each month.",
    },
    {
      question: "Which platforms do you cover?",
      answer:
      "I regularly work with Instagram, LinkedIn, YouTube, email and articles. We choose the places your customers actually use instead of trying to post everywhere.",
    },
    {
      question: "How does AI fit in?",
      answer:
      "I use AI where it saves useful time, such as organising research or developing early drafts. It does not replace your point of view, and I check anything intended for publication.",
    },
    {
      question: "Can you take over an existing content function?",
      answer:
      "Yes. I look at what has performed well, what has created unnecessary work and which ideas are worth repeating. We keep the useful parts and build a simpler routine around them.",
    },
  ],

  "website-funnel": [
    {
      question: "How do you decide what to build the site on?",
      answer:
      "I choose the platform based on what the website needs to do, who will update it and what it must connect to. I explain the recommendation before design or development begins.",
    },
    {
      question: "Do you handle hosting and ongoing maintenance?",
      answer:
      "Yes. I set up hosting as part of the build. Ongoing updates and maintenance can be included in monthly support or agreed separately after launch.",
    },
    {
      question: "Rebuild on top of our current site, or full restart?",
      answer:
      "I check the current website before recommending a rebuild. If the foundations are sound, we can improve what is there. If the existing setup makes every change harder, rebuilding may be the more sensible option.",
    },
    {
      question: "Will the site be fast and SEO-ready?",
      answer:
      "Yes. Clear page structure, speed, page titles, descriptions, structured data and visitor tracking are considered during the build. Search visibility still depends on competition, content and reputation, so I do not promise rankings.",
    },
  ],

  "automation-growth": [
    {
      question: "How do you decide what to build with?",
      answer:
      "I first look at how the job works now and where time or information is being lost. I use your existing software when it can do the job reliably. If something new is needed, I explain why before building it.",
    },
    {
      question: "Will my team be able to maintain this after you leave?",
      answer:
      "Yes. You receive instructions, training and a handover. If part of the setup will need ongoing technical support, I tell you before the work begins.",
    },
    {
      question: "Do you do custom integrations or only no-code?",
      answer:
      "Both. I keep standard jobs as simple as possible and only use custom code when ordinary platforms cannot handle the work reliably.",
    },
    {
    question: "How do you decide what is worth automating?",
    answer:
      "The best candidates are repetitive jobs with a clear starting point and a predictable result. I also consider how often the job happens, how much time it takes and what could go wrong. Some tasks are safer and quicker to leave manual.",
    },
  ],
};

export function getServiceFaq(slug: string): FAQ[] {
  return serviceFaq[slug] ?? faq;
}
