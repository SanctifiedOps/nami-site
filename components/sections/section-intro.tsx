import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  eyebrow?: string;
};

export function SectionIntro({
  title,
  lead,
  align = "left",
  className,
  eyebrow,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="type-section-title">{title}</h2>
      {lead ? (
        <p className="mt-6 text-lg leading-[1.5] text-fg-muted md:text-xl">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
