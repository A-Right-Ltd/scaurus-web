import { useEffect, useRef, useState, type ReactNode, type ComponentType, type CSSProperties } from "react";
import { BarChart3, ShieldAlert, Search, PoundSterling, Building2 } from "lucide-react";
import RedTeamEngine from "@/components/red-team-engine";
import MosaicSection from "@/components/mosaic-section";

const BRAND_FONT = "'Outfit', sans-serif";
const COBALT = "oklch(0.6 0.2 250)";

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShown(true);
      },
      { threshold: 0.12 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11px] font-bold uppercase mb-6"
      style={{ color: COBALT, letterSpacing: "0.18em" }}
    >
      {children}
    </p>
  );
}

const CAPABILITIES: {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  body: string;
}[] = [
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    body: "Live status across every mark — risk scores, renewal forecasts, coverage gaps — updated continuously, not quarterly.",
  },
  {
    icon: ShieldAlert,
    title: "Litigiousness Scoring",
    body: "Know which owners oppose aggressively before you file. Scored 0–100 from case law history, not just filing data.",
  },
  {
    icon: Search,
    title: "Competitor Intelligence",
    body: "Track competitor filing patterns, identify expansion signals, and surface gaps in your protective coverage.",
  },
  {
    icon: PoundSterling,
    title: "SONAR Brand Valuation",
    body: "AI-driven defensible valuation on every mark — commercially weighted using live market data and earnings signals.",
  },
  {
    icon: Building2,
    title: "Entity Resolution",
    body: "6-tier GLEIF pipeline resolving 600k+ corporate relationships — so your portfolio intelligence maps to real ownership structures, not surface-level filing names.",
  },
];

const COMPARE_ROWS = [
  ["Portfolio analytics", "Quarterly manual reports. Spreadsheets. Docketing exports.", "Continuous live scoring. Every mark. Always current."],
  ["Conflict assessment", "Attorney searches manually. Hours per clearance.", "Semantic search + litigiousness score in seconds."],
  ["Competitor monitoring", "Watched marks. Manual review. Alerts without context.", "Expansion pattern detection. Filing signal analysis."],
  ["Brand valuation", "Expensive third-party report. Once. Stale within 12 months.", "SONAR engine. Continuous. Market-signal weighted."],
  ["Entity resolution", "Manual corporate research. Incomplete. No cross-border view.", "6-tier GLEIF pipeline. 600k+ relationships resolved."],
  ["Renewals", "Deadline alerts. No strategic recommendation.", "Renewal strategy — maintain, reassess, or abandon — scored per mark."],
];

const DIGITAL_FEATURES = [
  "VMC/BIMI certificate issuance — connect your registered mark to inbox authentication",
  "DMARC posture audit — SPF, DKIM, DMARC compliance check with inline guidance",
  "Domain intelligence — watch list monitoring, lookalike detection, ownership history",
  "Online brand protection — infringement detection across domains, social, and marketplaces",
  "DigiCert root of trust integration — the same CA infrastructure used by the world's largest brands",
  "A Right Protocol readiness — step one toward cryptographic brand attestation",
];

