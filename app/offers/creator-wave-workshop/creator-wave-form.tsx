"use client";

import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const packageOptions = [
  { value: "free-check-in", label: "Free Creator Check-in" },
  { value: "99-report", label: "\u00a399 Funnel Report" },
  { value: "499-build", label: "\u00a3499 Website/Funnel Build" },
  { value: "not-sure", label: "Not sure yet" },
];

const painOptions = [
  "Not finding commissions",
  "Attention but no conversion",
  "I have not got the time",
  "Need a clear path for buyers",
  "My website or shop feels messy",
];

const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  instagram: "Instagram",
  packageInterest: "Package interest",
  link: "Useful link",
  painPoint: "Main pain",
  message: "Message",
};

function getSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CreatorWaveForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [packageInterest, setPackageInterest] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const started = useRef(false);
  const viewed = useRef(false);
  const completedFields = useRef<Set<string>>(new Set());
  const focusedFields = useRef<Set<string>>(new Set());

  useEffect(() => {
    const node = formRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || viewed.current) return;
        viewed.current = true;
        trackEvent("creator_wave_form_viewed", {
          form_name: "creator_wave_workshop",
          offer: "creator_wave_workshop",
          page_path: "/offers/creator-wave-workshop",
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const trackStart = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("creator_wave_form_started", {
      form_name: "creator_wave_workshop",
      offer: "creator_wave_workshop",
    });
  };

  const onFocusCapture = (event: FocusEvent<HTMLFormElement>) => {
    trackStart();
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!target.name || focusedFields.current.has(target.name)) return;
    focusedFields.current.add(target.name);
    trackEvent("creator_wave_field_focused", {
      form_name: "creator_wave_workshop",
      field_name: target.name,
      field_label: fieldLabels[target.name] ?? target.name,
    });
  };

  const trackFieldComplete = (name: string, value: string) => {
    if (!name || completedFields.current.has(name) || !value.trim()) return;
    completedFields.current.add(name);
    trackEvent("creator_wave_field_completed", {
      form_name: "creator_wave_workshop",
      field_name: name,
      field_label: fieldLabels[name] ?? name,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const fd = new FormData(form);
    const submissionId = getSubmissionId();
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      instagram: String(fd.get("instagram") ?? ""),
      packageInterest: String(fd.get("packageInterest") ?? ""),
      link: String(fd.get("link") ?? ""),
      painPoint: String(fd.get("painPoint") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const missing = [
      ["name", payload.name],
      ["email", payload.email],
      ["packageInterest", payload.packageInterest],
    ].find(([, value]) => !String(value).trim());

    trackEvent("creator_wave_form_submit_attempted", {
      form_name: "creator_wave_workshop",
      package_interest: payload.packageInterest || "unknown",
      pain_point: payload.painPoint || "unknown",
      link_provided: Boolean(payload.link),
      instagram_provided: Boolean(payload.instagram),
      message_provided: Boolean(payload.message),
      submission_id: submissionId,
    });

    if (missing) {
      const fieldName = String(missing[0]);
      setStatus("error");
      setErrorMsg("Please fill in the required bits so I know where to start.");
      trackEvent("creator_wave_form_validation_error", {
        form_name: "creator_wave_workshop",
        field_name: fieldName,
        field_label: fieldLabels[fieldName] ?? fieldName,
        submission_id: submissionId,
      });
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch("/api/creator-wave-workshop", {
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
          throw new Error(data.error ?? "That did not send.");
        }

        trackEvent("creator_wave_form_submitted", {
          form_name: "creator_wave_workshop",
          package_interest: payload.packageInterest,
          pain_point: payload.painPoint || "unknown",
          link_provided: Boolean(payload.link),
          instagram_provided: Boolean(payload.instagram),
          message_provided: Boolean(payload.message),
          value:
            payload.packageInterest === "free-check-in"
              ? 0
              : payload.packageInterest === "99-report"
                ? 99
                : payload.packageInterest === "499-build"
                  ? 499
                  : 0,
          currency: "GBP",
          submission_id: submissionId,
        });

        router.push("/offers/creator-wave-workshop/thank-you");
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      const errorType =
        err instanceof DOMException && err.name === "AbortError"
          ? "timeout"
          : "submission_error";

      trackEvent("creator_wave_form_error", {
        form_name: "creator_wave_workshop",
        package_interest: payload.packageInterest || "unknown",
        pain_point: payload.painPoint || "unknown",
        error_type: errorType,
        submission_id: submissionId,
      });

      setStatus("error");
      setErrorMsg(
        errorType === "timeout"
          ? "That took too long to send. Give it another go, or email me direct."
          : err instanceof Error
            ? err.message
            : "Something went wrong.",
      );
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocusCapture={onFocusCapture}
      className="glass-refractive rounded-3xl p-6 md:p-8"
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
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mb-7">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          Tell me what needs sorting
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted md:text-base">
          Keep it rough if you need to. Send the links, pick the option that
          feels closest, and I will come back with the sensible next step.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          autoComplete="name"
          onComplete={trackFieldComplete}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          onComplete={trackFieldComplete}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field
          label="Instagram"
          name="instagram"
          placeholder="@yourhandle"
          onComplete={trackFieldComplete}
        />
        <Field
          label="Website, shop, or portfolio link"
          name="link"
          type="url"
          placeholder="https://"
          onComplete={trackFieldComplete}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Select
          label="What do you want help with?"
          name="packageInterest"
          required
          value={packageInterest}
          onChange={(value) => {
            setPackageInterest(value);
            trackFieldComplete("packageInterest", value);
            trackEvent("creator_wave_package_selected", {
              form_name: "creator_wave_workshop",
              package_interest: value,
            });
          }}
        >
          <option value="">Choose one</option>
          {packageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          label="Main thing in the way"
          name="painPoint"
          value={painPoint}
          onChange={(value) => {
            setPainPoint(value);
            trackFieldComplete("painPoint", value);
            trackEvent("creator_wave_pain_selected", {
              form_name: "creator_wave_workshop",
              pain_point: value,
            });
          }}
        >
          <option value="">Choose one if it fits</option>
          {painOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        <TextArea
          label="What should I know?"
          name="message"
          placeholder="What do you make, what are you trying to sell or book, and where does it feel stuck?"
          rows={5}
          onComplete={trackFieldComplete}
        />
      </div>

      <div className="mt-7 space-y-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="group relative inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Ask Joe to take a look"}
          <ArrowUpRight
            size={16}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

        <p className="max-w-xl text-xs leading-relaxed text-fg-subtle">
          By sending this, you consent to NAMI Creative holding these details so
          I can reply about Creator Wave Workshop. No spam. No adding you to
          something weird. See the{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 transition-colors hover:text-fg-muted"
          >
            privacy notice
          </a>
          .
        </p>

        {status === "success" && (
          <div
            role="status"
            className="flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-left text-sm leading-relaxed text-fg"
          >
            <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <p>
              Nice one. That landed with me. I will take a look and come back
              with the most sensible next step.
            </p>
          </div>
        )}

        {status === "error" && errorMsg && (
          <p role="alert" className="text-sm leading-relaxed text-accent">
            {errorMsg} If it keeps happening, email{" "}
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
  onComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  onComplete: (name: string, value: string) => void;
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
        maxLength={300}
        placeholder={placeholder}
        onBlur={(event) => onComplete(name, event.currentTarget.value)}
        className="w-full rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
    </label>
  );
}

function Select({
  label,
  name,
  required,
  value,
  onChange,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <select
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
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
  rows,
  onComplete,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  onComplete: (name: string, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-fg-subtle">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        maxLength={2000}
        placeholder={placeholder}
        onBlur={(event) => onComplete(name, event.currentTarget.value)}
        className="w-full resize-y rounded-xl border border-line bg-surface-1/60 px-5 py-4 text-fg placeholder:text-fg-subtle backdrop-blur-md transition-all focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-4 focus:ring-accent/15"
      />
    </label>
  );
}
