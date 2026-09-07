"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Check, ImagePlus, Upload, X } from "lucide-react";
import { MemberAvatar } from "@/components/network/member-avatar";
import { friendlyUploadError, prepareProfileImage } from "@/lib/network/prepare-profile-image";
import { cn } from "@/lib/utils";

type MemberOption = {
  id: string;
  name: string;
  instagram: string;
  description: string;
};

type Status = "idle" | "preparing" | "uploading" | "success" | "error";

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
export function ProfilePictureForm({
  member,
  token,
}: {
  member: MemberOption;
  token: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.currentTarget.files?.[0] ?? null;
    setMessage(undefined);
    setStatus("idle");
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      setStatus("error");
      setMessage("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (nextFile.size > MAX_SOURCE_BYTES) {
      setStatus("error");
      setMessage("Choose an image smaller than 10 MB.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(undefined);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || status === "preparing" || status === "uploading") return;
    setMessage(undefined);

    try {
      setStatus("preparing");
      const prepared = await prepareProfileImage(file, member.id);
      const body = new FormData();
      body.set("memberId", member.id);
      body.set("token", token);
      body.set("instagram", member.instagram);
      body.set("altText", `${member.name} profile picture`);
      body.set("bioUpdate", bio.trim());
      body.set("image", prepared);

      setStatus("uploading");
      const response = await fetch("/api/network/profile-picture", {
        method: "POST",
        body,
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || "The image could not be uploaded.");

      setStatus("success");
      setMessage("Nice one. Your picture has landed and is ready for the directory.");
      clearFile();
    } catch (error) {
      setStatus("error");
      setMessage(friendlyUploadError(error));
    }
  };

  return (
    <form onSubmit={submit} className="glass-refractive rounded-3xl p-6 md:p-9">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface-0/45 p-4">
          <MemberAvatar name={member.name} />
          <div>
            <p className="font-semibold text-fg">{member.name}</p>
            <p className="mt-1 text-sm text-fg-subtle">{member.instagram}</p>
          </div>
      </div>

      <div className="mt-7">
        <label htmlFor="bio-update" className="mono-label text-fg-subtle">Refresh your directory bio (optional)</label>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">Current bio: {member.description}</p>
        <textarea
          id="bio-update"
          value={bio}
          onChange={(event) => setBio(event.target.value.slice(0, 800))}
          rows={5}
          placeholder="Tell us what you do, who you help and what makes your work yours. We'll write it as a short NAMI bio."
          className="mt-4 w-full rounded-2xl border border-line bg-surface-0/65 px-5 py-4 text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-4 focus:ring-accent/10"
        />
        <p className="mt-2 text-right text-xs text-fg-subtle">{bio.length}/800</p>
      </div>

      <div className="mt-7">
        <p className="mono-label text-fg-subtle">Your picture</p>
        <input
          ref={inputRef}
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={chooseFile}
          className="sr-only"
        />

        {previewUrl ? (
          <div className="mt-3 flex items-center gap-5 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            {/* A temporary local preview does not need Next Image optimisation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Selected profile preview" className="size-24 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{file?.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-fg-subtle">We’ll centre-crop and prepare it as an 800px WebP.</p>
              <button type="button" onClick={clearFile} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-soft">
                <X size={14} aria-hidden /> Choose another
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 flex w-full flex-col items-center rounded-2xl border border-dashed border-line bg-surface-0/35 px-6 py-12 text-center transition-colors hover:border-accent/55 hover:bg-accent/5"
          >
            <ImagePlus size={30} aria-hidden className="text-accent" />
            <span className="mt-4 font-semibold text-fg">Choose a profile picture</span>
            <span className="mt-2 text-sm text-fg-subtle">JPG, PNG or WebP. Up to 10 MB.</span>
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={!file || status === "preparing" || status === "uploading"}
        className={cn(
          "mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-45",
        )}
      >
        {status === "preparing" ? "Preparing image..." : status === "uploading" ? "Uploading..." : "Send profile picture"}
        <Upload size={16} aria-hidden />
      </button>

      {message && (
        <p role={status === "error" ? "alert" : "status"} className={cn("mt-5 flex items-start gap-2 text-sm leading-relaxed", status === "success" ? "text-fg" : "text-accent")}>
          {status === "success" && <Check size={17} aria-hidden className="mt-0.5 shrink-0 text-accent" />}
          {message}
        </p>
      )}
    </form>
  );
}
