"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, Calendar } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { stage, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Phase 3 will wire this to /api/submit + Mailchimp/Resend/Notion.
  // For now: optimistic UI only.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about what you're building."
        lead="Tell us about your business, what's working, and what's stuck. We respond personally — usually within a working day."
      />

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
          {/* FORM */}
          <motion.form
            onSubmit={onSubmit}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-2">
              <Field
                label="First name"
                name="firstName"
                autoComplete="given-name"
                required
              />
              <Field
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                required
              />
            </motion.div>
            <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-2">
              <Field
                label="Work email"
                type="email"
                name="email"
                autoComplete="email"
                required
              />
              <Field
                label="Company"
                name="company"
                autoComplete="organization"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Select label="Project type" name="projectType">
                <option value="">Choose one</option>
                <option value="brand">Brand strategy + identity</option>
                <option value="content">Content systems</option>
                <option value="website">Website + funnel</option>
                <option value="visual">Visual direction</option>
                <option value="systems">Automation + growth</option>
                <option value="multiple">Multiple / not sure</option>
              </Select>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Select label="Budget range" name="budget">
                <option value="">Choose one</option>
                <option value="under-5k">Under £5k</option>
                <option value="5-15k">£5k — £15k</option>
                <option value="15-40k">£15k — £40k</option>
                <option value="40k+">£40k+</option>
                <option value="not-sure">Not sure yet</option>
              </Select>
            </motion.div>
            <motion.div variants={fadeUp}>
              <TextArea
                label="What are you working on?"
                name="message"
                placeholder="A few sentences about the business, what you've tried, and what would success look like in 6 months."
                rows={6}
                required
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={submitting || submitted}
                className={cn(
                  "group relative inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(230_50_175/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(230_50_175/0.5)] disabled:opacity-60",
                )}
              >
                {submitted
                  ? "Thanks — we'll be in touch"
                  : submitting
                    ? "Sending..."
                    : "Send the brief"}
                {!submitted && (
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </button>
              {submitted && (
                <p className="mt-4 text-sm text-fg-muted">
                  Form is in optimistic mode — Mailchimp + Resend wiring lands
                  in Phase 3 of the build plan.
                </p>
              )}
            </motion.div>
          </motion.form>

          {/* ASIDE */}
          <motion.aside
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="space-y-8"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md"
            >
              <Mail size={20} className="text-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-medium tracking-tight">
                Prefer email
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                Direct route — same response time, less form filling.
              </p>
              <a
                href="mailto:hello@namicreative.studio"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                hello@namicreative.studio
                <ArrowUpRight
                  size={12}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md"
            >
              <Calendar size={20} className="text-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-medium tracking-tight">
                Book a discovery call
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                30 minutes to walk through what you're building and whether we
                can help. No pitch deck.
              </p>
              <a
                href="https://cal.com/namicreative/discovery"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                Open calendar
                <ArrowUpRight
                  size={12}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs leading-relaxed text-fg-subtle"
            >
              We typically respond within one working day. If a project doesn't
              feel like the right fit on either side, we'll say so honestly —
              and where useful, we'll point you to studios that might fit
              better.
            </motion.p>
          </motion.aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
    </label>
  );
}

function Select({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label}
      </span>
      <select
        name={name}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  rows = 5,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15 resize-none"
      />
    </label>
  );
}
