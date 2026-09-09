export function NetworkHeroBackground() {
  return (
    <>
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/network-news/hero-background-mobile.webp"
        />
        <img
          src="/network-news/hero-background.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.70] grayscale contrast-125"
        />
      </picture>
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
