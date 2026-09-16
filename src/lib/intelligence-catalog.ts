export type IntelligenceProduct = {
  slug: string;
  title: string;
  description: string;
  source: string;
};

export const INTELLIGENCE_PRODUCTS: IntelligenceProduct[] = [
  {
    slug: "patent-search",
    title: "Patent Search",
    description: "Request a prior-art and patent landscape search. Our team will follow up with indicative intelligence for your matter.",
    source: "patent-intelligence:patent-search",
  },
  {
    slug: "patent-risk",
    title: "Patent Risk",
    description: "Request a patent risk review covering validity, expiry, and enforcement exposure.",
    source: "patent-intelligence:patent-risk",
  },
  {
    slug: "ptab",
    title: "PTAB Intelligence",
    description: "Request PTAB proceeding intelligence for a patent family or technology area.",
    source: "patent-intelligence:ptab",
  },
  {
    slug: "fto",
    title: "FTO Clearance",
    description: "Request a freedom-to-operate clearance review before launch or filing.",
    source: "patent-intelligence:fto",
  },
  {
    slug: "patent-portfolio",
    title: "Patent Portfolio",
    description: "Request a portfolio-level view of coverage, gaps, and indicative value.",
    source: "patent-intelligence:patent-portfolio",
  },
];

export function getIntelligenceProduct(slug: string | undefined): IntelligenceProduct | undefined {
  if (!slug) return undefined;
  return INTELLIGENCE_PRODUCTS.find((product) => product.slug === slug);
}