const QUANT_CARDS = [
  {
    title: "Risk Analysis",
    body: "515 marks expiring. 7,386 non-use vulnerable. Brexit exposure flagged. Quant surfaces what needs action — before it costs you.",
  },
  {
    title: "Gap Analysis",
    body: "Geographic and classification gaps identified automatically. Missing coverage in 30 countries cross-joined against your marks. AI urgent filing recommendations with estimated exposure.",
  },
  {
    title: "Brand Value (Sonar)",
    body: "A defensible valuation figure on every mark. Relief-from-Royalty methodology. Updated automatically. No consultant. No 6-week wait.",
  },
  {
    title: "Report Builder",
    body: "Select modules from your live portfolio data. Add AI attorney commentary. Export stakeholder-ready PDF. Minutes, not weeks.",
  },
  {
    title: "Agent Hub",
    body: "12 AI specialists — Sofia (Sentiment Scout), Colette (Portfolio Auditor), Jake (Risk Prioritiser), Allepo (Valuation Analyst), and 8 more. Deploy them in parallel.",
  },
  {
    title: "Firm View",
    body: "Your clients' portfolios, live. One view. Every mark, every jurisdiction, every risk — without opening a separate IPMS.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What exactly is Quant?",
    a: "Quant is SCAURUS's portfolio intelligence engine. It takes your trade mark portfolio — however large — and runs continuous risk analysis, gap detection, brand valuation, and competitor monitoring across every mark, every class, every jurisdiction. The output is insight you can act on immediately.",
  },
  {
    q: "Who is Quant built for?",
    a: "In-house IP controllers managing large portfolios, law firms with client portfolios to grow, and CFOs who need to put a defensible number on brand assets before a board meeting, fundraise, or transaction.",
  },
  {
    q: "How is Quant different from legacy IP management tools like Anaqua, Clarivate, or CPA Global?",
    a: "Legacy IPMS tools are record-keeping systems. Quant is an intelligence system. They tell you what exists. Quant tells you what it's worth, what's at risk, and what to do about it. Most clients run both — Quant sits above the IPMS and generates the intelligence the IPMS was never designed to produce.",
  },
  {
    q: "What is Sonar brand valuation?",
    a: "Sonar is Quant's continuous brand valuation engine. It applies the Relief-from-Royalty method (ISO 10668-aligned) to every mark in your portfolio — producing a defensible valuation figure without a consultant, without a 6-week engagement, and without a £50,000+ invoice. The output updates automatically when your portfolio or market data changes.",
  },
  {
    q: "What does Quant actually replace?",
    a: "Quarterly manual portfolio reviews. External consultants for brand valuation. Partner-hour-intensive risk audits. Paralegal gap-scanning. The manual work that currently happens between your docketing system and your board report.",
  },
  {
    q: "Is Quant available now?",
    a: "Yes. Sign in to the platform, or book a demo and we'll walk you through your own portfolio.",
  },
];

const PILLARS = [
  {
    num: "Pillar 01",
    title: "Filing Toolkits",
    body: "Practitioner-grade filing workflow. Specification drafting in minutes. Multi-jurisdiction in one session. PractitionerAuth gate ensures the attorney remains agent of record — always.",
  },
  {
    num: "Pillar 02",
    title: "Case Law Analysis",
    body: "A searchable, entity-resolved corpus of EUIPO, UKIPO, BAILII, WIPO UDRP, and TTAB decisions — queryable as structured data, not document search. The difference between a library and a database.",
  },
  {
    num: "Pillar 03",
    title: "IP Management",
    body: "Portfolio dashboard, coverage gap map, vulnerability scoring, specification drift detection, and renewal strategy — not just deadline tracking, but intelligence on which marks to maintain, reassess, or abandon.",
  },
  {
    num: "Pillar 04",
    title: "Revenue Intelligence",
    body: "New matter engine, client portfolio health scoring, cross-sell identification, and practice area diversification signals. For firms, SCAURUS surfaces the conversations already in your book. For in-house, it builds the ROI case for the board.",
  },
  {
    num: "Pillar 05",
    title: "Blockchain & Cryptography",
    body: "VMC issuance and management, A Right Protocol implementation, and cryptographic brand attestation toolkits — the infrastructure layer for the AI-crawler era. Make your mark machine-enforceable.",
  },
];

const PRO_FIRM_STATS = [
  {
    key: "margin",
    stat: "£120–£240",
    label: "Illustrative margin per matter, per year",
    body: "Fixed-fee clearance and filing become profitable at volume once the manual research is automated.",
  },
  {
    key: "throughput",
    stat: "3–4×",
    label: "Illustrative brand matters per fee-earner",
    body: "Associates handle far more volume without adding headcount — time goes to judgement, not administration.",
  },
  {
    key: "annuity",
    stat: "Annuity",
    label: "Recurring monitoring & renewals",
    body: "Recurring monitoring and renewals convert one-off filings into a book of recurring revenue.",
  },
];

