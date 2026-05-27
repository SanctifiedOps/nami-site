import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PostCard } from "@/components/insights/post-card";
import type { InsightPost } from "@/lib/content/insights-utils";

type Props = {
  posts: InsightPost[];
};

export function RecentInsights({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="container-shell border-t border-line py-24 md:py-32">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-xl text-3xl font-semibold leading-[1.15] tracking-tight md:text-4xl">
          Notes on where this{" "}
          <span className="text-gradient">industry is heading.</span>
        </h2>
        <Link
          href="/insights"
          className="link-underline group inline-flex w-fit items-center gap-2 pb-1 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
        >
          Read every Creative Waves piece
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
