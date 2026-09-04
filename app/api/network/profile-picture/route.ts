import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { networkDirectoryMembers } from "@/lib/content/network-directory";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const DRIVE_FOLDER_ID = "17DkzynRlfrxtVTwAaqF13RPnsN5Pa6Ec";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function text(value: FormDataEntryValue | null, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeMemberId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

export async function POST(request: Request) {
  const webhookUrl = process.env.PROFILE_IMAGE_WEBHOOK_URL;
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "That upload could not be read." }, { status: 400 });
  }

  const memberId = safeMemberId(text(formData.get("memberId"), 160));
  const member = networkDirectoryMembers.find((item) => item.id === memberId);
  const isNewMember = text(formData.get("newMember"), 10) === "true";
  const submittedName = text(formData.get("memberName"), 120);
  const submittedInstagram = text(formData.get("instagram"), 120);
  const image = formData.get("image");
  if (!member && !(isNewMember && memberId && submittedName && submittedInstagram)) {
    return NextResponse.json({ error: "Choose a valid directory listing." }, { status: 400 });
  }
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "Choose a profile picture." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(image.type) || image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Send a JPG, PNG or WebP image smaller than 3 MB." }, { status: 400 });
  }

  if (!webhookUrl && process.env.NODE_ENV === "development") {
    const outputDirectory = path.join(process.cwd(), "public", "images", "network", "members");
    const outputPath = path.join(outputDirectory, `${memberId}.webp`);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(outputPath, Buffer.from(await image.arrayBuffer()));
    return NextResponse.json({
      ok: true,
      imageUrl: `/images/network/members/${memberId}.webp`,
      mode: "local-preview",
    });
  }

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "The upload connection is still being configured. Please try again shortly." },
      { status: 503 },
    );
  }

  const outgoing = new FormData();
  const memberName = member?.name ?? submittedName;
  const instagram = member?.instagram ?? submittedInstagram;
  outgoing.set("memberId", memberId);
  outgoing.set("memberName", memberName);
  outgoing.set("lookupName", text(formData.get("lookupName"), 120) || memberName.split(" / ")[0].trim());
  outgoing.set("instagram", instagram);
  outgoing.set("altText", text(formData.get("altText"), 200) || `${memberName} profile picture`);
  outgoing.set("driveFolderId", DRIVE_FOLDER_ID);
  outgoing.set("sheetName", "Creative Network");
  outgoing.set("imageStatus", "Ready");
  outgoing.set("submittedAt", new Date().toISOString());
  outgoing.set("image", image, memberId);

  const response = await fetch(webhookUrl, { method: "POST", body: outgoing });
  if (!response.ok) {
    console.error("Profile image webhook failed:", response.status);
    return NextResponse.json({ error: "The upload did not land. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