const DIGITAL_TEST_ROWS = [
  { domain: "yourbrand.com", dmarc: "p=reject", bimi: "Active", vmc: "Protected", positive: true },
  { domain: "yourbrand.io", dmarc: "p=none", bimi: "Pending", vmc: "At risk", positive: false },
  { domain: "get-yourbrand.com", dmarc: "Missing", bimi: "Not eligible", vmc: "Exposed", positive: false },
];

const DIGITAL_LEAD_TYPES = [
  {
    key: "intentional",
    tag: "Ready to convert",
    title: "Missing certificate — intentional",
    body: "The domain is configured for BIMI (a=;) but carries no VMC. They already know what they need and simply haven't bought it yet.",
  },
  {
    key: "oversight",
    tag: "Educate",
    title: "Missing certificate — oversight",
    body: "A logo is linked but the VMC tag is absent. They don't yet realise a certificate is now expected by Gmail and Apple Mail for logo display.",
  },
  {
    key: "invalid",
    tag: "Fix",
    title: "Invalid file linked",
    body: "A standard SVG is referenced in place of a VMC. It will never render in the inbox — a silent failure waiting to be caught.",
  },
];

const DIGITAL_DIVERSIFY = [
  {
    key: "inbox",
    stat: "Inbox",
    label: "Your logo, verified on every message",
    body: "VMC + BIMI turn a registered mark into an authenticated identity that can display in supporting inboxes such as Gmail and Apple Mail.",
  },
  {
    key: "email",
    stat: "p=reject",
    label: "Email authenticated end-to-end",
    body: "A DMARC posture audit closes the spoofing gap that lets impersonators trade on your name.",
  },
  {
    key: "ai",
    stat: "AI-ready",
    label: "Machine-enforceable brand rights",
    body: "A Right Protocol readiness asserts your mark in the credentials AI crawlers actually read — not just the ones humans see.",
  },
];

const PRO_FIRM_SCENARIOS = [
  {
    key: "regional-clearance",
    title: "A regional firm productises clearance",
    body: "A twelve-partner firm packaged clearance-and-file as a fixed-fee product, running searches through the engine and routing only edge cases to a partner.",
    result: "Illustrative: matter throughput up ~3× with the same fee-earner count.",
  },
  {
    key: "acquisition-review",
    title: "Portfolio review for an acquisition",
    body: "During due diligence, an IP team imported a target's portfolio to surface coverage gaps and renewal risk before completion.",
    result: "Illustrative: coverage gaps flagged in hours, not a week of paralegal time.",
  },
];

