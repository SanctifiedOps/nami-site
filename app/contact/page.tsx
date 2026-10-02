import { ContactPageClient } from "./contact-page-client";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { isShowcaseReadyMember } from "@/lib/content/network-directory";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const members = await getNetworkDirectoryMembers();
  const showcaseMembers = members.filter(isShowcaseReadyMember);

  return (
    <ContactPageClient
      memberCount={members.length}
      tooltipMembers={showcaseMembers.map((member) => ({
        id: member.id,
        name: member.name,
        designation: member.category,
        image: member.profileImage,
      }))}
    />
  );
}
