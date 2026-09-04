import "server-only";
import { getAllPosts } from "@/lib/content/insights";
import { formatPostDate } from "@/lib/content/insights-utils";

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
  source: "network" | "insight";
  featured?: boolean;
  body?: string[];
};

const networkArticles: NetworkNewsItem[] = [
  {
    slug: "five-north-east-creatives-making-waves-this-week",
    title: "Five North East creatives making waves this week",
    summary:
      "A quick look at local artists, photographers, designers, makers, and independents putting proper work into the world.",
    kicker: "Weekly spotlight",
    category: "Spotlights",
    date: "2026-07-23",
    minutes: 3,
    href: "/network/news/five-north-east-creatives-making-waves-this-week",
    image: "/network-news/creative-night.jpg",
    source: "network",
    featured: true,
    body: [
      "The Creative Network is being built around a simple idea: more good North East work should be easier to find.",
      "Each roundup will pull together people making useful, generous, distinctive, or quietly brilliant things across the region. Some will be established. Some will be early. The point is to back the work before everyone else catches up.",
      "If you know someone who should be seen by more people, send them to the network. If that someone is you, even better. Put your name in and let NAMI know what you are building.",
    ],
  },
  {
    slug: "inside-the-first-wave-of-the-nami-creative-network",
    title: "Inside the first wave of the NAMI Creative Network",
    summary:
      "What is being built, why it matters, and how the network will help people get seen, supported, and hired.",
    kicker: "Network update",
    category: "Network News",
    date: "2026-07-22",
    minutes: 4,
    href: "/network/news/inside-the-first-wave-of-the-nami-creative-network",
    image: "/network-news/north-east-creative.jpg",
    source: "network",
    body: [
      "NAMI started by spotlighting local creativity. The network is the next step: a cleaner way to keep track of who is doing what across the North East.",
      "The first phase is deliberately simple. Join the network, tell NAMI what you do, and stay close to the roundups, features, events, and opportunities that follow.",
      "The aim is not to build another noisy directory. It is to build trust, context, and a useful route between creative people and the businesses, venues, projects, and communities that need them.",
    ],
  },
  {
    slug: "newcastle-freelancers-building-their-own-table",
    title: "Newcastle freelancers building their own table",
    summary:
      "A note on low-pressure connection, proper collaboration, and why local freelancers need more rooms that are not just networking events.",
    kicker: "Freelance life",
    category: "Interviews",
    date: "2026-07-21",
    minutes: 4,
    href: "/network/news/newcastle-freelancers-building-their-own-table",
    image: "/network-news/studio-detail.webp",
    source: "network",
    body: [
      "There is a lot of good freelance work happening in Newcastle and across the North East, but too much of it happens in isolation.",
      "People do not always need a pitch night or a hard sell. Sometimes they need a low-stakes way to meet other people who understand the work, the doubt, the admin, the invoices, and the joy of making something from scratch.",
      "That is one of the roles the Creative Network can play: a warmer front door into people, projects, and chances to collaborate properly.",
    ],
  },
  {
    slug: "open-call-show-your-latest-project",
    title: "Open call: show your latest project",
    summary:
      "Got a launch, piece, shoot, event, track, mural, product, or small business update? Put it forward for future NAMI roundups.",
    kicker: "Callout",
    category: "Opportunities",
    date: "2026-07-20",
    minutes: 2,
    href: "/network/news/open-call-show-your-latest-project",
    image: "/network-news/feature-project.jpg",
    source: "network",
    body: [
      "If you have made something recently, do not let it disappear after one post. Tag NAMI, join the network, and make it easier for the work to be seen again.",
      "Roundups will look for people building with care across art, music, photography, design, content, local business, independent brands, food, fashion, venues, and community projects.",
      "There is no perfect time to share your work. The rough-but-real stage is still worth backing.",
    ],
  },
  {
    slug: "how-local-businesses-can-work-with-creatives-properly",
    title: "How local businesses can work with creatives properly",
    summary:
      "A practical note for small businesses that want better content, stronger campaigns, and a healthier relationship with creative suppliers.",
    kicker: "Business guide",
    category: "Marketing Notes",
    date: "2026-07-18",
    minutes: 5,
    href: "/network/news/how-local-businesses-can-work-with-creatives-properly",
    image: "/network-news/maker-work.jpeg",
    source: "network",
    body: [
      "Good creative work needs context. If a business wants better output, it has to give people the right information, enough room to think, and a clear idea of what good looks like.",
      "That does not mean turning every project into a huge process. It means being clear on the audience, the offer, the deadline, the decision maker, and the job the work has to do.",
      "The Creative Network should make it easier for businesses to find the right people. The next step is making sure those people are brought into the work properly.",
    ],
  },
  {
    slug: "north-east-events-and-opportunities-to-watch",
    title: "North East events and opportunities to watch",
    summary:
      "A lightweight noticeboard for creative meetups, callouts, launches, exhibitions, and chances to get involved across the region.",
    kicker: "Noticeboard",
    category: "Opportunities",
    date: "2026-07-16",
    minutes: 3,
    href: "/network/news/north-east-events-and-opportunities-to-watch",
    image: "/network-news/original-art.webp",
    source: "network",
    body: [
      "As the network grows, NAMI will start pulling together more useful opportunities in one place.",
      "That could mean exhibitions, open calls, freelance gigs, workshops, launches, community projects, creative jobs, venue nights, or small chances that are easy to miss if you are not in the right corner of the internet.",
      "For now, join the network and keep tagging NAMI in what you are building. The clearer the picture gets, the more useful the roundups can become.",
    ],
  },
];

const insightImages = [
  "/network-news/local-work-1.avif",
  "/network-news/local-work-2.avif",
  "/network-news/north-east-creative.jpg",
];

function insightToNetworkItem(
  post: Awaited<ReturnType<typeof getAllPosts>>[number],
  index: number,
): NetworkNewsItem {
  return {
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    kicker: post.pillar,
    category: "Marketing Notes",
    date: post.date,
    minutes: post.minutes,
    href: `/insights/${post.slug}`,
    image: insightImages[index % insightImages.length],
    source: "insight",
    featured: post.featured,
  };
}

export async function getAllNetworkNews(): Promise<NetworkNewsItem[]> {
  const insights = await getAllPosts();
  return [...networkArticles, ...insights.map(insightToNetworkItem)].sort((a, b) =>
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

export { formatPostDate };