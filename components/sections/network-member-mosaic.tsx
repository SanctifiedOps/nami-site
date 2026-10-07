import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";
import {
  dailyMemberPreview,
  londonDayNumber,
} from "@/lib/content/network-directory-groups";

type MosaicMember = Pick<
  NetworkDirectoryMember,
  "id" | "name" | "category" | "location" | "profileImage" | "imageAlt"
>;

const localPreviewMembers: MosaicMember[] = [
  { id: "biggi-e9b414a6", name: "Biggi", category: "Footwear and apparel designer", location: "North East", profileImage: "/assets/images/network-home/biggi.jpg", imageAlt: "Biggi profile picture" },
  { id: "bookfuelled-d15240a7", name: "bookfuelled", category: "Writer and poet", location: "North East", profileImage: "/assets/images/network-home/bookfuelled.webp", imageAlt: "bookfuelled profile picture" },
  { id: "hail-to-the-zine-baby-901982b0", name: "Hail to the Zine baby", category: "Artist and zine maker", location: "Newcastle", profileImage: "/assets/images/network-home/hail-to-the-zine-baby.webp", imageAlt: "Hail to the Zine baby profile picture" },
  { id: "eleanor-osada-6226630b", name: "Eleanor Osada", category: "Designer and photographer", location: "Sunderland", profileImage: "/assets/images/network-home/eleanor-osada.webp", imageAlt: "Eleanor Osada profile picture" },
];

function hasSupportedProfilePicture(member: MosaicMember) {
  const src = member.profileImage?.trim();
  if (!src) return false;
  return (
    src.startsWith("/api/network/media/") ||
    src.startsWith("/images/") ||
    src.startsWith("/assets/")
  );
}

export function NetworkMemberMosaic({ members, memberCount }: { members: MosaicMember[]; memberCount: number }) {
  const picturedMembers = members.filter(hasSupportedProfilePicture);
  const rotatedMembers = dailyMemberPreview(picturedMembers, londonDayNumber(), 4);
  const selectedIds = new Set(rotatedMembers.map((member) => member.id));
  const visibleMembers = [
    ...rotatedMembers,
    ...localPreviewMembers.filter((member) => !selectedIds.has(member.id)),
  ].slice(0, 4);

  return (
    <section className="border-b border-line bg-surface-1 py-20 md:py-28">
      <div className="container-shell">
        <header className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="type-section-title max-w-2xl">Find your next creative collaborator</h2>
            <p className="mt-5 max-w-2xl text-base leading-[1.5] text-fg-muted md:text-lg">
              The NAMI Creative Network brings artists, makers, freelancers and independent businesses from across the North East into one directory. Browse their work, find someone to collaborate with and see who is making things near you.
            </p>
            <p className="mt-4 text-sm font-semibold text-white">
              <span className="text-accent">{memberCount} North East creatives</span> and growing
            </p>
          </div>
          <Link
            href="/network/directory"
            className="group inline-flex w-fit items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
          >
            Browse the directory
            <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </header>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {visibleMembers.map((member) => (
            <Link
              key={member.id}
              href={`/network/directory/member/${member.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`View ${member.name}, ${member.category}`}
            >
              <Image
                src={member.profileImage!}
                alt={member.imageAlt || `${member.name}, ${member.category}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
              />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/90 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <h3 className="text-base font-semibold leading-tight text-white md:text-xl">{member.name}</h3>
                <p className="mt-1 text-xs leading-snug text-white/72 md:text-sm">
                  {member.category}{member.location ? `, ${member.location}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/network" className="inline-flex items-center gap-2 text-sm font-semibold text-fg">
            Explore the Network <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
