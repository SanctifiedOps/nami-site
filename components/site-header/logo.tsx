import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="NAMI Creative · home"
      className={cn(
        "group inline-flex items-center transition-opacity duration-300 hover:opacity-80",
        className,
      )}
    >
      <Image
        src="/Nami-Logo.png"
        alt="NAMI Creative"
        width={200}
        height={40}
        priority
        className="h-7 w-auto md:h-8"
      />
    </Link>
  );
}
