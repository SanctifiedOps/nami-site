import { Fragment } from "react";

export type JsonLdSchema = Record<string, unknown>;

/**
 * Renders one or more JSON-LD schema blocks. Each schema is emitted as its own
 * script so validators, search engines, and AI parsers can read them cleanly.
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
const STUDIO_LOGO = `${SITE_URL}/Nami%20Favicon.png`;
const STUDIO_OG = `${SITE_URL}/nami-og%20%281%29.png`;
const STUDIO_LINKEDIN = "https://www.linkedin.com/in/brandingbyjoewilson/";
const STUDIO_INSTAGRAM = "https://www.instagram.com/namicreativeuk/";

const sameAs = [STUDIO_LINKEDIN, STUDIO_INSTAGRAM];

const areaServed = [
  { "@type": "City", name: "Newcastle upon Tyne" },
  { "@type": "City", name: "Jarrow" },
  { "@type": "City", name: "Gateshead" },
  { "@type": "City", name: "Sunderland" },
  { "@type": "City", name: "Durham" },
  { "@type": "AdministrativeArea", name: "Northumberland" },
  { "@type": "AdministrativeArea", name: "Tyne and Wear" },
  { "@type": "AdministrativeArea", name: "North East England" },
  { "@type": "Country", name: "United Kingdom" },
  { "@type": "Place", name: "Worldwide" },
];

const knowsAbout = [
  "Newcastle creatives",
  "North East creatives",
  "creative community building",
  "marketing strategy",
  "content strategy",
  "website design",
  "buyer journey automation",
  "brand positioning",
  "small business marketing",
];

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Regent Road",
  addressLocality: "Jarrow",
  addressRegion: "Tyne and Wear",
  postalCode: "NE32 5XQ",
  addressCountry: "GB",
};

export const organizationSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: STUDIO_NAME,
  alternateName: ["NAMI Creative UK", "NAMI Creative Network"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: STUDIO_LOGO,
    width: 512,
    height: 512,
  },
  image: STUDIO_OG,
  description:
    "NAMI Creative helps North East businesses, brands, and creatives get seen through marketing, websites, content, automation, and the NAMI Creative Network.",
  founder: { "@id": `${SITE_URL}/about#joe-wilson` },
  email: STUDIO_EMAIL,
  sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    email: STUDIO_EMAIL,
    contactType: "customer enquiries",
    areaServed: "GB",
    availableLanguage: "en-GB",
  },
  address: postalAddress,
  areaServed,
  knowsAbout,
};

export const localBusinessSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: STUDIO_NAME,
  url: SITE_URL,
  image: STUDIO_OG,
  email: STUDIO_EMAIL,
  description:
    "Newcastle and North East creative partner based in Jarrow, Tyne and Wear. Marketing, content, websites, automation, and community support for local businesses, brands, and creatives.",
  address: postalAddress,
  areaServed,
  serviceArea: { "@type": "AdministrativeArea", name: "North East England" },
  priceRange: "GBP",
  sameAs,
  knowsAbout,
};

export const websiteSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: STUDIO_NAME,
  alternateName: "NAMI Creative Network",
  description:
    "NAMI Creative is a Newcastle and North East marketing partner and Creative Network for businesses, brands, freelancers, artists, and local creatives.",
  about: [
    "Newcastle creatives",
    "North East creatives",
    "marketing services Newcastle",
    "NAMI Creative Network",
  ],
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
  homeLocation: { "@type": "Place", name: "Newcastle upon Tyne" },
  sameAs,
  knowsAbout,
};

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
    areaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/services/${args.slug}`,
    },
    url: `${SITE_URL}/services/${args.slug}`,
  };
}

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
    name: `${args.client} case study`,
    headline: args.client,
    description: args.oneLiner,
    about: args.sector,
    creator: { "@id": `${SITE_URL}/#organization` },
    image: args.coverUrl ? `${SITE_URL}${args.coverUrl}` : STUDIO_OG,
    url: `${SITE_URL}/work/${args.slug}`,
  };
}

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
