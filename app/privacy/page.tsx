import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How NAMI Creative collects, uses, and protects your information. Plain English, GDPR-aligned.",
  robots: { index: true, follow: true },
};

const UPDATED = "6 May 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Privacy <span className="text-gradient">notice.</span>
          </>
        }
        lead="Plain-English explanation of what we collect, why, and how to control it. GDPR-aligned and UK-resident."
      />

      <section className="container-shell py-20 md:py-28">
        <article className="prose-legal mx-auto max-w-3xl space-y-10 text-fg-muted leading-relaxed">
          <p className="text-sm text-fg-subtle">Last updated: {UPDATED}</p>

          <Block title="Who we are">
            <p>
              NAMI Creative (&ldquo;NAMI&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;) is a UK-based creative studio operating from
              England. For the purposes of UK GDPR and the Data Protection Act
              2018, we are the data controller for personal data you share
              with us through this site.
            </p>
            <p>
              Contact us at{" "}
              <a
                href="mailto:hello@namicreative.co.uk"
                className="text-fg hover:text-accent transition-colors"
              >
                hello@namicreative.co.uk
              </a>
              .
            </p>
          </Block>

          <Block title="What we collect">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Project enquiries.</strong> When you
                use our contact form: name, email, company, project type,
                budget range, and the message you send. Lawful basis: legitimate
                interest in responding to enquiries about our services.
              </li>
              <li>
                <strong className="text-fg">Newsletter subscribers.</strong>{" "}
                Email address only. Lawful basis: your explicit consent at
                signup, confirmed via double opt-in.
              </li>
              <li>
                <strong className="text-fg">Site analytics.</strong> We use
                Google Analytics 4 to understand how the site is used (page
                views, traffic sources, device class, country). Google
                truncates and anonymises IP addresses on collection. We don&rsquo;t
                run Google Signals, ad personalisation, or any advertising
                cookies. Lawful basis: legitimate interest in improving the
                site.
              </li>
              <li>
                <strong className="text-fg">Server logs.</strong> Standard
                request logs (IP, user-agent, timestamp) retained for security
                and abuse-prevention purposes.
              </li>
            </ul>
          </Block>

          <Block title="How we use it">
            <ul className="list-disc space-y-2 pl-5">
              <li>To respond to enquiries and plan work with you.</li>
              <li>
                To send newsletter emails you have explicitly subscribed to,
                until you unsubscribe.
              </li>
              <li>
                To run and improve the website (performance, accessibility,
                catching bugs).
              </li>
              <li>
                We do <strong className="text-fg">not</strong> sell, rent, or
                trade your information. We do not use it for advertising
                profiling.
              </li>
            </ul>
          </Block>

          <Block title="Who processes it on our behalf">
            <p>
              We use a small set of trusted vendors as data processors:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Mailchimp</strong> (Intuit Inc.,
                USA, under UK-EU SCCs): newsletter delivery and contact form
                intake.
              </li>
              <li>
                <strong className="text-fg">Make.com</strong> (Celonis SE, EU):
                workflow automation between site, Mailchimp, and our internal
                tools.
              </li>
              <li>
                <strong className="text-fg">Calendly</strong> (Calendly LLC,
                USA, under UK-EU SCCs): discovery call scheduling, only if you
                choose to book one.
              </li>
              <li>
                <strong className="text-fg">Google Analytics</strong> (Google
                LLC, USA, under UK-EU SCCs): aggregated site usage analytics.
              </li>
              <li>
                <strong className="text-fg">Hosting provider</strong>: serves
                this website and processes the request logs noted above.
              </li>
            </ul>
            <p>
              Data is encrypted in transit (HTTPS) and at rest with these
              providers.
            </p>
          </Block>

          <Block title="How long we keep it">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Enquiries:</strong> 24 months from
                last contact, then deleted unless you become a client.
              </li>
              <li>
                <strong className="text-fg">Newsletter:</strong> until you
                unsubscribe (one click, link in every email).
              </li>
              <li>
                <strong className="text-fg">Server logs:</strong> 30 days.
              </li>
            </ul>
          </Block>

          <Block title="Your rights">
            <p>Under UK GDPR you can ask us to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data, or complete incomplete data.</li>
              <li>Delete your data (the &ldquo;right to be forgotten&rdquo;).</li>
              <li>Restrict or object to certain processing.</li>
              <li>Receive a portable copy of data you provided.</li>
              <li>Withdraw consent at any time, where consent is the basis.</li>
            </ul>
            <p>
              Email{" "}
              <a
                href="mailto:hello@namicreative.co.uk"
                className="text-fg hover:text-accent transition-colors"
              >
                hello@namicreative.co.uk
              </a>{" "}
              and we will respond within one calendar month. If we get it
              wrong, you can complain to the UK Information Commissioner&rsquo;s
              Office at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-colors"
              >
                ico.org.uk
              </a>
              .
            </p>
          </Block>

          <Block title="Cookies">
            <p>
              We use a small number of cookies:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Strictly necessary:</strong>{" "}
                preserving form state and basic session functionality.
              </li>
              <li>
                <strong className="text-fg">Analytics:</strong> Google
                Analytics sets `_ga` and `_ga_*` cookies to recognise return
                visitors and aggregate session data. No advertising cookies
                are set by us.
              </li>
            </ul>
            <p>
              You can clear analytics cookies in your browser settings or
              install a browser-level opt-out (e.g. Google&rsquo;s{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-colors"
              >
                GA opt-out add-on
              </a>
              ) at any time.
            </p>
          </Block>

          <Block title="Changes to this notice">
            <p>
              When we change this notice we update the &ldquo;last
              updated&rdquo; date at the top. Material changes will be
              announced on the homepage.
            </p>
          </Block>

          <p className="border-t border-line pt-8 text-sm text-fg-subtle">
            Questions? Read the{" "}
            <Link
              href="/terms"
              className="text-fg hover:text-accent transition-colors"
            >
              terms
            </Link>{" "}
            or just{" "}
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
