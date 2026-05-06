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
};

export function NewsletterSubscribe({
  eyebrow = "Stay close",
  title = (
    <>
      Notes from the studio,{" "}
      <span className="text-gradient">straight to inbox.</span>
    </>
  ),
  lead = "Occasional writing on brand systems, content engines, and the work behind the work. No fluff, no filler.",
  className,
  variant = "section",
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
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  const wrapperClass =
    variant === "card"
      ? "rounded-3xl border border-line bg-surface-1/40 p-10 md:p-16"
      : "container-shell py-24 md:py-32 border-t border-line";

  return (
    <section className={cn(wrapperClass, className)}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stage}
        className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16"
      >
        <motion.div variants={fadeUp} className="max-w-xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.015em] pr-2">
            {title}
          </h2>
          <p className="mt-5 text-fg-muted md:text-lg leading-relaxed">
            {lead}
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={onSubmit}
          className="space-y-3"
          aria-live="polite"
        >
          <label className="block">
            <span className="sr-only">Email address</span>
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
                  "group absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(230_50_175/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_32px_rgb(230_50_175/0.4)] disabled:opacity-60",
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
