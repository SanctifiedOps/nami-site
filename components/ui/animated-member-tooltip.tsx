"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { MemberAvatar } from "@/components/network/member-avatar";
import { cn } from "@/lib/utils";

export type TooltipMember = {
  id: string;
  name: string;
  designation: string;
  image?: string;
};

function randomMembers(items: TooltipMember[], count: number) {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }
  return pool.slice(0, count);
}

export function AnimatedMemberTooltip({
  items,
  memberCount,
  context = "join",
  className,
}: {
  items: TooltipMember[];
  memberCount: number;
  context?: "join" | "directory";
  className?: string;
}) {
  const candidates = useMemo(() => {
    const pictured = items.filter((item) => item.image);
    return pictured.length >= 5 ? pictured : items;
  }, [items]);
  const [visibleMembers, setVisibleMembers] = useState(() => candidates.slice(0, 5));
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setVisibleMembers(randomMembers(candidates, 5));
  }, [candidates]);

  if (visibleMembers.length === 0) return null;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex items-center justify-center pl-3" aria-label="A selection of NAMI Creative Network members">
        {visibleMembers.map((member, index) => (
          <Link
            key={member.id}
            href={`/network/directory/member/${member.id}`}
            aria-label={`View ${member.name}, ${member.designation}`}
            className="group relative -ml-3 rounded-full outline-none focus-visible:z-30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ zIndex: visibleMembers.length - index }}
            onMouseEnter={() => setActiveId(member.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(member.id)}
            onBlur={() => setActiveId(null)}
          >
            <AnimatePresence>
              {activeId === member.id && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="pointer-events-none absolute bottom-[calc(100%+.75rem)] left-1/2 z-50 w-max max-w-56 -translate-x-1/2 rounded-xl border border-accent/50 bg-[#0b0b0e]/95 px-3.5 py-2.5 text-center shadow-[0_12px_35px_rgba(0,0,0,.6),0_0_25px_rgba(255,0,188,.16)] backdrop-blur"
                >
                  <span className="block text-sm font-semibold leading-tight text-white">{member.name}</span>
                  <span className="mt-1 block text-[11px] leading-tight text-fg-muted">{member.designation}</span>
                  <span aria-hidden className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-accent/50 bg-[#0b0b0e]" />
                </motion.span>
              )}
            </AnimatePresence>

            <motion.span
              whileHover={{ y: -4, scale: 1.08 }}
              whileFocus={{ y: -4, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className="block rounded-full border-2 border-black bg-black shadow-[0_5px_18px_rgba(0,0,0,.45)]"
            >
              <span className="block size-11 sm:size-12 [&>span]:size-full [&>span]:text-xs">
                <MemberAvatar name={member.name} src={member.image} />
              </span>
            </motion.span>
          </Link>
        ))}
      </div>

      <p className="text-sm text-fg-muted">
        {context === "directory" ? (
          <><span className="font-semibold text-white">{memberCount} North East creatives</span> doing proper work</>
        ) : (
          <>Join our network of <span className="font-semibold text-white">{memberCount} North East creatives</span></>
        )}
      </p>
    </div>
  );
}
