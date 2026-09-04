"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Check, ImagePlus, Upload, X } from "lucide-react";
import { MemberAvatar } from "@/components/network/member-avatar";
import { cn } from "@/lib/utils";

type MemberOption = {
  id: string;
  name: string;
  instagram: string;
};

type Status = "idle" | "preparing" | "uploading" | "success" | "error";

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const OUTPUT_SIZE = 800;

async function prepareImage(file: File, memberId: string) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const side = Math.min(bitmap.width, bitmap.height);
  const sourceX = Math.max(0, (bitmap.width - side) / 2);
  const sourceY = Math.max(0, (bitmap.height - side) / 2);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not prepare the image.");
  context.drawImage(bitmap, sourceX, sourceY, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86),
  );
  if (!blob) throw new Error("This browser could not prepare the image.");
  return new File([blob], `${memberId}.webp`, { type: "image/webp" });
}

export function ProfilePictureForm({
  members,
  initialMemberId,
}: {
  members: MemberOption[];
  initialMemberId?: string;
}) {
  const [memberId, setMemberId] = useState(initialMemberId ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const member = useMemo(
    () => members.find((item) => item.id === memberId),
    [memberId, members],
  );

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
    if (!member || !file || status === "preparing" || status === "uploading") return;
    setMessage(undefined);

    try {
      setStatus("preparing");
      const prepared = await prepareImage(file, member.id);
      const body = new FormData();
      body.set("memberId", member.id);
      body.set("instagram", member.instagram);
      body.set("altText", `${member.name} profile picture`);
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
      setMessage(error instanceof Error ? error.message : "The image could not be uploaded.");
    }
  };

  return (
    <form onSubmit={submit} className="glass-refractive rounded-3xl p-6 md:p-9">
      <label className="block">
        <span className="mono-label text-fg-subtle">Your directory listing</span>
        <select
          required
          value={memberId}
          onChange={(event) => {
            setMemberId(event.target.value);
            setStatus("idle");
            setMessage(undefined);
          }}
          className="mt-3 w-full rounded-xl border border-line bg-surface-0/65 px-5 py-4 text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/10"
        >
          <option value="">Choose your name</option>
          {members.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>

      {member && (
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-surface-0/45 p-4">
          <MemberAvatar name={member.name} />
          <div>
            <p className="font-semibold text-fg">{member.name}</p>
            <p className="mt-1 text-sm text-fg-subtle">{member.instagram}</p>
          </div>
        </div>
      )}

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
        disabled={!member || !file || status === "preparing" || status === "uploading"}
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
