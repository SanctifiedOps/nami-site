import { NextResponse } from "next/server";
import { isShowcaseReadyMember } from "@/lib/content/network-directory";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";

export const dynamic = "force-dynamic";

export async function GET() {
  const members = await getNetworkDirectoryMembers();
  const items = members
    .filter(isShowcaseReadyMember)
    .map((member) => ({
      id: member.id,
      name: member.name,
      designation: member.category,
      image: member.profileImage,
    }));

  return NextResponse.json(
    { memberCount: members.length, items },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
