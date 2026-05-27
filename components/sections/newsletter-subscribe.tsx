"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { fadeUp, stage } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: string;
  className?: string;
  variant?: "section" | "card";
  /** Single-column layout for narrow containers (e.g. sidebar) */
  compact?: boolean;
  /** Stack copy on top of the form, centered. Keeps the full-size styling. */
  stacked?: boolean;
};

export function NewsletterSubscribe({
  eyebrow = "Stay close",
  title = (
    <>
      Notes from the studio,{" "}
      <span className="text-gradient">straight to inbox.</span>
    </>
  ),
  lead = "Occasional writing on brand systems, content engines, and the work behind the work. Built to be read, kept, and used.",
  className,
  variant = "section",
  compact = false,
  stacked = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          message?: string;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? "Something went wrong.");
        }
        setStatus("success");
        setMessage(data.message ?? "Check your inbox to confirm.");
        setEmail("");
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof DOMException && err.name === "AbortError"
          ? "That took too long. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong.",
      );
    }
  }

  const wrapperClass =
    variant === "card"
      ? "glass-refractive rounded-3xl p-10 md:p-16"
      : "container-shell py-24 md:py-32 border-t border-line";

  const layoutClass = compact
    ? "space-y-6"
    : stacked
      ? "flex flex-col items-center gap-8 text-center md:gap-10"
      : "grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16";

  return (
    <section className={cn(wrapperClass, className)}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stage}
        className={layoutClass}
      >
        <motion.div
          variants={fadeUp}
          className={compact ? "" : stacked ? "max-w-2xl" : "max-w-xl"}
        >
          <p className={cn("eyebrow", compact ? "mb-3" : "mb-4")}>{eyebrow}</p>
          <h2
            className={cn(
              "font-medium tracking-[-0.015em]",
              compact
                ? "text-2xl leading-[1.15]"
                : "text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] pr-2",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "text-fg-muted leading-relaxed",
              compact ? "mt-3 text-sm" : "mt-5 md:text-lg",
            )}
          >
            {lead}
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={onSubmit}
          className={cn("space-y-3", stacked && "w-full max-w-xl")}
          aria-live="polite"
        >
          <label className="block">
            <span className="sr-only">Email address</span>
            {compact ? (
              <>
                <div className="relative">
                  <Mail
                    size={14}
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
                  />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={
                      status === "submitting" || status === "success"
                    }
                    className="w-full rounded-full border border-line bg-surface-1/60 py-3 pl-10 pr-4 text-sm text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15 disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  className={cn(
                    "group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(255_0_188/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_32px_rgb(255_0_188/0.4)] disabled:opacity-60",
                  )}
                >
                  {status === "success" ? (
                    <>
                      <Check size={14} aria-hidden />
                      Subscribed
                    </>
                  ) : status === "submitting" ? (
                    "Sending..."
                  ) : (
                    <>
                      Subscribe
                      <ArrowUpRight
                        size={14}
                        aria-hidden
                        className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="relative">
                <Mail
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-fg-subtle"
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  disabled={status === "submitting" || status === "success"}
                  className="w-full rounded-full border border-line bg-surface-1/60 py-4 pl-12 pr-44 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  className={cn(
                    "group absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(255_0_188/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_32px_rgb(255_0_188/0.4)] disabled:opacity-60",
                  )}
                >
                  {status === "success" ? (
                    <>
                      <Check size={14} aria-hidden />
                      Subscribed
                    </>
                  ) : status === "submitting" ? (
                    "Sending..."
                  ) : (
                    <>
                      Subscribe
                      <ArrowUpRight
                        size={14}
                        aria-hidden
                        className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>
              </div>
            )}
          </label>
          {message && (
            <p
              className={cn(
                "text-sm",
                status === "success"
                  ? "text-fg-muted"
                  : status === "error"
                    ? "text-accent"
                    : "text-fg-subtle",
              )}
            >
              {message}
            </p>
          )}
          {!message && (
            <p className="text-xs text-fg-subtle">
              No spam. Unsubscribe anytime.
            </p>
          )}
        </motion.form>
      </motion.div>
    </section>
  );
}
