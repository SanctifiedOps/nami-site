"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ExternalLink, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { networkAuthClient } from "@/lib/network-auth/client";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { cropImageForUpload } from "@/lib/network/prepare-dashboard-image";

type Profile = {
  memberId: string;
  displayName: string;
  location: string;
  primaryGroup: string;
  speciality: string;
  bio: string;
  about: string;
  websiteUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  profileImageKey: string;
};
type PortfolioImage = {
  id: string;
  r2Key: string;
  position: number;
  altText: string;
  title: string;
  description: string;
  linkUrl: string;
  width: number;
  height: number;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3 text-fg";
const mediaUrl = (key: string) =>
  key
    ? key.startsWith("/") ? key : `/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`
    : "";
const communityLinks = [
  {
    label: "Join the WhatsApp group",
    href: "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr",
  },
  {
    label: "Join the Facebook group",
    href: "https://www.facebook.com/groups/1033572522893615",
  },
];

export function DashboardForm({
  initialProfile,
  initialImages,
  firstName,
  isAdmin,
  email,
  eventsEnabled,
  previewMode = false,
}: {
  initialProfile: Profile;
  initialImages: PortfolioImage[];
  firstName: string;
  isAdmin: boolean;
  email: string;
  eventsEnabled: boolean;
  previewMode?: boolean;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [images, setImages] = useState(
    [...initialImages].sort((a, b) => a.position - b.position),
  );
  const [status, setStatus] = useState("");
  const [portfolioStatus, setPortfolioStatus] = useState("");
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = useMemo(
    () => JSON.stringify(profile) !== JSON.stringify(savedProfile),
    [profile, savedProfile],
  );

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (key: keyof Profile, value: string) =>
    setProfile((current) => ({ ...current, [key]: value }));

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (previewMode) {
      setSavedProfile(profile);
      setStatus("Preview saved locally. Nothing was sent to the server.");
      return;
    }
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/network/member-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok)
      setStatus(result.error || "Your changes could not be saved.");
    else {
      setSavedProfile(profile);
      setStatus("Your profile is up to date.");
      window.dispatchEvent(new Event("nami-member-profile-updated"));
      router.refresh();
    }
    setBusy(false);
  }

  async function upload(
    event: ChangeEvent<HTMLInputElement>,
    kind: "profile" | "portfolio",
  ) {
    const source = event.target.files?.[0];
    if (!source) return;
    const altText = "";
    setBusy(true);
    setStatus("Preparing your image...");
    if (kind === "portfolio") setPortfolioStatus("Preparing your image...");
    try {
      const processed = await cropImageForUpload(
        source,
        kind === "profile" ? 1000 : 1080,
        kind === "profile" ? 1000 : 1440,
        kind === "profile" ? "profile-photo.webp" : "portfolio-image.webp",
      );
      const data = new FormData();
      data.set("image", processed);
      data.set("kind", kind);
      data.set("altText", altText);
      const response = await fetch("/api/network/member-images", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as {
        error?: string;
        id?: string;
        key?: string;
        width?: number;
        height?: number;
      };
      if (!response.ok || !result.key || !result.id)
        throw new Error(result.error || "Upload failed.");
      if (kind === "profile") {
        setProfile((current) => ({ ...current, profileImageKey: result.key! }));
        window.dispatchEvent(new Event("nami-member-profile-updated"));
      } else
        setImages((current) => {
          const added = {
            id: result.id!,
            r2Key: result.key!,
            position: current.length,
            altText,
            title: "",
            description: "",
            linkUrl: "",
            width: result.width!,
            height: result.height!,
          };
          setEditingImage(added);
          return [...current, added];
        });
      setStatus("Image uploaded.");
      if (kind === "portfolio")
        setPortfolioStatus(
          "Image uploaded. Add a description when you are ready.",
        );
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setStatus(message);
      if (kind === "portfolio") setPortfolioStatus(message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function saveImages(next: PortfolioImage[]) {
    setBusy(true);
    setStatus("");
    setPortfolioStatus("Saving...");
    const ordered = next.map((image, position) => ({ ...image, position }));
    if (previewMode) {
      setImages(ordered);
      setStatus("Preview saved locally. Nothing was sent to the server.");
      setPortfolioStatus("Preview updated.");
      setBusy(false);
      return true;
    }
    try {
      const response = await fetch("/api/network/member-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: ordered.map(
            ({ id, position, altText, title, description, linkUrl }) => ({
              id,
              position,
              altText,
              title,
              description,
              linkUrl,
            }),
          ),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok)
        throw new Error(
          result.error || "The portfolio changes could not be saved.",
        );
      setImages(ordered);
      setStatus("Portfolio changes saved.");
      setPortfolioStatus("Saved. Your public profile has been updated.");
      router.refresh();
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The portfolio changes could not be saved.";
      setStatus(message);
      setPortfolioStatus(message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveImageDetails() {
    if (!editingImage) return;
    const revised = {
      ...editingImage,
      altText: editingImage.description || editingImage.title,
    };
    const next = images.map((image) =>
      image.id === revised.id ? revised : image,
    );
    if (await saveImages(next)) setEditingImage(null);
  }

  async function removeImage(image: PortfolioImage) {
    if (!window.confirm("Remove this image from your profile?")) return;
    setBusy(true);
    const response = await fetch(
      `/api/network/member-images?id=${encodeURIComponent(image.id)}`,
      { method: "DELETE" },
    );
    if (response.ok) {
      const next = images.filter((item) => item.id !== image.id);
      setImages(next);
      setStatus("Image removed.");
    } else setStatus("The image could not be removed.");
    setBusy(false);
  }

  async function signOut() {
    await networkAuthClient.signOut();
    router.push("/network/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-24">
      <div className="flex flex-col gap-5 border-b border-line pb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.16em] text-accent">
            Member dashboard
          </p>
          <h1 className="mt-3 text-5xl md:text-7xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-4 max-w-2xl text-fg-muted">
            Update what people see when they find you in the NAMI Creative
            Network.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <a
              href="/network/admin"
              className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-white shadow-[0_5px_20px_rgb(255_0_188/0.22)]"
            >
              Admin
            </a>
          )}
          <a
            href={`/network/directory/member/${profile.memberId}`}
            className="rounded-full border border-line-strong px-5 py-3 text-sm font-bold"
          >
            Profile
          </a>
          <button
            onClick={signOut}
            className="rounded-full border border-line-strong px-5 py-3 text-sm font-bold text-fg-muted"
          >
            Sign out
          </button>
        </div>
      </div>
      {status && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm"
        >
          {status}
        </p>
      )}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.7fr]">
        <aside className="space-y-6">
          <section className="rounded-[1.5rem] border border-line bg-surface-1 p-6">
            <h2 className="text-2xl">Profile picture</h2>
            {profile.profileImageKey ? (
              <img
                src={mediaUrl(profile.profileImageKey)}
                alt="Current profile"
                className="mx-auto mt-6 aspect-square w-full max-w-xs rounded-full border border-accent/40 object-cover"
              />
            ) : (
              <div className="mx-auto mt-6 aspect-square w-full max-w-xs rounded-full border border-dashed border-accent/50 bg-surface-0" />
            )}
            <label className="mt-6 block cursor-pointer rounded-full bg-accent px-5 py-3 text-center text-sm font-bold text-white">
              Choose a new picture
              <input
                type="file"
                accept="image/*"
                onChange={(event) => upload(event, "profile")}
                className="sr-only"
              />
            </label>
            <p className="mt-3 text-xs text-fg-subtle">
              I’ll crop, resize and optimise it for you.
            </p>
          </section>
          <section className="rounded-[1.5rem] border border-line bg-surface-1 p-6">
            <h2 className="text-2xl">Account</h2>
            <p className="mt-3 text-sm text-fg-muted">
              Signed in as
              <br />
              <strong className="text-fg">{email}</strong>
            </p>
            <div className="mt-4 grid gap-3">
              <a
                href="/network/forgot-password"
                className="text-sm font-bold text-accent"
              >
                Change password →
              </a>
              <a
                href="/network/report-a-problem"
                className="text-sm font-bold text-accent"
              >
                Report a problem →
              </a>
              {(eventsEnabled || process.env.NODE_ENV === "development") && (
                <a
                  href="/network/dashboard/events"
                  className="text-sm font-bold text-accent"
                >
                  Manage your events →
                </a>
              )}
            </div>
          </section>
          <section className="rounded-[1.5rem] border border-line bg-surface-1 p-6">
            <h2 className="text-2xl">Links</h2>
            <div className="mt-5 grid gap-3">
              {communityLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-accent-soft"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        </aside>
        <form
          onSubmit={saveProfile}
          className="rounded-[1.5rem] border border-line bg-surface-1 p-6 md:p-8"
        >
          <h2 className="text-3xl">Profile information</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <Field
              label="Directory display name"
              value={profile.displayName}
              onChange={(value) => update("displayName", value)}
            />
            <Field
              label="Location"
              value={profile.location}
              onChange={(value) => update("location", value)}
            />
            <label className="block text-sm font-semibold">
              Main directory group
              <select
                value={profile.primaryGroup}
                onChange={(event) => update("primaryGroup", event.target.value)}
                className={fieldClass}
              >
                {directoryGroups.map((group) => (
                  <option key={group.slug} value={group.slug}>
                    {group.label}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Speciality"
              value={profile.speciality}
              onChange={(value) => update("speciality", value)}
              maxLength={80}
            />
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Short bio{" "}
            <span className="font-normal text-fg-subtle">
              (shown on your directory card)
            </span>
            <textarea
              value={profile.bio}
              onChange={(event) => update("bio", event.target.value)}
              minLength={20}
              maxLength={320}
              rows={4}
              required
              className={fieldClass}
            />
            <span className="mt-2 block text-right text-xs font-normal text-fg-subtle">
              {profile.bio.length}/320 characters
            </span>
          </label>
          <label className="mt-5 block text-sm font-semibold">
            About{" "}
            <span className="font-normal text-fg-subtle">
              (shown on your full profile)
            </span>
            <textarea
              value={profile.about}
              onChange={(event) => update("about", event.target.value)}
              maxLength={6000}
              rows={9}
              className={fieldClass}
              placeholder="Tell people more about you, your work and what you care about."
            />
            <span className="mt-2 block text-right text-xs font-normal text-fg-subtle">
              {profile.about.trim()
                ? profile.about.trim().split(/\s+/).length
                : 0}
              /750 words
            </span>
          </label>
          <h3 className="mt-8 text-xl">Links</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {(
              [
                ["websiteUrl", "Website or shop"],
                ["instagramUrl", "Instagram"],
                ["facebookUrl", "Facebook"],
                ["linkedinUrl", "LinkedIn"],
                ["tiktokUrl", "TikTok"],
                ["youtubeUrl", "YouTube"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={profile[key]}
                onChange={(value) => update(key, value)}
                type="url"
                required={false}
              />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-fg-subtle">
              {dirty
                ? "You have unsaved changes."
                : "Everything here is saved."}
            </p>
            <button
              disabled={busy || !dirty}
              className="rounded-full bg-accent px-7 py-3 font-bold text-white disabled:opacity-40"
            >
              {busy ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
      <section className="mt-8 rounded-[1.5rem] border border-line bg-surface-1 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl">Your work</h2>
            <p className="mt-2 text-fg-muted">
              Add up to four images, then open Edit to add the details visitors
              will see.
            </p>
          </div>
          {images.length < 4 && (
            <label className="cursor-pointer rounded-full border border-accent px-6 py-3 text-center text-sm font-bold text-accent">
              Add an image
              <input
                type="file"
                accept="image/*"
                onChange={(event) => upload(event, "portfolio")}
                className="sr-only"
              />
            </label>
          )}
        </div>
        {portfolioStatus && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm"
          >
            {portfolioStatus}
          </p>
        )}
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {images.map((image, index) => (
            <article
              key={image.id}
              className="group overflow-hidden rounded-2xl border border-line bg-surface-0"
            >
              <button
                type="button"
                onClick={() => setEditingImage({ ...image })}
                className="relative block w-full overflow-hidden text-left"
              >
                <img
                  src={mediaUrl(image.r2Key)}
                  alt={image.altText || `Work by ${profile.displayName}`}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-70" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <strong className="block text-sm text-white">
                    {image.title || `Image ${index + 1}`}
                  </strong>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    <Pencil size={12} /> Edit
                  </span>
                </span>
              </button>
              <div className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={index === 0 || busy}
                      onClick={() => {
                        const next = [...images];
                        [next[index - 1], next[index]] = [
                          next[index],
                          next[index - 1],
                        ];
                        void saveImages(next);
                      }}
                      aria-label="Move image left"
                      className="disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1 || busy}
                      onClick={() => {
                        const next = [...images];
                        [next[index + 1], next[index]] = [
                          next[index],
                          next[index + 1],
                        ];
                        void saveImages(next);
                      }}
                      aria-label="Move image right"
                      className="disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="text-xs text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!images.length && (
          <div className="mt-7 grid grid-cols-2 gap-5 md:grid-cols-4">
            {[1, 2, 3, 4].map((slot) => (
              <div
                key={slot}
                className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-accent/30 text-sm text-fg-subtle"
              >
                Image {slot}
              </div>
            ))}
          </div>
        )}
      </section>
      {editingImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-image-title"
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingImage(null);
          }}
        >
          <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-accent/35 bg-surface-1 shadow-[0_30px_100px_rgba(0,0,0,0.65)] md:grid-cols-[0.85fr_1.15fr]">
            <button type="button" onClick={() => setEditingImage(null)} className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-black/70 text-white" aria-label="Close image editor"><X size={20} /></button>
            <img src={mediaUrl(editingImage.r2Key)} alt={editingImage.altText || "Portfolio preview"} className="h-full min-h-72 w-full object-cover md:aspect-[3/4]" />
            <div className="p-6 md:p-9">
              <p className="mono-label text-accent">Portfolio image</p>
              <h2 id="edit-image-title" className="mt-3 text-3xl">Edit image details</h2>
              <div className="mt-7 space-y-5">
                <Field label="Title" value={editingImage.title} onChange={(value) => setEditingImage((current) => current ? { ...current, title: value } : current)} maxLength={80} required={false} />
                <label className="block text-sm font-semibold">Short description<textarea value={editingImage.description} onChange={(event) => setEditingImage((current) => current ? { ...current, description: event.target.value } : current)} maxLength={180} rows={4} className={fieldClass} placeholder="One sentence about this work." /><span className="mt-2 block text-right text-xs font-normal text-fg-subtle">{editingImage.description.length}/180</span></label>
                <Field label="External link" value={editingImage.linkUrl} onChange={(value) => setEditingImage((current) => current ? { ...current, linkUrl: value } : current)} type="url" required={false} />
              </div>
              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button type="button" onClick={() => setEditingImage(null)} className="rounded-full border border-line-strong px-6 py-3 text-sm font-bold">Cancel</button>
                <button type="button" disabled={busy} onClick={() => void saveImageDetails()} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving..." : "Save image"} <ExternalLink size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  maxLength = 500,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        required={required}
        className={fieldClass}
      />
    </label>
  );
}
