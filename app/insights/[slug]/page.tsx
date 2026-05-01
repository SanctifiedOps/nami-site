import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";

export default async function InsightPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <PageHero
        eyebrow="Insights — coming soon"
        title={title}
        lead="The cornerstone insights archive ships in the next phase of the build (Phase 4 of the launch plan). For now this is a placeholder so the route exists."
      />
      <section className="container-shell py-20 md:py-28">
        <div className="max-w-2xl space-y-6">
          <p className="text-fg-muted leading-relaxed md:text-lg">
            Long-form essays will live here once the MDX content pipeline is
            wired. Three cornerstone articles are drafted: brand momentum,
            clarity-first positioning, and design systems for compound brands.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-white/5 hover:border-accent"
            >
              <ArrowLeft
                size={14}
                aria-hidden
                className="transition-transform duration-500 group-hover:-translate-x-1"
              />
              All insights
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              Get notified at launch
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
