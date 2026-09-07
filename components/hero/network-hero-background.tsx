import Image from "next/image";

export function NetworkHeroBackground() {
  return (
    <>
      <Image
        src="/network-news/hero-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-[0.70] grayscale contrast-125"
      />
      <div aria-hidden className="absolute inset-0 bg-surface-0/18" />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-surface-0/95 via-surface-0/58 to-surface-0/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-surface-0/24 via-transparent to-surface-0/86"
      />
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-25" />
    </>
  );
}
