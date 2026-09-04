export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
  { label: "Creative Network", href: "/network" },
];

export const ctaNav: NavItem = {
  label: "Start a project",
  href: "/contact",
};

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Studio",
    items: [
      { label: "About", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Brand strategy", href: "/services/brand-strategy" },
      { label: "Content systems", href: "/services/content-systems" },
      { label: "Website + funnel", href: "/services/website-funnel" },
      { label: "Visual direction", href: "/services/visual-direction" },
      { label: "Automation + growth", href: "/services/automation-growth" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Insights", href: "/insights" },
      { label: "Selected work", href: "/work" },
      { label: "Creative Network", href: "/network" },
      { label: "Creative directory", href: "/network/directory" },
    ],
  },
];
