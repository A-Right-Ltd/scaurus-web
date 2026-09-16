import { Link, useParams } from "@/lib/router";
import { IntelligenceRequestForm } from "@/components/intelligence-request-form";
import { getIntelligenceProduct, INTELLIGENCE_PRODUCTS } from "@/lib/intelligence-catalog";
import { BRAND_FONT, SCAURUS_ACCENT } from "@/lib/brand-tokens";

export default function IntelligencePage() {
  const params = useParams<{ slug?: string }>();
  const product = getIntelligenceProduct(params.slug);

  if (!product) {
    return (
      <main className="min-h-[70vh] bg-background text-foreground px-4 py-16">
        <div className="max-w-2xl mx-auto" style={{ fontFamily: BRAND_FONT }}>
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">Patent Intelligence</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Request indicative patent intelligence. Choose a product below.
          </p>
          <ul className="space-y-3">
            {INTELLIGENCE_PRODUCTS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/intelligence/${item.slug}`}
                  className="block rounded-xl border border-border px-4 py-3 hover:border-[#2D6AFF] transition-colors"
                >
                  <span className="font-semibold" style={{ color: SCAURUS_ACCENT }}>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-background text-foreground px-4 py-16">
      <div className="max-w-lg mx-auto">
        <IntelligenceRequestForm
          title={product.title}
          description={product.description}
          source={product.source}
        />
      </div>
    </main>
  );
}
