export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * Client recommendations, trimmed for brand voice. Source: LinkedIn
 * recommendations on /in/brandingbyjoewilson — 2023–2024 client engagements.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I genuinely cannot remember working alongside somebody that understood the project at an emotional level and listened to my vision. Could not recommend him enough to create the global presence of your business.",
    author: "Michael Tansey",
    role: "Head of Sales · Procure Smart",
  },
  {
    quote:
      "Joe's work is amazing. Incredibly easy to work with, meets his commitments, and a creative genius making waves.",
    author: "Chris Howe",
    role: "Executive Performance Coach · Author, Peak Performance",
  },
  {
    quote:
      "His creative eye is spot-on, and every single creation is showstopping. Easy-going, gives value to every conversation, and goes out of his way to help his clients succeed.",
    author: "Rowena Wilding",
    role: "B2B Marketing Strategist & Coach",
  },
  {
    quote:
      "I can be brutally honest and dread when people ask what I think. In this case, I needn't have worried. Joe nailed the concept first time and the standard of work was incredible.",
    author: "Colin Beard",
    role: "Owner & Director · Prosperity Care and Wellbeing",
  },
  {
    quote:
      "Working with Joe was so easy. From initial contact, through design, to revisions. He captured my vision, we bounced ideas back and forth, and it was just so smooth.",
    author: "John McKie",
    role: "Email Revenue Systems for Coaches & Founders",
  },
  {
    quote:
      "Joe's expertise in personal branding and design truly shines through. He took the time to understand my business, my goals, and my aspirations. The transformation he's brought to my brand is exceptional.",
    author: "Orange John",
    role: "Founder · Three Peaks Mountain Guide",
  },
];
