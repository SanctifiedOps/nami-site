import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { networkDirectoryMembers } from "@/lib/content/network-directory";
import { ProfilePictureForm } from "./profile-picture-form";

export const metadata: Metadata = {
  title: "Add your profile picture | NAMI Creative Network",
  description: "Add a profile picture to your NAMI Creative Network listing.",
  robots: { index: false, follow: false },
};

export default async function ProfilePicturePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const initialMemberId = networkDirectoryMembers.some((member) => member.id === id)
    ? id
    : undefined;
  const members = networkDirectoryMembers.map(({ id: memberId, name, instagram }) => ({
    id: memberId,
    name,
    instagram,
  }));

  return (
    <>
      <PageHero
        eyebrow="NAMI Creative Network"
        title={<>Put a face to <span className="text-gradient">your work</span></>}
        lead="Choose your listing, add one square-friendly image and we’ll prepare it for your Creative Network card."
      >
        <Link
          href="/network/directory"
          className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to the directory
        </Link>
      </PageHero>

      <section className="container-shell py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <ProfilePictureForm members={members} initialMemberId={initialMemberId} />
        </div>
      </section>
    </>
  );
}
