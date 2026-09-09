export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All services", href: "/services" },
      { label: "Branding", href: "/services/brand-strategy" },
      { label: "Content", href: "/services/content-systems" },
      { label: "Websites", href: "/services/website-funnel" },
      { label: "Automation", href: "/services/automation-growth" },
    ],
  },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  {
    label: "Creative Network",
    href: "/network",
    children: [
      { label: "Join The Network", href: "/network" },
      { label: "Creative Network Directory", href: "/network/directory" },
    ],
  },
];

export const ctaNav: NavItem = {
  label: "Work with me",
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
      { label: "Branding", href: "/services/brand-strategy" },
      { label: "Content", href: "/services/content-systems" },
      { label: "Websites", href: "/services/website-funnel" },
      { label: "Automation", href: "/services/automation-growth" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Selected work", href: "/work" },
      { label: "Creative Network", href: "/network" },
      { label: "Creative directory", href: "/network/directory" },
    ],
  },
];
