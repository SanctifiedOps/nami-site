import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for namicreative.co.uk and our engagement principles.",
  robots: { index: true, follow: true },
};

const UPDATED = "6 May 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Terms of <span className="text-gradient">use.</span>
          </>
        }
        lead="The ground rules for using this website. Engagement-specific terms are agreed in writing per project."
      />

      <section className="container-shell py-20 md:py-28">
        <article className="mx-auto max-w-3xl space-y-10 text-fg-muted leading-relaxed">
          <p className="text-sm text-fg-subtle">Last updated: {UPDATED}</p>

          <Block title="About these terms">
            <p>
              These terms govern your use of namicreative.co.uk (the
              &ldquo;site&rdquo;) operated by NAMI Creative
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you
              agree to them. If you don&rsquo;t, please don&rsquo;t use the
              site.
            </p>
          </Block>

          <Block title="What this site is">
            <p>
              The site provides information about our services, case studies,
              and a way to contact us. Nothing on the site is a binding offer
              of services. Engagements are sized, agreed, and contracted
              separately in writing.
            </p>
          </Block>

          <Block title="Content + IP">
            <p>
              All content on the site, including the NAMI name, brand,
              writing, design, code, and visuals, is owned by NAMI Creative
              or its licensors. You may not reproduce, redistribute, or use
              it commercially without written permission.
            </p>
            <p>
              Case studies showcase past client work with permission. Client
              brands and trademarks remain the property of their respective
              owners.
            </p>
          </Block>

          <Block title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Attempt to break, probe, or interfere with the site, its
                services, or other visitors.
              </li>
              <li>
                Submit malicious content, spam, or false information through
                forms or any other mechanism.
              </li>
              <li>
                Scrape or systematically harvest content from the site without
                written permission.
              </li>
              <li>
                Misrepresent your identity or affiliation when contacting us.
              </li>
            </ul>
          </Block>

          <Block title="External links">
            <p>
              The site links to third-party websites (e.g. our clients&rsquo;
              live sites, Calendly, social profiles). We don&rsquo;t control
              and aren&rsquo;t responsible for their content or practices.
            </p>
          </Block>

          <Block title="Liability">
            <p>
              The site is provided &ldquo;as is&rdquo;. We do our best to keep
              it accurate and online but make no warranties about availability,
              completeness, or fitness for any particular purpose. To the
              fullest extent permitted by UK law, we&rsquo;re not liable for
              any indirect or consequential loss arising from your use of the
              site.
            </p>
            <p>
              Nothing in these terms limits liability that cannot be excluded
              under UK law (including death or personal injury caused by
              negligence, or fraud).
            </p>
          </Block>

          <Block title="Changes">
            <p>
              We may update these terms from time to time. The &ldquo;last
              updated&rdquo; date at the top of the page reflects the most
              recent version.
            </p>
          </Block>

          <Block title="Governing law">
            <p>
              These terms are governed by the laws of England and Wales.
              Disputes are subject to the exclusive jurisdiction of the
              English courts.
            </p>
          </Block>

          <p className="border-t border-line pt-8 text-sm text-fg-subtle">
            See also our{" "}
            <Link
              href="/privacy"
              className="text-fg hover:text-accent transition-colors"
            >
              privacy notice
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="text-fg hover:text-accent transition-colors"
            >
              get in touch
            </Link>
            .
          </p>
        </article>
      </section>
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