export default function ScaurusSections() {
  return (
    <div style={{ fontFamily: BRAND_FONT }} className="bg-[#0a0a0a] text-[#f5f5f5]">
      {/* ── SCAURUS QUANT ── */}
      <section id="quant" className="py-28 md:py-36 px-6 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <SectionLabel>SCAURUS Quant</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              A modern operating layer. Not another legacy tool.
            </h2>
            <p className="text-[#888] text-base leading-relaxed mb-5">
              Legacy IP management tools record what has already happened — deadlines, renewals, filing status. Quant is the layer that sits above them: opposition probability before you file, competitor expansion signals before they materialise, portfolio vulnerability before a dispute arrives.
            </p>
            <p className="text-[#888] text-base leading-relaxed mb-8">
              Quant complements your docketing system. Then, in most cases, it replaces the manual work that sits around it.
            </p>
            <a
              href="/quant/login"
              data-testid="link-access-quant"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-sm hover:bg-white transition-colors"
            >
              Access Quant →
            </a>
          </Reveal>

          <Reveal delay={120}>
            <ul className="space-y-5">
              {CAPABILITIES.map((c) => (
                <li
                  key={c.title}
                  className="flex gap-4 p-5 rounded-xl bg-[#141414] border border-[#2a2a2a]"
                >
                  <c.icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COBALT }} />
                  <div>
                    <strong className="block font-semibold text-[#f5f5f5] mb-1">{c.title}</strong>
                    <span className="text-[#888] text-sm leading-relaxed">{c.body}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── INSIDE THE ENGINE — SIX PRODUCT CARDS ── */}
      <section className="py-28 md:py-36 px-6 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Inside the engine</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Everything your portfolio needs. In one platform.
            </h2>
            <p className="text-[#888] text-lg leading-relaxed">
              Quant replaces scattered spreadsheets, docketing tools, and manual reviews with one AI-native operating layer for your trade mark portfolio.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUANT_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div
                  className="h-full p-7 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] transition-colors duration-300"
                  data-testid={`card-quant-${c.title.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                >
                  <h3 className="text-lg font-bold mb-3">{c.title}</h3>
                  <p className="text-[#888] text-sm leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCAURUS ENGINE — RED TEAM ── */}
      <RedTeamEngine />

      {/* ── THE LANDSCAPE — COMPARISON ── */}
      <section className="py-28 md:py-36 px-6 bg-[#050505] border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionLabel>The landscape</SectionLabel>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-10 max-w-3xl">
              What managing IP looks like today — and what it looks like with Quant.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-x-auto rounded-2xl border border-[#2a2a2a]">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#111113]">
                    <th className="p-5 text-sm font-semibold text-[#888] w-1/4">Capability</th>
                    <th className="p-5 text-sm font-semibold text-[#888]">Lawyers &amp; legacy tools today</th>
                    <th
                      className="p-5 text-sm font-bold"
                      style={{ color: COBALT }}
                    >
                      SCAURUS Quant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map(([cap, legacy, scaurus]) => (
                    <tr key={cap} className="border-t border-[#2a2a2a]">
                      <td className="p-5 text-sm font-semibold text-[#f5f5f5] align-top">{cap}</td>
                      <td className="p-5 text-sm text-[#888] align-top leading-relaxed">{legacy}</td>
                      <td className="p-5 text-sm text-[#d4d4d4] align-top leading-relaxed">
                        <span className="font-bold mr-2" style={{ color: COBALT }}>✓</span>
                        {scaurus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ON THE SYSTEMS YOU ALREADY RUN ── */}
      <section className="py-28 md:py-32 px-6 bg-[#0e0e0e] border-t border-[#2a2a2a]">
        <Reveal className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <SectionLabel>On the systems you already run</SectionLabel>
            <blockquote className="text-2xl md:text-4xl font-extrabold tracking-tight leading-snug">
              "We already have a docketing system."
            </blockquote>
          </div>
          <div>
            <p className="text-[#888] text-base leading-relaxed mb-4">
              Good — keep it. Docketing tools record what has already happened: deadlines, renewals, filing status. They are excellent record stores. They were never built to be intelligence systems.
            </p>
            <p className="text-[#888] text-base leading-relaxed mb-4">
              <strong className="text-[#f5f5f5]">Quant is the layer that sits above them</strong> — opposition probability before you file, competitor expansion signals before the marks appear, brand valuation before the board meeting, and jurisdiction gaps before someone else moves in.
            </p>
            <p className="text-[#888] text-base leading-relaxed mb-4">
              For firms, that intelligence surfaces the conversations already sitting in your own book: the cross-sell waiting to happen, the unprotected gap, the valuation a client didn't know they needed. You grow by seeing more in the portfolios you already hold — not by acquiring another book or stretching the team thin.
            </p>
            <p className="text-[#888] text-base leading-relaxed">
              <strong className="text-[#f5f5f5]">Quant complements</strong> the systems you already run. Then, quietly, it <strong className="text-[#f5f5f5]">replaces</strong> the manual work that sits around them.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── SCAURUS DIGITAL ── */}
      <section id="digital" className="py-28 md:py-36 px-6 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <SectionLabel>SCAURUS Digital</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Connect your registered mark to the machine-readable web.
            </h2>
            <p className="text-[#888] text-base leading-relaxed mb-5">
              Domain intelligence, VMC/BIMI certificate issuance, DMARC compliance audit, and online brand protection — unified. The digital rights layer that makes your registered trade mark machine-enforceable.
            </p>
            <p className="text-[#888] text-base leading-relaxed mb-8">
              As AI crawlers become the dominant traffic layer for brand-facing digital assets, a trade mark registration alone is not sufficient. SCAURUS Digital issues the cryptographic credentials that assert your brand rights in the protocols that AI systems actually read.
            </p>
            <a
              href="https://vmcregistry.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-get-vmc"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-sm hover:bg-white transition-colors"
            >
              Get your VMC →
            </a>
          </Reveal>
          <Reveal delay={120}>
            <ul className="space-y-3">
              {DIGITAL_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex gap-3 p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] text-[#aaa] text-sm leading-relaxed"
                >
                  <span className="font-bold flex-shrink-0" style={{ color: COBALT }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ── Digital narrative — diversification from IP to digital ── */}
        <Reveal delay={80}>
          <div className="mt-24 pt-16 border-t border-[#2a2a2a]">
            <div className="max-w-3xl mb-14">
              <SectionLabel>From IP to digital</SectionLabel>
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.12]">
                One registered mark. Diversified into digital rights at the source.
              </h3>
              <p className="text-[#888] text-base leading-relaxed">
                Most brands treat a trade mark registration as the finish line. It is the source asset. SCAURUS Digital tests where that mark is exposed across the protocols machines read — inbox identity, email authentication, and AI-crawler attestation — then converts each gap into a live credential.
              </p>
            </div>

            {/* diversification stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {DIGITAL_DIVERSIFY.map((d) => (
                <div
                  key={d.key}
                  data-testid={`card-digital-diversify-${d.key}`}
                  className="p-7 rounded-2xl bg-[#141414] border border-[#2a2a2a]"
                >
                  <div
                    className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2"
                    style={{ color: COBALT }}
                  >
                    {d.stat}
                  </div>
                  <div className="text-sm font-semibold text-[#f5f5f5] mb-3">{d.label}</div>
                  <p className="text-[#888] text-sm leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>

            {/* VMC & DMARC testing — visual */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16 items-stretch">
              {/* compliance test table */}
              <div
                data-testid="panel-digital-test"
                className="lg:col-span-3 p-7 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]"
              >
                <p
                  className="text-xs font-bold uppercase mb-1"
                  style={{ color: COBALT, letterSpacing: "0.12em" }}
                >
                  VMC &amp; DMARC test
                </p>
                <p className="text-[#888] text-sm leading-relaxed mb-6">
                  Enter a domain and SCAURUS Digital reads its live DNS — DMARC policy, BIMI record and VMC status — in seconds.
                </p>
                <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
                  <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-[#141414] text-[10px] font-bold uppercase tracking-wider text-[#666]">
                    <span>Domain</span>
                    <span>DMARC</span>
                    <span>BIMI</span>
                    <span>VMC</span>
                  </div>
                  {DIGITAL_TEST_ROWS.map((r) => (
                    <div
                      key={r.domain}
                      data-testid={`row-digital-test-${r.domain}`}
                      className="grid grid-cols-4 gap-2 px-4 py-3.5 border-t border-[#2a2a2a] text-sm items-center"
                    >
                      <span className="text-[#f5f5f5] font-medium truncate">{r.domain}</span>
                      <span className="text-[#888] text-xs">{r.dmarc}</span>
                      <span className="text-[#888] text-xs">{r.bimi}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: r.positive ? COBALT : "#888" }}
                      >
                        {r.vmc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* inbox before / after */}
              <div
                data-testid="panel-digital-inbox"
                className="lg:col-span-2 p-7 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col"
              >
                <p
                  className="text-xs font-bold uppercase mb-1"
                  style={{ color: COBALT, letterSpacing: "0.12em" }}
                >
                  Inbox preview
                </p>
                <p className="text-[#888] text-sm leading-relaxed mb-6">
                  Without a VMC your message is anonymous. With one, your verified logo appears before a word is read.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a]">
                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[#888] text-xs font-medium">Unknown sender</p>
                      <p className="text-[#666] text-xs truncate">Your invoice is ready</p>
                    </div>
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-[#555]">No VMC</span>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a]"
                    style={{ border: `1px solid ${COBALT}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[#0a0a0a] font-extrabold text-sm"
                      style={{ backgroundColor: COBALT }}
                    >
                      A
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#f5f5f5] text-xs font-semibold flex items-center gap-1">
                        Your Brand
                        <span style={{ color: COBALT }}>✓</span>
                      </p>
                      <p className="text-[#888] text-xs truncate">Your invoice is ready</p>
                    </div>
                    <span
                      className="ml-auto text-[10px] uppercase tracking-wider"
                      style={{ color: COBALT }}
                    >
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* lead types */}
            <div className="max-w-3xl mb-8">
              <p className="text-lg md:text-xl font-bold text-[#f5f5f5] mb-2">
                Every failed test is a qualified lead.
              </p>
              <p className="text-[#888] text-base leading-relaxed">
                SCAURUS Digital classifies exposure by intent, so brand and agency teams know exactly how to act on each domain.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {DIGITAL_LEAD_TYPES.map((l) => (
                <div
                  key={l.key}
                  data-testid={`card-digital-lead-${l.key}`}
                  className="p-7 rounded-2xl bg-[#141414] border border-[#2a2a2a] flex flex-col"
                >
                  <span
                    className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4"
                    style={{ color: COBALT, borderColor: COBALT }}
                  >
                    {l.tag}
                  </span>
                  <h4 className="text-base font-bold mb-3">{l.title}</h4>
                  <p className="text-[#888] text-sm leading-relaxed flex-1">{l.body}</p>
                </div>
              ))}
            </div>

            {/* AI readiness band */}
            <div className="p-8 md:p-10 rounded-2xl bg-[#141414] border border-[#2a2a2a] flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div className="max-w-2xl">
                <p
                  className="text-xs font-bold uppercase mb-2"
                  style={{ color: COBALT, letterSpacing: "0.12em" }}
                >
                  AI readiness
                </p>
                <p className="text-lg md:text-xl font-bold text-[#f5f5f5] mb-2">
                  Built for the crawler era, not just the inbox.
                </p>
                <p className="text-[#888] text-sm leading-relaxed">
                  As AI agents become the dominant readers of brand-facing content, a human-visible logo is not enough. SCAURUS Digital lays the A Right Protocol groundwork so your mark stays machine-enforceable wherever intelligence reads it.
                </p>
              </div>
              <a
                href="https://vmcregistry.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-digital-test"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-sm hover:bg-white transition-colors flex-shrink-0"
              >
                Test your domain →
              </a>
            </div>
          </div>
        </Reveal>
        </div>
      </section>

      {/* ── SCAURUS PRO ── */}
      <section id="pro" className="py-28 md:py-36 px-6 bg-[#050505] border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-3xl mb-16">
            <SectionLabel>SCAURUS Pro</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              The AI IP Operating System for professionals.
            </h2>
            <p className="text-[#888] text-base leading-relaxed">
              Not a filing tool. Not a case law database. Not an IP management system. Not a blockchain toolkit. All five — unified on a single data lake, running under one session, producing cited outputs that meet professional indemnity standards.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 100}>
                <div className="h-full p-7 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
                  <p className="text-xs font-bold uppercase mb-3" style={{ color: COBALT, letterSpacing: "0.12em" }}>
                    {p.num}
                  </p>
                  <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                  <p className="text-[#888] text-sm leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-16 p-10 md:p-12 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug max-w-2xl mb-5">
                "A toolkit gives you capabilities. An operating system shares context between them."
              </p>
              <p className="text-[#888] text-base leading-relaxed max-w-2xl">
                The practitioner using a toolkit switches between systems. They search in one tool, file in another, manage in a third. An operating system maintains the context. The case law research that surfaced a conflict in the morning populates the specification that avoids it in the afternoon. This is the operating system argument.{" "}
                <strong className="text-[#f5f5f5]">Not five capabilities. One context. One data model. One professional credential.</strong>
              </p>
            </div>
          </Reveal>

          {/* ── Pro for law firms — commercial narrative ── */}
          <Reveal delay={80}>
            <div className="mt-24 pt-16 border-t border-[#2a2a2a]">
              <div className="max-w-3xl mb-14">
                <SectionLabel>Pro for law firms</SectionLabel>
                <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.12]">
                  Turn routine brand work into a scalable, high-margin service line.
                </h3>
                <p className="text-[#888] text-base leading-relaxed">
                  An orchestration layer for clearance, classification and filing — so associates spend their time on judgement, not administration, and clients get answers cited to law in seconds. The attorney always remains agent of record.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {PRO_FIRM_STATS.map((s) => (
                  <div
                    key={s.key}
                    data-testid={`card-pro-firm-stat-${s.key}`}
                    className="p-7 rounded-2xl bg-[#141414] border border-[#2a2a2a]"
                  >
                    <div
                      className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
                      style={{ color: COBALT }}
                    >
                      {s.stat}
                    </div>
                    <div className="text-sm font-semibold text-[#f5f5f5] mb-3">{s.label}</div>
                    <p className="text-[#888] text-sm leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="p-7 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col">
                  <p
                    className="text-xs font-bold uppercase mb-3"
                    style={{ color: COBALT, letterSpacing: "0.12em" }}
                  >
                    The trigger moment
                  </p>
                  <p className="text-[#c9c9c9] text-base leading-relaxed">
                    A client engages the firm on a new brand, product line or acquisition — and asks whether the name is clear to use and register.
                  </p>
                  <p className="text-[#888] text-sm leading-relaxed mt-4">
                    That question is where the orchestration layer starts working — and where the margin is won or lost.
                  </p>
                </div>
                {PRO_FIRM_SCENARIOS.map((sc) => (
                  <div
                    key={sc.key}
                    data-testid={`card-pro-firm-scenario-${sc.key}`}
                    className="p-7 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col"
                  >
                    <h4 className="text-base font-bold mb-3">{sc.title}</h4>
                    <p className="text-[#888] text-sm leading-relaxed flex-1">{sc.body}</p>
                    <p
                      className="text-sm leading-relaxed mt-4 pt-4 border-t border-[#2a2a2a]"
                      style={{ color: COBALT }}
                    >
                      {sc.result}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-7 rounded-2xl bg-[#141414] border border-[#2a2a2a] flex flex-col md:flex-row md:items-center gap-5 justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#f5f5f5] mb-1">Commercial fit — revenue share</p>
                  <p className="text-[#888] text-sm leading-relaxed max-w-2xl">
                    Firms earn on every filing routed through the engine, so pricing scales with matter volume rather than a fixed licence. Recurring monitoring and renewals build the annuity book on top.
                  </p>
                </div>
                <a
                  href="/quant/login"
                  data-testid="link-pro-firms-demo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-sm hover:bg-white transition-colors flex-shrink-0"
                >
                  Request a demo →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE MOSAIC — brand narrative + States of Brand Success ── */}
      <MosaicSection />

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 md:py-36 px-6 border-t border-[#2a2a2a]">
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-14">
            <SectionLabel>Questions, answered</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Everything you need to know.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="divide-y divide-[#2a2a2a] border-t border-b border-[#2a2a2a]">
              {FAQ_ITEMS.map((item, i) => (
                <details key={item.q} className="group py-5" data-testid={`faq-item-${i}`}>
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none text-left">
                    <h3 className="text-base md:text-lg font-semibold text-[#f5f5f5] leading-snug">
                      {item.q}
                    </h3>
                    <span
                      className="mt-1 flex-shrink-0 text-xl leading-none transition-transform duration-300 group-open:rotate-45"
                      style={{ color: COBALT }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-[#888] text-sm md:text-base leading-relaxed mt-4 max-w-2xl">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
