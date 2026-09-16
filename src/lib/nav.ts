export type NavOpen = "spa" | "same-tab" | "new-tab";

export type NavLink = {
  label: string;
  href: string;
  open?: NavOpen;
};

export type ProductMenu = {
  id: string;
  label: string;
  items: NavLink[];
  isActive: (path: string) => boolean;
};

export function isQuantPath(path: string): boolean {
  return path.startsWith("/quant");
}

export function isPatentPath(path: string): boolean {
  return path.startsWith("/intelligence");
}

export function neverActive(): boolean {
  return false;
}

export function navTestId(label: string): string {
  return `nav-${label.toLowerCase().replace(/\s+/g, "-")}`;
}

export function navOpenAttrs(open: NavOpen = "same-tab"): { target?: string; rel?: string } {
  if (open === "new-tab") {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
}

export const QUANT_NAV: NavLink[] = [
  { label: "Dashboard", href: "/quant/dashboard", open: "same-tab" },
  { label: "Portfolio Report", href: "/quant/dashboard/portfolio", open: "same-tab" },
  { label: "Risk Analysis", href: "/quant/dashboard/risk", open: "same-tab" },
  { label: "Gap Analysis", href: "/quant/dashboard/gap", open: "same-tab" },
  { label: "Brand Value (Sonar)", href: "/quant/dashboard/brand-value", open: "same-tab" },
  { label: "Report Builder", href: "/quant/dashboard/reports", open: "same-tab" },
  { label: "Firm View", href: "/quant/dashboard/firm", open: "same-tab" },
  { label: "Agent Hub", href: "/quant/dashboard/agent-hub", open: "same-tab" },
];

export const PRO_NAV: NavLink[] = [
  { label: "Clearance Search", href: "https://filing.aittorney.co/clearance", open: "new-tab" },
  { label: "Blueprints", href: "https://filing.aittorney.co/blueprints", open: "new-tab" },
  { label: "Term Intelligence", href: "https://filing.aittorney.co/term-intelligence", open: "new-tab" },
  { label: "Architect", href: "https://filing.aittorney.co/architect", open: "new-tab" },
  { label: "Expert Labeller", href: "https://filing.aittorney.co/expert-labeller", open: "new-tab" },
];

export const PATENT_NAV: NavLink[] = [
  { label: "Patent Search", href: "/intelligence/patent-search", open: "spa" },
  { label: "Patent Risk", href: "/intelligence/patent-risk", open: "spa" },
  { label: "PTAB Intelligence", href: "/intelligence/ptab", open: "spa" },
  { label: "FTO Clearance", href: "/intelligence/fto", open: "spa" },
  { label: "Patent Portfolio", href: "/intelligence/patent-portfolio", open: "spa" },
];

export const PRODUCT_MENUS: ProductMenu[] = [
  { id: "quant", label: "Quant", items: QUANT_NAV, isActive: isQuantPath },
  { id: "pro", label: "Scaurus Pro", items: PRO_NAV, isActive: neverActive },
  { id: "patent", label: "Patent Intelligence", items: PATENT_NAV, isActive: isPatentPath },
];
