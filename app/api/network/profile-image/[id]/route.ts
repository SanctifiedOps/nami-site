import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DRIVE_ID = /^[a-zA-Z0-9_-]{10,100}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!DRIVE_ID.test(id)) {
    return NextResponse.json({ error: "Invalid image ID." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`,
      { redirect: "follow", cache: "force-cache" },
    );
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Image unavailable." }, { status: 404 });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image unavailable." }, { status: 502 });
  }
}
