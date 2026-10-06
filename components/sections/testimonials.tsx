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
  eyebrow = "Client notes",
  title = <>What people say about the work</>,
  lead = "Honest words from founders, operators and people I have worked alongside.",
  className,
  backgroundImage,
}: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-line bg-surface-1 py-24 md:py-32",
        className,
      )}
    >
      {backgroundImage ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-10 grayscale"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : null}

      <div className="container-shell relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
          <header className="lg:col-span-4 lg:pr-16">
            {eyebrow ? (
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="type-section-title max-w-md">{title}</h2>
            {lead ? (
              <p className="mt-6 max-w-md text-lg leading-[1.5] text-fg-muted">
                {lead}
              </p>
            ) : null}
          </header>

          <ul className="grid border-t border-line md:grid-cols-2 lg:col-span-8">
            {items.map((testimonial, index) => (
              <li
                key={testimonial.author}
                className={cn(
                  "border-b border-line py-8 md:px-8",
                  index % 2 === 0 && "md:border-r",
                )}
              >
                <figure className="flex h-full flex-col">
                  <span className="text-xs font-semibold tabular-nums text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <blockquote className="mt-6 flex-1 text-lg leading-[1.45] text-fg">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-8 border-t border-line pt-5">
                    <p className="font-medium text-fg">{testimonial.author}</p>
                    <p className="mt-1 text-sm text-fg-subtle">
                      {testimonial.role}
                    </p>
                    {testimonial.href ? (
                      <a
                        href={testimonial.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent"
                        aria-label={`Read ${testimonial.author}'s review on Google`}
                      >
                        Read on Google
                        <ArrowUpRight
                          size={13}
                          aria-hidden
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
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
