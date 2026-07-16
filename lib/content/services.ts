import type { LucideIcon } from "lucide-react";
import { Compass, Layers, Globe, Eye, Zap } from "lucide-react";

export type Service = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  pillar: "Brand" | "Content" | "Systems";
  deliverables: string[];
  outcome: string;
};

export const services: Service[] = [
  {
    slug: "brand-strategy",
    index: "01",
    title: "Brand strategy + identity systems",
    tagline: "Positioning your team can use on the next decision",
    description:
      "Positioning, messaging architecture, tone of voice, and visual direction. The work ends in usable rules, not a document nobody opens after launch.",
    icon: Compass,
    pillar: "Brand",
    deliverables: [
      "Strategic positioning + audience definition",
      "Messaging hierarchy + tone of voice",
      "Visual identity direction + design tokens",
      "Brand framework + applied guidelines",
      "Decision-ready brand book",
    ],
    outcome:
      "The next page, post, deck, and product decision all have the same centre of gravity, even when you are not there to explain it.",
  },
  {
    slug: "content-systems",
    index: "02",
    title: "Content systems + creation",
    tagline: "Formats, angles, and workflows your team can repeat without guessing",
    description:
      "Repeatable content formats, platform-specific strategy, and narrative architecture. Built so the next post starts from a system, not a blank page.",
    icon: Layers,
    pillar: "Content",
    deliverables: [
      "Content pillars + format library",
      "Platform-specific strategy",
      "Editorial calendar + workflow",
      "Production templates + briefs",
      "Performance review system",
    ],
    outcome:
      "Your content starts to sound like it is coming from the same business every time, with formats that get stronger the more they are used.",
  },
  {
    slug: "website-funnel",
    index: "03",
    title: "Website + funnel design",
    tagline:
      "A site built around the decision you need the visitor to make",
    description:
      "User flow, messaging hierarchy, and conversion structure designed around action. Built fast, clear, and ready to turn attention into the next step.",
    icon: Globe,
    pillar: "Brand",
    deliverables: [
      "Site architecture + user flow",
      "Conversion-led copywriting",
      "Premium design system",
      "Performance-led build",
      "Analytics + experimentation setup",
    ],
    outcome:
      "Visitors know where they are, why it matters, and what to do next. Leads stop disappearing between interest and enquiry.",
  },
  {
    slug: "visual-direction",
    index: "04",
    title: "Visual storytelling + creative direction",
    tagline: "Give every campaign, shoot, and asset the same visual nerve",
    description:
      "Creative direction across content, product, and campaign, so the brand does not change personality every time it moves to a new channel.",
    icon: Eye,
    pillar: "Brand",
    deliverables: [
      "Creative direction + art direction",
      "Visual systems + asset libraries",
      "Photography + video direction",
      "Campaign concept development",
      "Cross-platform style guides",
    ],
    outcome:
      "The brand becomes easier to recognise because the same visual decisions keep showing up in the right places.",
  },
  {
    slug: "automation-growth",
    index: "05",
    title: "Automation + growth systems",
    tagline:
      "The repeatable work moved out of your head and into the stack",
    description:
      "Operations stacks, lifecycle email, lead-capture pipelines, and content workflows. Built around the tasks that keep coming back each week.",
    icon: Zap,
    pillar: "Systems",
    deliverables: [
      "Lead-capture + nurture pipelines",
      "CRM + operations stack",
      "Content automation workflows",
      "Email + lifecycle marketing",
      "Reporting + dashboard systems",
    ],
    outcome:
      "Leads, content, automations, and reporting stop depending on memory. The system carries the recurring work before it eats the week.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
