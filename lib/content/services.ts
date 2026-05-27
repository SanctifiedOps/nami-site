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
    tagline: "Positioning that gets used daily, not documented and forgotten.",
    description:
      "Foundational work: positioning, messaging architecture, tone of voice, visual direction. Assembled into a brand framework you run a business off day to day.",
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
      "A brand that holds together when you stop being in every room. Every piece of content, marketing, and product feels deliberate and connected.",
  },
  {
    slug: "content-systems",
    index: "02",
    title: "Content systems + creation",
    tagline: "Build a content engine, not a stream of disconnected posts.",
    description:
      "Repeatable content formats, platform-specific strategy, and narrative architecture. Designed so every output earns its place and supports the next.",
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
      "Content that stops feeling random. Formats repeat, narrative deepens, and you stop guessing what to post.",
  },
  {
    slug: "website-funnel",
    index: "03",
    title: "Website + funnel design",
    tagline:
      "Websites are conversion environments, not online brochures.",
    description:
      "User flow, messaging hierarchy, and conversion structure designed around action. Built premium, performant, and ready to scale traffic into pipeline.",
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
      "Traffic turns into action: qualified leads, booked calls, and a brand experience that earns trust on the first visit.",
  },
  {
    slug: "visual-direction",
    index: "04",
    title: "Visual storytelling + creative direction",
    tagline: "Make the brand instantly recognisable everywhere it shows up.",
    description:
      "Cohesive visual language across content, product, and campaign, directed so the brand reads consistently whether someone meets it on Instagram, in an inbox, or on a billboard.",
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
      "Recognition before recall. The brand is identifiable from a frame, a colour, a single line of copy.",
  },
  {
    slug: "automation-growth",
    index: "05",
    title: "Automation + growth systems",
    tagline:
      "The infrastructure that lets the brand keep up with the business.",
    description:
      "Operations stacks, lifecycle email, lead-capture pipelines, content automations. The connective tissue between brand and operations so consistency scales without burning your team.",
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
      "Less manual work, more leverage. The brand stays consistent at 10× volume because the systems are doing the carrying.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
