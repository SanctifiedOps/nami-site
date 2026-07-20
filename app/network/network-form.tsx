"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "error";

const categories = [
  "Creative",
  "Artist",
  "Musician",
  "Photographer",
  "Designer",
  "Local business",
  "Brand",
  "Other",
];

export function NetworkForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      instagram: String(fd.get("instagram") ?? ""),
      category: String(fd.get("category") ?? ""),
      location: String(fd.get("location") ?? ""),
      note: String(fd.get("note") ?? ""),
      link: String(fd.get("link") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch("/api/network", {
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
          throw new Error(data.error ?? "We couldn't send this right now.");
        }
        form.reset();
        router.push("/network/thank-you");
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
    <form
      onSubmit={onSubmit}
      className="glass-refractive rounded-2xl p-6 md:p-8"
      noValidate
    >
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

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          maxLength={120}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={180}
          required
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
        <Field
          label="Instagram handle"
          name="instagram"
          placeholder="@namicreativeuk"
          maxLength={120}
          required
        />
        <Select label="Category" name="category" required>
          <option value="">Choose one</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
        <Field
          label="Location in the North East"
          name="location"
          placeholder="Newcastle, Sunderland, Durham..."
          maxLength={140}
          required
        />
        <Field
          label="Project / website / portfolio link"
          name="link"
          type="url"
          placeholder="https://"
          maxLength={300}
        />
      </div>

      <div className="mt-5">
        <TextArea
          label="What are you putting forward? (optional)"
          name="note"
          placeholder="Tell me who you are, what you are making, who it is for, and what people should know about the work."
          rows={6}
          maxLength={1600}
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
        By joining, you consent to NAMI holding these details so I can review
        the submission, keep you in mind for relevant opportunities, send
        Creative Network updates, and reply if it feels useful. See the{" "}
        <a
          href="/privacy"
          className="underline underline-offset-4 transition-colors hover:text-fg-muted"
        >
          privacy notice
        </a>
        .
      </p>

      <div className="mt-7 space-y-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)] disabled:opacity-60",
          )}
        >
          {status === "submitting" ? "Sending..." : "Join the network"}
          <ArrowUpRight
            size={16}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>


        {status === "error" && errorMsg && (
          <p role="alert" className="text-sm leading-relaxed text-accent">
            {errorMsg} If it persists, email{" "}
            <a
              href="mailto:hello@namicreative.co.uk"
              className="underline underline-offset-4 transition-colors hover:text-fg"
            >
              hello@namicreative.co.uk
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
    </label>
  );
}

function Select({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
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
  required,
  rows,
  maxLength,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
    </label>
  );
}
