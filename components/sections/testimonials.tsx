import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  testimonials as defaultTestimonials,
  type Testimonial,
} from "@/lib/content/testimonials";
import { cn } from "@/lib/utils";

type Props = {
  items?: Testimonial[];
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: string;
  className?: string;
  backgroundImage?: string;
  uniform?: boolean;
};

export function Testimonials({
  items = defaultTestimonials,
  title = <>What people say about the work</>,
  lead = "A few words from people I have worked with.",
  className,
  backgroundImage = "/images/north-east/4.jpg",
}: Props) {
  const visibleItems = items.slice(0, 3);

  return (
    <section className={cn("border-y border-line bg-surface-0 py-20 md:py-28", className)}>
      <div className="container-shell">
        <div className="grid overflow-hidden rounded-sm border border-line lg:grid-cols-12">
          <div className="relative min-h-[24rem] lg:col-span-5 lg:min-h-[42rem]">
            {backgroundImage ? (
              <Image
                src={backgroundImage}
                alt="The Sage and NewcastleGateshead Quayside"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover grayscale"
              />
            ) : null}
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black via-black/15 to-black/10" />
            <header className="absolute inset-x-0 bottom-0 p-7 md:p-10">
              <h2 className="type-section-title max-w-md text-white">{title}</h2>
              {lead ? <p className="mt-5 max-w-sm text-base leading-[1.5] text-white/72">{lead}</p> : null}
            </header>
          </div>

          <ul className="divide-y divide-line bg-surface-1 lg:col-span-7">
            {visibleItems.map((testimonial) => (
              <li key={testimonial.author} className="p-7 md:p-10">
                <figure className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
                  <blockquote className="max-w-2xl text-lg leading-[1.5] text-fg md:text-xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="md:min-w-48 md:text-right">
                    <p className="font-semibold text-fg">{testimonial.author}</p>
                    <p className="mt-1 text-sm leading-snug text-fg-subtle">{testimonial.role}</p>
                    {testimonial.href ? (
                      <a
                        href={testimonial.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
                        aria-label={`Read ${testimonial.author}'s review on Google`}
                      >
                        Read review <ArrowUpRight size={14} aria-hidden />
                      </a>
                    ) : null}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
