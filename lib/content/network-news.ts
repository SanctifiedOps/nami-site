import "server-only";

// Keep the prepared news section private until Joe has approved its content.
export const networkNewsPublished = false;

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export type NetworkNewsCategory =
  | "Spotlights"
  | "Network News"
  | "Interviews"
  | "Opportunities"
  | "Marketing Notes";

export type NetworkNewsItem = {
  slug: string;
  title: string;
  summary: string;
  kicker: string;
  category: NetworkNewsCategory;
  date: string;
  minutes: number;
  href: string;
  image?: string;
  source: "network";
  featured?: boolean;
  body?: string[];
  memberIds?: string[];
};

const networkArticles: NetworkNewsItem[] = [
  {
    slug: "north-east-creatives-unusual-materials",
    title: "Five North East creatives turning unusual materials into proper work",
    summary:
      "Recycled silver, rolled paper, clay, found objects and reclaimed materials in the hands of five independent makers.",
    kicker: "Five to find",
    category: "Spotlights",
    date: "2026-09-09",
    minutes: 5,
    href: "/network/news/north-east-creatives-unusual-materials",
    image: "/network-news/maker-work.jpeg",
    source: "network",
    featured: true,
    body: [
      "Materials carry a history before a maker ever touches them. These five Network members use that history as part of the work, whether they are shaping recycled silver, rolling paper into sculpture or giving discarded objects another life.",
      "This is not a definitive list. It is a starting point for finding more of the independent work being made across the North East.",
      "Follow their work, visit their sites and remember their names when the right commission, collaboration or conversation comes up.",
    ],
    memberIds: ["amanda-mulholland", "melanie-heaps", "varie-freyne", "brittania-douglas", "lucy-minta-reeves-b4807ed3"],
  },
  {
    slug: "why-i-built-the-nami-creative-directory",
    title: "I built a directory because good work keeps disappearing in the feed",
    summary:
      "A note from Joe on turning a growing list of North East talent into something people can actually search, share and use.",
    kicker: "From Joe",
    category: "Network News",
    date: "2026-09-08",
    minutes: 5,
    href: "/network/news/why-i-built-the-nami-creative-directory",
    image: "/network-news/north-east-creative.jpg",
    source: "network",
    body: [
      "I kept seeing brilliant North East work once, usually in a post or story, and then losing it again. The problem was not a lack of talent. It was that there was no useful place to keep track of everybody.",
      "The NAMI Creative Network began as a list. It has grown into a public directory where businesses, venues, councils and other creatives can search by discipline and location. A name in the directory can now lead somewhere after the original post has gone.",
      "I am building the wider Network around that same principle. Features should have a longer life. Introductions should be easier. Opportunities should reach people who would otherwise miss them.",
      "There is plenty still to build, and I am doing it around client work, family and the rest of real life. But every new member makes the picture of North East creativity a little clearer.",
    ],
    memberIds: ["joe-wilson-nami-creative"],
  },
  {
    slug: "north-east-designers-making-ideas-real",
    title: "Five North East designers making ideas real",
    summary:
      "Brand systems, theatre campaigns, interiors, costume and community-led design from five members of the Network.",
    kicker: "Design directory",
    category: "Spotlights",
    date: "2026-09-07",
    minutes: 5,
    href: "/network/news/north-east-designers-making-ideas-real",
    image: "/network-news/studio-detail.webp",
    source: "network",
    body: [
      "Design in the Network stretches well beyond one format. It can become a brand, a room, a theatre campaign, a costume or a place for people to meet.",
      "These five members work across very different parts of the discipline, but each turns an idea into something other people can see, use or experience.",
      "If you need a designer, start with the kind of problem you need them to solve. The directory makes it easier to find someone whose practice already fits the work.",
    ],
    memberIds: ["jack-alberts---trigo-studio", "jem-solley-0d037893", "graeme-smith-26aa4c64", "phillip-brown-0fb8dc6f", "sarah-carlton-designbykinship"],
  },
  {
    slug: "north-east-independent-businesses-with-personality",
    title: "Five independent North East businesses with bags of personality",
    summary:
      "Jerky, nail art, mens grooming, clothing and a creative studio. Different businesses connected by a clear sense of who they are.",
    kicker: "Independent business",
    category: "Spotlights",
    date: "2026-09-06",
    minutes: 5,
    href: "/network/news/north-east-independent-businesses-with-personality",
    image: "/network-news/feature-project.jpg",
    source: "network",
    body: [
      "Small businesses do not need to sound like everybody else to be taken seriously. A clear personality helps the right people recognise themselves in the offer.",
      "The businesses below work in completely different fields. What connects them is specificity: a distinct product, audience, point of view or way of making people feel welcome.",
      "That clarity is worth paying attention to if you are building an independent business of your own.",
    ],
    memberIds: ["jerk-it-together-6eccd55c", "rickiah-quinn-8e0ca5b7", "luke-westgate-b70c1dee", "phil-davison-nice-face-apparel", "katie-brydon-ff161079"],
  },
  {
    slug: "north-east-photographers-to-know",
    title: "Five North East photographers giving local talent a proper face",
    summary:
      "Music, fashion, live performance, portraits and experimental image-making from photographers across the region.",
    kicker: "Photography directory",
    category: "Spotlights",
    date: "2026-09-05",
    minutes: 5,
    href: "/network/news/north-east-photographers-to-know",
    image: "/network-news/creative-night.jpg",
    source: "network",
    body: [
      "Photography shapes how musicians, performers, founders and independent businesses are first understood. The right photographer does more than record what is in front of the lens. They find the part worth remembering.",
      "These five Network members cover live events, music, fashion, portraits and experimental techniques. Their practices are different enough to show why choosing by fit matters.",
      "Browse their work and keep the right name nearby for your next release, campaign, event or portrait.",
    ],
    memberIds: ["jodie-beardmore-680da2d8", "steven-wilson", "andi-talbot", "haydn-brown", "neil-johnson"],
  },
  {
    slug: "north-east-creative-spaces-and-communities",
    title: "Five places and communities bringing North East creatives together",
    summary:
      "Coworking, workshops, conversation, making and recording spaces created by members of the Network.",
    kicker: "Places to know",
    category: "Network News",
    date: "2026-09-04",
    minutes: 5,
    href: "/network/news/north-east-creative-spaces-and-communities",
    image: "/network-news/original-art.webp",
    source: "network",
    body: [
      "Creative people need more than online reach. They need places to work, talk, learn, test ideas and meet people without having to pitch themselves across a room.",
      "These Network members are building that infrastructure in different ways. Some run physical spaces. Others organise coworking, workshops or conversations that make the region feel less disconnected.",
      "Check each organiser's own channels for current opening times, sessions and event dates before making a journey.",
    ],
    memberIds: ["sarah-carlton-billynomates-cowork", "su-devine", "auburn-langley", "katie-brydon-ff161079", "heywood-dab1d954"],
  },
  {
    slug: "member-spotlight-amanda-jo",
    title: "Member spotlight: Amanda Jo",
    summary:
      "Art, paramedical tattooing and work designed to give something meaningful back after surgery.",
    kicker: "Member spotlight",
    category: "Interviews",
    date: "2026-09-03",
    minutes: 4,
    href: "/network/news/member-spotlight-amanda-jo",
    image: "/network-news/local-work-1.avif",
    source: "network",
    body: [
      "Amanda Jo's practice crosses visual art and paramedical tattooing, including realistic areola tattooing for people following cancer and other surgeries.",
      "She co-founded the North East Nipple Project and helped develop Bloom, a hyperrealistic prosthetic areola. It is creative work with a very direct human purpose.",
      "This introduction is drawn from Amanda's Network submission. A longer interview will follow so she can explain the work, the process and the thinking behind it in her own words.",
    ],
    memberIds: ["amanda-jo"],
  },
  {
    slug: "algorithm-is-not-a-measure-of-your-talent",
    title: "The algorithm is not a measure of your talent",
    summary:
      "Good work can be quiet online. That is exactly why the Network needs more than a feed.",
    kicker: "From Joe",
    category: "Marketing Notes",
    date: "2026-09-02",
    minutes: 4,
    href: "/network/news/algorithm-is-not-a-measure-of-your-talent",
    image: "/network-news/local-work-2.avif",
    source: "network",
    body: [
      "Reach is useful, but it is a poor judge of the work. A post can stall because of timing, format, audience history or plain bad luck. None of those things changes the care, skill or thought inside what you made.",
      "The danger begins when the numbers start editing the practice. You make what performed last time, use the format everybody else is using and slowly move away from the reason people cared in the first place.",
      "Learn how to present your work clearly. Give people enough context to understand it. Keep showing up. But do not hand an algorithm the job of deciding whether you are any good.",
      "The directory, roundups and future NAMI events are being built to create more routes into the work. A useful creative network should remember people after the feed has moved on.",
    ],
  },
];

export async function getAllNetworkNews(): Promise<NetworkNewsItem[]> {
  return [...networkArticles].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function getNetworkArticleBySlug(slug: string): NetworkNewsItem | null {
  return networkArticles.find((article) => article.slug === slug) ?? null;
}

export function getNetworkArticleSlugs(): string[] {
  return networkArticles.map((article) => article.slug);
}

export function getNetworkCategories(items: NetworkNewsItem[]): NetworkNewsCategory[] {
  return Array.from(new Set(items.map((item) => item.category)));
}
