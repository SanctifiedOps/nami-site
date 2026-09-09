"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, Calendar, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/socials";
import { stage, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "error";

export default function ContactPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      projectType: String(fd.get("projectType") ?? ""),
      budget: "", // captured on the call, not the form
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
    };

    try {
      // Abort a stalled request so the form can never get stuck on "Sending...".
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? "We couldn't send your message.");
        }
        router.push("/thank-you");
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof DOMException && err.name === "AbortError"
          ? "That took too long to send. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong.",
      );
    }
  };

  return (
    <>
      <PageHero
        backgroundImage="/images/north-east/6.jpg"
        backgroundPosition="center 55%"
        eyebrow="Contact"
        title={
          <>
            Tell me what{" "}
            <span className="text-gradient sm:block">
              needs sorting
            </span>
          </>
        }
        lead="Branding, content, a website or less admin. Tell me what is getting in the way and I will reply within one working day."
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
            {/* Honeypot â€” kept off-screen rather than display:none so bots
                that skip hidden inputs still fill it. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "-9999px",
                top: "-9999px",
                width: 0,
                height: 0,
                overflow: "hidden",
              }}
            >
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2 md:gap-6">
              <Field
                label="First name"
                name="firstName"
                autoComplete="given-name"
                maxLength={80}
                required
              />
              <Field
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                maxLength={80}
                required
              />
            </motion.div>
            <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2 md:gap-6">
              <Field
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={160}
                required
              />
              <Field
                label="Business name (optional)"
                name="company"
                autoComplete="organization"
                maxLength={120}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Select label="What do you need help with?" name="projectType" required>
                <option value="">Choose the closest option</option>
                <option value="branding">Branding</option>
                <option value="content">Content</option>
                <option value="website">Website</option>
                <option value="automation">Automation</option>
                <option value="multiple">More than one or not sure</option>
                <option value="creative-network">Creative Network enquiry</option>
              </Select>
            </motion.div>
            <motion.div variants={fadeUp}>
              <TextArea
                label="What needs sorting?"
                name="message"
                placeholder="Tell me a little about the business, what is getting in the way and what you would like to change."
                rows={6}
                maxLength={2000}
                required
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-xs text-fg-subtle leading-relaxed"
            >
              You do not need a polished brief. A few useful details are enough.
            </motion.p>
            <motion.div variants={fadeUp} className="space-y-3">
              <button
                type="submit"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
                className={cn(
                  "group relative inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)] disabled:opacity-60",
                )}
              >
                {status === "submitting" ? "Sending..." : "Send your enquiry"}
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              {status === "error" && errorMsg && (
                <p
                  role="alert"
                  className="text-sm text-accent leading-relaxed"
                >
                  {errorMsg} If it persists, email{" "}
                  <a
                    href="mailto:hello@namicreative.co.uk"
                    className="underline underline-offset-4 hover:text-fg transition-colors"
                  >
                    hello@namicreative.co.uk
                  </a>
                  .
                </p>
              )}
              <p className="text-xs text-fg-subtle leading-relaxed">
                By sending this form, you agree that I can use these details to
                reply. Read the{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-fg-muted transition-colors"
                >
                  privacy notice
                </a>
                .
              </p>
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
              className="glass-refractive rounded-2xl p-6 md:p-8"
            >
              <Mail size={20} className="text-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-medium tracking-tight">
                Prefer email
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                If forms are not your thing, email me directly. I reply just as quickly.
              </p>
              <a
                href="mailto:hello@namicreative.co.uk"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                hello@namicreative.co.uk
                <ArrowUpRight
                  size={12}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="glass-refractive rounded-2xl p-6 md:p-8"
            >
              <Calendar size={20} className="text-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-medium tracking-tight">
                Book a 30-minute call
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                Choose a time and tell me what you need help with. If I am not
                the right fit, I will say so.
              </p>
              <a
                href="https://calendly.com/hello-nami"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                Choose a time
                <ArrowUpRight
                  size={12}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="glass-refractive rounded-2xl p-6 md:p-8"
            >
              <Users size={20} className="text-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-medium tracking-tight">
                Here for the Creative Network?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Put your work forward, join the network or find creative people
                across the North East.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                <a
                  href="/network"
                  className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent"
                >
                  Join the network <ArrowUpRight size={12} aria-hidden />
                </a>
                <a
                  href="/network/directory"
                  className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent"
                >
                  Browse the directory <ArrowUpRight size={12} aria-hidden />
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="border-t border-line pt-7">
              <h3 className="text-lg font-medium tracking-tight">Find NAMI online</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/company/98101073", icon: LinkedinIcon },
                  { label: "Instagram", href: "https://www.instagram.com/namicreativeuk/", icon: InstagramIcon },
                  { label: "YouTube", href: "https://www.youtube.com/@namiupcreative", icon: YoutubeIcon },
                  { label: "Facebook", href: "https://facebook.com/namicreativeuk", icon: FacebookIcon },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-fg-muted transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg"
                    >
                      <Icon size={15} aria-hidden />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs leading-relaxed text-fg-subtle"
            >
              I usually reply within one working day. If I cannot help, I will
              tell you and point you towards someone suitable when I can.
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
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
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
        maxLength={maxLength}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
    </label>
  );
}

function Select({
  label,
  name,
  children,
  required,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <select
        name={name}
        required={required}
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
  maxLength,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  maxLength?: number;
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
        maxLength={maxLength}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15 resize-none"
      />
    </label>
  );
}
