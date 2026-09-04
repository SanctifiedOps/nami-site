"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "error";

const SUBMISSION_ID_KEY = "nami_network_submission_id";
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const OUTPUT_SIZE = 800;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function prepareImage(file: File, memberId: string) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const side = Math.min(bitmap.width, bitmap.height);
  const sourceX = Math.max(0, (bitmap.width - side) / 2);
  const sourceY = Math.max(0, (bitmap.height - side) / 2);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not prepare your picture.");
  context.drawImage(bitmap, sourceX, sourceY, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86),
  );
  if (!blob) throw new Error("This browser could not prepare your picture.");
  return new File([blob], memberId, { type: "image/webp" });
}

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
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const hasTrackedRequiredFields = useRef(false);
  const hasTrackedOtherCategory = useRef(false);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  const chooseProfilePicture = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.currentTarget.files?.[0] ?? null;
    setErrorMsg(null);
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      setStatus("error");
      setErrorMsg("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (nextFile.size > MAX_SOURCE_BYTES) {
      setStatus("error");
      setErrorMsg("Choose an image smaller than 10 MB.");
      return;
    }
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePicture(nextFile);
    setProfilePreview(URL.createObjectURL(nextFile));
    setStatus("idle");
  };

  const clearProfilePicture = () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePicture(null);
    setProfilePreview(undefined);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };


  const onFormFocus = () => {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent("network_form_started", {
      form_name: "creative_network_join",
      page_path: "/network",
      source_context: "nami_creative_network",
    });
  };

  const getSubmissionId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  const onCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const category = event.currentTarget.value;
    setSelectedCategory(category);

    if (!category) return;

    trackEvent("category_selected", {
      form_name: "creative_network_join",
      category,
      category_is_custom: category === "Other",
      source_context: "nami_creative_network",
    });

    if (category === "Other" && !hasTrackedOtherCategory.current) {
      hasTrackedOtherCategory.current = true;
      trackEvent("other_category_used", {
        form_name: "creative_network_join",
        source_context: "nami_creative_network",
      });
    }
  };

  const onFormChange = (event: FormEvent<HTMLFormElement>) => {
    if (hasTrackedRequiredFields.current) return;

    const fd = new FormData(event.currentTarget);
    const category = String(fd.get("category") ?? "");
    const hasRequiredFields = Boolean(
      String(fd.get("name") ?? "").trim() &&
        String(fd.get("email") ?? "").trim() &&
        String(fd.get("instagram") ?? "").trim() &&
        category &&
        (category !== "Other" || String(fd.get("otherCategory") ?? "").trim()) &&
        String(fd.get("location") ?? "").trim() &&
        fd.get("directoryConsent") === "yes" &&
        Boolean(profilePicture),
    );

    if (!hasRequiredFields) return;

    hasTrackedRequiredFields.current = true;
    trackEvent("network_form_required_fields_completed", {
      form_name: "creative_network_join",
      category: category === "Other" ? "custom" : category,
      category_is_custom: category === "Other",
      source_context: "nami_creative_network",
    });
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setStatus("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const category = String(fd.get("category") ?? "");
    const otherCategory = String(fd.get("otherCategory") ?? "").trim();
    const submissionId = getSubmissionId();
    const submittedName = String(fd.get("name") ?? "");
    const memberId = `${slugify(submittedName) || "network-member"}-${submissionId.slice(0, 8)}`;
    const payload = {
      memberId,
      name: submittedName,
      email: String(fd.get("email") ?? ""),
      instagram: String(fd.get("instagram") ?? ""),
      category: category === "Other" ? otherCategory : category,
      location: String(fd.get("location") ?? ""),
      note: String(fd.get("note") ?? ""),
      link: String(fd.get("link") ?? ""),
      directoryConsent: fd.get("directoryConsent") === "yes",
      website: String(fd.get("website") ?? ""),
    };

    if (!profilePicture) {
      isSubmittingRef.current = false;
      setStatus("error");
      setErrorMsg("Please add a profile picture for your directory card.");
      return;
    }

    if (category === "Other" && !otherCategory) {
      isSubmittingRef.current = false;
      setStatus("error");
      setErrorMsg("Please type your category.");
      trackEvent("network_form_error", {
        form_name: "creative_network_join",
        category: "other_empty",
        error_type: "missing_other_category",
        source_context: "nami_creative_network",
        submission_id: submissionId,
      });
      return;
    }

    if (!payload.directoryConsent) {
      isSubmittingRef.current = false;
      setStatus("error");
      setErrorMsg("Please confirm that we can include you in the public directory.");
      trackEvent("network_form_error", {
        form_name: "creative_network_join",
        error_type: "missing_directory_consent",
        source_context: "nami_creative_network",
        submission_id: submissionId,
      });
      return;
    }

    trackEvent("network_form_submit_attempted", {
      form_name: "creative_network_join",
      category: payload.category || "unknown",
      link_provided: Boolean(payload.link),
      note_provided: Boolean(payload.note),
      source_context: "nami_creative_network",
      submission_id: submissionId,
    });

    try {
      const detailsController = new AbortController();
      const detailsTimeout = setTimeout(() => detailsController.abort(), 25000);
      try {
        const res = await fetch("/api/network", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: detailsController.signal,
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? "We couldn't send this right now.");
        }
      } finally {
        clearTimeout(detailsTimeout);
      }

      // The member workflow writes the directory rows before the separate
      // image workflow looks them up. A short pause avoids Google Sheets
      // propagation delays without holding either request timeout open.
      await new Promise((resolve) => window.setTimeout(resolve, 2000));

      const imageController = new AbortController();
      const imageTimeout = setTimeout(() => imageController.abort(), 30000);
      try {
        const preparedImage = await prepareImage(profilePicture, memberId);
        const imageBody = new FormData();
        imageBody.set("memberId", memberId);
        imageBody.set("memberName", payload.name);
        imageBody.set("lookupName", payload.name);
        imageBody.set("instagram", payload.instagram);
        imageBody.set("altText", `${payload.name} profile picture`);
        imageBody.set("newMember", "true");
        imageBody.set("image", preparedImage);

        const imageResponse = await fetch("/api/network/profile-picture", {
          method: "POST",
          body: imageBody,
          signal: imageController.signal,
        });
        const imageResult = (await imageResponse.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!imageResponse.ok) {
          throw new Error(
            imageResult.error ??
              "Your details landed, but your picture did not. Please try the picture again.",
          );
        }

        trackEvent("network_form_submitted", {
          form_name: "creative_network_join",
          category: payload.category || "unknown",
          link_provided: Boolean(payload.link),
          note_provided: Boolean(payload.note),
          source_context: "nami_creative_network",
          submission_id: submissionId,
        });
        sessionStorage.setItem(SUBMISSION_ID_KEY, submissionId);
        form.reset();
        clearProfilePicture();
        setSelectedCategory("");
        router.push("/network/thank-you");
      } finally {
        clearTimeout(imageTimeout);
      }
    } catch (err) {
      setStatus("error");
      trackEvent("network_form_error", {
        form_name: "creative_network_join",
        category: payload.category || "unknown",
        error_type:
          err instanceof DOMException && err.name === "AbortError"
            ? "timeout"
            : "submission_error",
        source_context: "nami_creative_network",
        submission_id: submissionId,
      });
      setErrorMsg(
        err instanceof DOMException && err.name === "AbortError"
          ? "That took too long to send. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong.",
      );
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      onFocusCapture={onFormFocus}
      onChange={onFormChange}
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
        <Select
          label="Category"
          name="category"
          required
          value={selectedCategory}
          onChange={onCategoryChange}
        >
          <option value="">Choose one</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      {selectedCategory === "Other" && (
        <div className="mt-5">
          <Field
            label="Type your category"
            name="otherCategory"
            placeholder="Ceramicist, poet, filmmaker, venue..."
            maxLength={80}
            required
          />
        </div>
      )}

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
          label="Tell us about your work"
          name="note"
          placeholder="Tell us what you make or do, who it is for, and what you would like people to know. We will use this to write the short bio on your directory card."
          rows={6}
          maxLength={1600}
          required
        />
        <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
          Write naturally. NAMI will tidy this into a short third-person bio that keeps your meaning and sounds consistent across the directory.
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-fg-subtle">
          Profile picture <span className="text-accent">*</span>
        </p>
        <input
          ref={imageInputRef}
          type="file"
          name="profilePicture"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={chooseProfilePicture}
          className="sr-only"
        />
        {profilePreview ? (
          <div className="flex items-center gap-5 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profilePreview}
              alt="Selected profile preview"
              className="size-24 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{profilePicture?.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-fg-subtle">
                We will centre-crop this into a square image for your directory card.
              </p>
              <button
                type="button"
                onClick={clearProfilePicture}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-soft"
              >
                <X size={14} aria-hidden /> Choose another
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex w-full flex-col items-center rounded-2xl border border-dashed border-line bg-surface-1/45 px-6 py-10 text-center transition-colors hover:border-accent/55 hover:bg-accent/5"
          >
            <ImagePlus size={28} aria-hidden className="text-accent" />
            <span className="mt-3 font-semibold text-fg">Add your profile picture</span>
            <span className="mt-2 text-sm text-fg-subtle">JPG, PNG or WebP. Up to 10 MB.</span>
          </button>
        )}
      </div>

      <div className="mt-7 space-y-4">
        <label className="flex items-start gap-3 rounded-xl border border-line bg-surface-1/45 p-4 text-sm leading-relaxed text-fg-muted">
          <input
            type="checkbox"
            name="directoryConsent"
            value="yes"
            required
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
          />
          <span>
            I agree to NAMI publishing my name, category, city or area,
            Instagram, submitted link, and a short NAMI-written description in
            the public Creative Network directory. I can ask for my listing to
            be updated or removed at any time.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)] disabled:opacity-60",
          )}
        >
          {status === "submitting" ? "Sending..." : "Join the Creative Network"}
          <ArrowUpRight
            size={16}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

        <p className="max-w-xl text-xs leading-relaxed text-fg-subtle">
          No cost. No spam. By joining, you also consent to NAMI holding these
          details so I can review your work, keep you in mind for relevant
          opportunities, send Creative Network updates, and reply when useful.
          See the{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 transition-colors hover:text-fg-muted"
          >
            privacy notice
          </a>
          .
        </p>

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
  value,
  onChange,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
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
        value={value}
        onChange={onChange}
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
