import { Fragment } from "react";

export type JsonLdSchema = Record<string, unknown>;

/**
 * Renders one or more JSON-LD schema blocks. Use in any server component
 * (layout, page, route segment). Each schema is emitted as its own
 * `<script type="application/ld+json">` so search engines and AI parsers
 * can validate independently.
 */
export function JsonLd({
  schema,
}: {
  schema: JsonLdSchema | JsonLdSchema[];
}) {
  const blocks = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {blocks.map((s, i) => (
        <Fragment key={i}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        </Fragment>
      ))}
    </>
  );
}

const SITE_URL = "https://namicreative.co.uk";
const STUDIO_NAME = "NAMI Creative";
const FOUNDER_NAME = "Joe Wilson";
const STUDIO_EMAIL = "hello@namicreative.co.uk";
const STUDIO_LOGO = `${SITE_URL}/assets/images/nami-fav.png`;
const STUDIO_OG = `${SITE_URL}/assets/images/Nami-OG-v2.png`;
const STUDIO_LINKEDIN = "https://www.linkedin.com/in/brandingbyjoewilson/";

/**
 * The Organization is the root identity. Everything else (Person,
 * LocalBusiness, Service, Article) references it via @id.
 */
export const organizationSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: STUDIO_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: STUDIO_LOGO,
    width: 512,
    height: 512,
  },
  image: STUDIO_OG,
  description:
    "Independent creative studio for founders. Brand strategy, content systems, websites, visual direction, and growth automation, delivered as one engagement with one creative partner.",
  founder: { "@id": `${SITE_URL}/about#joe-wilson` },
  email: STUDIO_EMAIL,
  sameAs: [STUDIO_LINKEDIN],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Regent Road",
    addressLocality: "Jarrow",
    addressRegion: "Tyne and Wear",
    postalCode: "NE32 5XQ",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", name: "Newcastle upon Tyne" },
    { "@type": "City", name: "Jarrow" },
    { "@type": "City", name: "Gateshead" },
    { "@type": "City", name: "Sunderland" },
    { "@type": "AdministrativeArea", name: "Tyne and Wear" },
    { "@type": "AdministrativeArea", name: "North East England" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Place", name: "Worldwide" },
  ],
};

/**
 * LocalBusiness for local discovery (Google Business Profile, AI overview
 * local intent). Same NAP as Organization but typed for local schema
 * parsers. ProfessionalService is the closest fit for a creative studio.
 */
export const localBusinessSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: STUDIO_NAME,
  url: SITE_URL,
  image: STUDIO_OG,
  email: STUDIO_EMAIL,
  description:
    "North East England creative studio based in Jarrow, Tyne and Wear. Brand, content, websites, and growth systems for founders, built by one creative partner. Serving Newcastle, Tyneside, and clients worldwide.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Regent Road",
    addressLocality: "Jarrow",
    addressRegion: "Tyne and Wear",
    postalCode: "NE32 5XQ",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", name: "Newcastle upon Tyne" },
    { "@type": "City", name: "Jarrow" },
    { "@type": "City", name: "Gateshead" },
    { "@type": "City", name: "Sunderland" },
    { "@type": "AdministrativeArea", name: "Tyne and Wear" },
    { "@type": "AdministrativeArea", name: "North East England" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Place", name: "Worldwide" },
  ],
  priceRange: "££££",
  sameAs: [STUDIO_LINKEDIN],
};

export const websiteSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: STUDIO_NAME,
  description:
    "NAMI Creative. One studio for founders across brand, content, and growth systems.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-GB",
};

export const founderPersonSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about#joe-wilson`,
  name: FOUNDER_NAME,
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/assets/images/bb.jpg`,
  jobTitle: "Founder, NAMI Creative",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  sameAs: [STUDIO_LINKEDIN],
};

/**
 * Build a FAQPage schema from a list of Q&A pairs. Used on any page that
 * surfaces NAMI's FAQ accordion — homepage, services, each service detail.
 */
export function buildFaqPageSchema(
  qa: { question: string; answer: string }[],
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Service schema for each /services/[slug] page.
 */
export function buildServiceSchema(args: {
  slug: string;
  name: string;
  description: string;
  pillar: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${args.slug}#service`,
    name: args.name,
    description: args.description,
    serviceType: args.pillar,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Place", name: "Worldwide" },
    ],
    url: `${SITE_URL}/services/${args.slug}`,
  };
}

/**
 * CreativeWork schema for each case study /work/[slug].
 */
export function buildCaseStudySchema(args: {
  slug: string;
  client: string;
  oneLiner: string;
  sector: string;
  coverUrl?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/work/${args.slug}#case-study`,
    name: `${args.client} · case study`,
    headline: args.client,
    description: args.oneLiner,
    about: args.sector,
    creator: { "@id": `${SITE_URL}/#organization` },
    image: args.coverUrl ? `${SITE_URL}${args.coverUrl}` : STUDIO_OG,
    url: `${SITE_URL}/work/${args.slug}`,
  };
}

/**
 * BreadcrumbList schema for nested routes. Improves SERP appearance
 * (path crumbs in Google results) and helps AI systems understand
 * site hierarchy.
 *
 * Usage: pass an ordered list of [name, url] tuples starting with the
 * site root. Each entry becomes a ListItem at position N+1.
 */
export function buildBreadcrumbSchema(
  trail: { name: string; url: string }[],
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Article schema for each /insights/[slug]. Inlines author + publisher
 * with full ImageObject for the article image and publisher logo so the
 * page qualifies as a Google Article rich result. The @id references on
 * Person and Organization preserve entity coherence with the root
 * schemas.
 */
export function buildArticleSchema(args: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  imageUrl?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/insights/${args.slug}#article`,
    headline: args.title,
    description: args.description,
    datePublished: new Date(args.datePublished).toISOString(),
    dateModified: new Date(args.datePublished).toISOString(),
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#joe-wilson`,
      name: FOUNDER_NAME,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: STUDIO_NAME,
      logo: {
        "@type": "ImageObject",
        url: STUDIO_LOGO,
        width: 512,
        height: 512,
      },
    },
    image: {
      "@type": "ImageObject",
      url: args.imageUrl ? `${SITE_URL}${args.imageUrl}` : STUDIO_OG,
      width: 1600,
      height: 1000,
    },
    mainEntityOfPage: `${SITE_URL}/insights/${args.slug}`,
    inLanguage: "en-GB",
  };
}
