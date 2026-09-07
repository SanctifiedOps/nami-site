import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { networkDirectoryMembers } from "@/lib/content/network-directory";
import { readProfileUpdateToken } from "@/lib/network/profile-update-token";
import { ProfilePictureForm } from "./profile-picture-form";

export const metadata: Metadata = {
  title: "Add your profile picture | NAMI Creative Network",
  description: "Add a profile picture to your NAMI Creative Network listing.",
  robots: { index: false, follow: false },
};

export default async function ProfilePicturePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let memberId: string | null = null;
  try {
    memberId = readProfileUpdateToken(token);
  } catch {
    memberId = null;
  }
  const member = networkDirectoryMembers.find((item) => item.id === memberId);

  return (
    <>
      <PageHero
        networkBackground
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
          {member && token ? (
            <ProfilePictureForm
              member={{ id: member.id, name: member.name, instagram: member.instagram, description: member.description }}
              token={token}
            />
          ) : (
            <div className="glass-refractive rounded-3xl p-7 md:p-9">
              <h2 className="text-2xl font-semibold text-fg">This link isn&apos;t valid</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">
                Use the personal link in your NAMI email. If it still doesn&apos;t work, reply to the email and we&apos;ll sort it.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
