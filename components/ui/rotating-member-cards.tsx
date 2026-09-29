"use client";

import { useEffect, useState } from "react";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";
import { MemberProfileCard } from "@/components/ui/member-profile-card";

function pickMembers(members: NetworkDirectoryMember[], count: number) {
  const pool = [...members];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }
  return pool.slice(0, count);
}

export function RotatingMemberCards({ members }: { members: NetworkDirectoryMember[] }) {
  const [visibleMembers, setVisibleMembers] = useState(() => members.slice(0, 4));

  useEffect(() => {
    setVisibleMembers(pickMembers(members, 4));
  }, [members]);

  if (visibleMembers.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
      {visibleMembers.map((member) => (
        <MemberProfileCard
          key={member.id}
          id={member.id}
          name={member.name}
          description={member.description}
          speciality={member.category}
          image={member.profileImage}
          imageAlt={member.imageAlt}
        />
      ))}
    </div>
  );
}
