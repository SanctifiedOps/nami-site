import type { LucideIcon } from "lucide-react";
import { Compass, Layers, Globe, Zap } from "lucide-react";

export type Service = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  pillar: "Branding" | "Content" | "Websites" | "Automation";
  seoTitle: string;
  metaDescription: string;
  searchTerms: string[];
  problems: string[];
  help: { title: string; body: string }[];
  deliverables: string[];
  deliverableGroups: { title: string; items: string[] }[];
  steps: { title: string; body: string }[];
  outcome: string;
};

export const services: Service[] = [
  {
    slug: "brand-strategy",
    index: "01",
    title: "A brand people recognise",
    tagline:
      "Make it clear what your business stands for and give it a look people remember.",
    description:
      "Branding for North East businesses that have outgrown their current look, struggle to explain what makes them different or feel inconsistent wherever customers find them.",
    icon: Compass,
    pillar: "Branding",
    seoTitle: "Branding for Small Businesses in Newcastle & the North East",
    metaDescription:
      "Clear branding, messaging and visual identity for small businesses in Newcastle and across North East England. Work directly with Joe at NAMI Creative.",
    searchTerms: [
      "small business branding Newcastle",
      "branding agency Newcastle",
      "brand designer North East",
      "visual identity Newcastle",
    ],
    problems: [
      "You explain the business differently every time somebody asks what you do.",
      "Your website, social posts and sales materials look like they belong to different companies.",
      "The business has grown, but the brand still looks like the version you started with.",
      "Customers struggle to see why they should choose you instead of the cheaper option.",
    ],
    help: [
      {
        title: "Make the offer easier to understand",
        body: "We work out what customers need to know, what makes the business worth choosing and how to say it clearly.",
      },
      {
        title: "Give the business a recognisable look",
        body: "I create or improve the logo, colours, type, imagery and other visual details people associate with you.",
      },
      {
        title: "Make everything feel consistent",
        body: "The same decisions carry across your website, social posts, presentations, print and campaigns.",
      },
      {
        title: "Leave you with rules you can use",
        body: "You get practical guidance and editable files, so the brand stays consistent after the project ends.",
      },
    ],
    deliverables: [
      "Clear positioning and audience",
      "Key messages and tone of voice",
      "Logo and visual identity where needed",
      "Colour, type and image direction",
      "Examples across real business materials",
      "Editable files and practical brand guidance",
    ],
    deliverableGroups: [
      {
        title: "Get clear on the business",
        items: ["Clear positioning and audience", "Key messages and tone of voice"],
      },
      {
        title: "Build the identity",
        items: ["Logo and visual identity where needed", "Colour, type and image direction"],
      },
      {
        title: "Make it usable",
        items: ["Examples across real business materials", "Editable files and practical brand guidance"],
      },
    ],
    steps: [
      {
        title: "Understand the business",
        body: "We talk through what you sell, who chooses you and where the current brand is causing problems.",
      },
      {
        title: "Set the direction",
        body: "I shape the wording and visual direction, then show you how it works on things your customers will actually see.",
      },
      {
        title: "Put it to work",
        body: "I finish the agreed materials and hand over a brand you and your team can use with confidence.",
      },
    ],
    outcome:
      "Customers understand what you do more quickly, the business looks as good as the work behind it and everything feels recognisably yours.",
  },
  {
    slug: "content-systems",
    index: "02",
    title: "Content you can keep up with",
    tagline:
      "Know what to talk about, make useful posts faster and stop starting from a blank page.",
    description:
      "Content planning and creation for North East businesses that struggle to post consistently, run out of useful ideas or spend too long making every piece.",
    icon: Layers,
    pillar: "Content",
    seoTitle: "Content Marketing for Small Businesses in Newcastle",
    metaDescription:
      "Content ideas, planning, writing and repeatable formats for small businesses in Newcastle and the North East. Make useful content without starting again every week.",
    searchTerms: [
      "content marketing Newcastle",
      "social media content North East",
      "content strategy small business",
      "content creation Newcastle",
    ],
    problems: [
      "You know you should post, but deciding what to say takes too long.",
      "Content only happens when somebody finds a spare hour.",
      "Every post looks and sounds different from the last one.",
      "You are putting time into content without knowing what is worth repeating.",
    ],
    help: [
      {
        title: "Find useful things to talk about",
        body: "I turn your knowledge, customer questions and day-to-day work into topics people will care about.",
      },
      {
        title: "Create formats you can repeat",
        body: "You get a small set of post, video and email formats that make the next piece easier to produce.",
      },
      {
        title: "Make it sound like you",
        body: "I set a clear voice and write real examples so the content does not read like generic marketing copy.",
      },
      {
        title: "Build a realistic routine",
        body: "The plan fits the time and people you actually have, including who creates, checks and publishes each piece.",
      },
    ],
    deliverables: [
      "Content topics based on the business",
      "Repeatable post, video and email formats",
      "Writing and tone guidance",
      "A realistic publishing plan",
      "Templates and example content",
      "A simple way to review what is working",
    ],
    deliverableGroups: [
      {
        title: "Know what to say",
        items: ["Content topics based on the business", "Repeatable post, video and email formats"],
      },
      {
        title: "Make it consistently",
        items: ["Writing and tone guidance", "A realistic publishing plan"],
      },
      {
        title: "Keep improving it",
        items: ["Templates and example content", "A simple way to review what is working"],
      },
    ],
    steps: [
      {
        title: "See what is worth keeping",
        body: "I review your existing content, customer questions and the subjects you are best placed to talk about.",
      },
      {
        title: "Build the useful formats",
        body: "I create the topics, formats, templates and examples that will make up your regular content.",
      },
      {
        title: "Make it manageable",
        body: "We agree a routine you can maintain, or I can stay involved and help produce the work with you.",
      },
    ],
    outcome:
      "You spend less time wondering what to post, your content sounds consistent and the best ideas become easier to use more than once.",
  },
  {
    slug: "website-funnel",
    index: "03",
    title: "A website that brings in enquiries",
    tagline:
      "Help visitors understand what you offer, trust the business and take the next step.",
    description:
      "Website design, copy and development for North East businesses whose current site is unclear, dated, difficult to update or failing to bring in enough enquiries.",
    icon: Globe,
    pillar: "Websites",
    seoTitle: "Small Business Website Design in Newcastle & North East",
    metaDescription:
      "Website design, copy and development for small businesses in Newcastle and the North East. Clear, fast websites built to bring in genuine enquiries.",
    searchTerms: [
      "website design Newcastle",
      "web designer Newcastle",
      "small business website North East",
      "website copywriting Newcastle",
    ],
    problems: [
      "People visit the website but do not get in touch.",
      "The site does not explain clearly what you offer or who it is for.",
      "It looks dated, loads slowly or is awkward to use on a phone.",
      "Changing a price, service or piece of content has become a job in itself.",
    ],
    help: [
      {
        title: "Make the offer clear",
        body: "I organise and write the pages so visitors quickly understand what you do and why it matters to them.",
      },
      {
        title: "Give every page a purpose",
        body: "The structure leads people towards an enquiry, booking, purchase or other useful next step.",
      },
      {
        title: "Design and build the whole site",
        body: "You do not need to coordinate a copywriter, designer and developer. I take the agreed site through to launch.",
      },
      {
        title: "Make it fast and easy to use",
        body: "The finished site works properly across phones and computers, with sensible search setup and visitor tracking included.",
      },
    ],
    deliverables: [
      "Page plan and website structure",
      "Clear website copy",
      "Custom design for desktop and mobile",
      "Website development and testing",
      "Forms, bookings or payments where needed",
      "Search setup, analytics and handover",
    ],
    deliverableGroups: [
      {
        title: "Plan the right pages",
        items: ["Page plan and website structure", "Clear website copy"],
      },
      {
        title: "Design and build them",
        items: ["Custom design for desktop and mobile", "Website development and testing"],
      },
      {
        title: "Make the site work",
        items: ["Forms, bookings or payments where needed", "Search setup, analytics and handover"],
      },
    ],
    steps: [
      {
        title: "Work out what the site needs to do",
        body: "We agree who the site is for, what visitors need to understand and which actions matter to the business.",
      },
      {
        title: "Write, design and build it",
        body: "I bring the copy and design together before building the pages and connecting the forms or other tools you need.",
      },
      {
        title: "Check it and put it live",
        body: "I test the site on different screens, connect tracking, handle the launch and show you how to update it.",
      },
    ],
    outcome:
      "Visitors understand the business, find the information they need and have a clear reason to contact you. You also get a site that is simpler to maintain.",
  },
  {
    slug: "automation-growth",
    index: "04",
    title: "Less admin and fewer missed follow-ups",
    tagline:
      "Take repetitive jobs off your plate and keep enquiries moving without relying on memory.",
    description:
      "Practical business automation for North East companies that lose time copying information, chasing routine tasks or manually following up enquiries.",
    icon: Zap,
    pillar: "Automation",
    seoTitle: "Small Business Automation in Newcastle & North East",
    metaDescription:
      "Practical automation for small businesses in Newcastle and the North East. Reduce repetitive admin, organise enquiries and make follow-ups more reliable.",
    searchTerms: [
      "small business automation Newcastle",
      "business process automation North East",
      "email automation Newcastle",
      "CRM setup small business UK",
    ],
    problems: [
      "Enquiries arrive in different places and some do not get answered quickly enough.",
      "You copy the same information between forms, emails and spreadsheets.",
      "Routine reminders and follow-ups depend on somebody remembering them.",
      "You spend part of every week producing the same updates or reports by hand.",
    ],
    help: [
      {
        title: "Organise incoming enquiries",
        body: "Forms, emails and customer details can go to the right place without you moving everything by hand.",
      },
      {
        title: "Make follow-ups reliable",
        body: "Customers receive the right acknowledgement, reminder or update while you keep control of anything that needs a personal reply.",
      },
      {
        title: "Remove repeat admin",
        body: "I connect the jobs you do over and over, such as updating records, sending documents or preparing regular reports.",
      },
      {
        title: "Keep the setup understandable",
        body: "You get clear instructions and a setup that fits the business instead of a complicated collection of tools.",
      },
    ],
    deliverables: [
      "A review of the current process",
      "A clear plan for what should be automated",
      "Connected forms, email and business records",
      "Automatic reminders and follow-ups",
      "Testing for errors and unusual cases",
      "Instructions and a practical handover",
    ],
    deliverableGroups: [
      {
        title: "Find the right jobs to fix",
        items: ["A review of the current process", "A clear plan for what should be automated"],
      },
      {
        title: "Connect the moving parts",
        items: ["Connected forms, email and business records", "Automatic reminders and follow-ups"],
      },
      {
        title: "Make it reliable",
        items: ["Testing for errors and unusual cases", "Instructions and a practical handover"],
      },
    ],
    steps: [
      {
        title: "Find where the time is going",
        body: "We walk through the job as it happens now and identify the repetitive parts worth fixing.",
      },
      {
        title: "Build and test the new process",
        body: "I connect the right steps, test normal and unusual cases, and make sure important decisions still stay with a person.",
      },
      {
        title: "Show you how it works",
        body: "You get a clear handover, instructions and support while the new process settles into the business.",
      },
    ],
    outcome:
      "Routine work happens on time, enquiries are easier to track and fewer important jobs depend on what you happen to remember that day.",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
