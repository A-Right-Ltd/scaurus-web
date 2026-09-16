import { useEffect, useRef, useState, type ReactNode } from "react";
import { BRAND_FONT, SCAURUS_ACCENT as COBALT } from "@/lib/brand-tokens";

/* ── Reveal-on-scroll helper (self-contained) ─────────────────── */
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

/* ── Living mosaic field (monochrome + cobalt) ────────────────── */
function MosaicCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = cvRef.current;
    if (!wrap || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const R = 34;                    // hex radius (flat-top)
    const GAP = 0.9;                 // tile fill vs cell → leaves grout
    const hStep = R * 1.5;
    const vStep = R * Math.sqrt(3);
    const SQRT2 = Math.SQRT1_2;      // 0.7071 for 45° sweep projection

    let W = 0, H = 0, CX = 0, CY = 0, diag = 1;

    type Hex = {
      hx: number; hy: number; d: number; proj: number;
      tone: number; ph: number; delay: number; center: boolean;
    };
    let hexes: Hex[] = [];

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2; CY = H / 2;
      diag = Math.hypot(W, H);

      const cols = Math.ceil(W / hStep) + 2;
      const rows = Math.ceil(H / vStep) + 2;
      hexes = [];
      for (let ci = -1; ci <= cols; ci++) {
        for (let ri = -1; ri <= rows; ri++) {
          const hx = ci * hStep;
          const hy = ri * vStep + (Math.abs(ci) % 2 ? vStep / 2 : 0);
          const dx = hx - CX, dy = hy - CY;
          hexes.push({
            hx, hy,
            d: Math.hypot(dx, dy),
            proj: hx * SQRT2 + hy * SQRT2,
            tone: Math.random(),
            ph: Math.random() * Math.PI * 2,
            delay: Math.hypot(dx, dy) * 1.5 + Math.random() * 130,
            center: false,
          });
        }
      }
      hexes.sort((a, b) => a.d - b.d);
      hexes[0].center = true;
    };

    build();

    let mx = -9999, my = -9999;
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseleave", onLeave);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => build());
      ro.observe(wrap);
    }

    const easeBack = (t: number) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      const c1 = 1.35, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const hexPath = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    let raf = 0;
    let t0: number | null = null;

    const frame = (ts: number) => {
      if (t0 === null) t0 = ts;
      const el = ts - t0;

      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, W, H);

      // slow diagonal light sweep (loops)
      const period = 7600;
      const sweepPos = -diag * 0.2 + ((el % period) / period) * (diag * 1.4);
      const band = diag * 0.17;

      for (let k = 0; k < hexes.length; k++) {
        const h = hexes[k];
        const prog = Math.max(0, Math.min(1, (el - h.delay) / 640));
        const sc = easeBack(prog);
        if (sc <= 0.001) continue;
        const r = R * GAP * sc;

        const idle = Math.sin(el * 0.0009 + h.ph) * 0.5 + 0.5;                 // 0..1
        const sweep = Math.max(0, 1 - Math.abs(h.proj - sweepPos) / band);
        const sweepE = sweep * sweep;
        const hv = Math.max(0, 1 - Math.hypot(mx - h.hx, my - h.hy) / (R * 5));
        const hvE = hv * hv;

        if (h.center) {
          // cobalt anchor tile with soft glow
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const glow = ctx.createRadialGradient(h.hx, h.hy, 0, h.hx, h.hy, r * 3.4);
          glow.addColorStop(0, "rgba(60,110,235,0.30)");
          glow.addColorStop(1, "rgba(60,110,235,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(h.hx, h.hy, r * 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          hexPath(h.hx, h.hy, r);
          const gr = ctx.createRadialGradient(h.hx, h.hy, 0, h.hx, h.hy, r);
          gr.addColorStop(0, "rgba(158,192,255,0.98)");
          gr.addColorStop(0.5, "rgba(52,104,232,0.96)");
          gr.addColorStop(1, "rgba(22,46,124,0.96)");
          ctx.fillStyle = gr;
          ctx.fill();
          ctx.strokeStyle = "rgba(160,196,255,0.9)";
          ctx.lineWidth = 1.6;
          ctx.stroke();
          continue;
        }

        // greyscale base, brightened by idle + sweep + hover
        const light = 15 + h.tone * 11 + idle * 4 + sweepE * 30 + hvE * 42;
        const tint = Math.min(1, sweepE * 0.85 + hvE) * 0.8;                   // cobalt mix
        const rr = Math.round(light + (70 - light) * tint);
        const gg = Math.round(light + (120 - light) * tint);
        const bb = Math.round(light + (240 - light) * tint);

        hexPath(h.hx, h.hy, r);
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(150,180,240,${0.05 + sweepE * 0.35 + hvE * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mouseleave", onLeave);
      ro?.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={cvRef}
        className="block h-full w-full"
        style={{ cursor: "crosshair" }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ── States of Brand Success ──────────────────────────────────── */
const BRAND_STATES: { state: string; meaning: string; cap: string }[] = [
  { state: "Registered", meaning: "Your mark is on the register.", cap: "Pro · Filing Toolkits" },
  { state: "Cleared", meaning: "No conflicts block your path.", cap: "Pro · Clearance + Blueprints" },
  { state: "Specified", meaning: "Your goods & services are correctly defined.", cap: "Pro · Specification Builder" },
  { state: "Valued", meaning: "Your mark carries a quantified monetary asset value.", cap: "Quant · Sonar Valuation" },
  { state: "Monitored", meaning: "Threats are being watched in real time.", cap: "Digital · Brand Watch" },
  { state: "Verified", meaning: "Your mark is VMC / BIMI eligible.", cap: "Digital · VMC Registry" },
  { state: "Scored", meaning: "Your IP Risk Score is assessed and tracked.", cap: "Quant · Risk Scoring" },
  { state: "Mapped", meaning: "Your portfolio gaps are identified.", cap: "Quant · Gap Analysis" },
  { state: "Covered", meaning: "Your geographic exposure is closed.", cap: "Quant · Firm View" },
  { state: "Enforced", meaning: "You are prepared to defend what is yours.", cap: "Pro · Case Law Reasoning" },
  { state: "Permanent", meaning: "Your title is cryptographically attested.", cap: "Brand Passport · A Right Protocol" },
];

const ROUTES = ["SCAURUS Pro", "SCAURUS Quant", "SCAURUS Digital", "VMC Registry", "Brand Passport"];

const HEX_CLIP = "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0% 50%)";

export default function MosaicSection() {
  return (
    <section
      id="mosaic"
      className="relative bg-[#050505] border-t border-[#2a2a2a] overflow-hidden"
      style={{ fontFamily: BRAND_FONT }}
    >
      {/* ── Manifesto over live mosaic ── */}
      <div className="relative">
        <div className="absolute inset-0">
          <MosaicCanvas />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 78% 68% at 50% 50%, rgba(4,4,4,0.9) 0%, rgba(4,4,4,0.78) 38%, rgba(4,4,4,0.42) 72%, rgba(4,4,4,0.12) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 md:py-48 text-center">
          <Reveal>
            <SectionLabel>The Mosaic</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.04]">
              Your brand is your SCAURUS.
            </h2>
            <p className="mt-8 text-lg text-[#bbb] max-w-2xl mx-auto leading-relaxed">
              SCAURUS is named after <span className="text-[#f5f5f5] font-semibold">Aulus Umbricius
              Scaurus</span> — a merchant in Roman Pompeii who turned his name into a brand. He sold
              garum, the empire's most prized fish sauce, and he understood something modern: a
              product is only as valuable as the mark attached to it.
            </p>
            <p className="mt-5 text-lg text-[#888] max-w-2xl mx-auto leading-relaxed">
              So he built his brand in mosaic. The floors of his house were laid with his branded
              jars, labelled <span className="italic text-[#aaa]">GARI FLOS SCAURI</span> — "the
              flower of garum, made by Scaurus." His mark travelled on amphorae found across the
              Roman world, from Gaul to the frontier. Two thousand years later the mosaics remain —
              and so does the name.
            </p>
            <p className="mt-5 text-lg text-[#888] max-w-2xl mx-auto leading-relaxed">
              Your brand is your SCAURUS. Not a logo — a legal claim encoded into commerce. The
              moment your mark enters the register, it becomes tessera: a piece of something
              permanent.
            </p>

            <div className="mt-9 flex flex-wrap justify-center items-center gap-x-2.5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777]">
              {["Registered", "Cleared", "Specified", "Valued", "Monitored", "Verified", "Enforced", "Permanent"].map(
                (w, i, arr) => (
                  <span key={w} className="flex items-center gap-2.5">
                    <span>{w}</span>
                    {i < arr.length - 1 && (
                      <span style={{ color: COBALT }} aria-hidden="true">
                        ·
                      </span>
                    )}
                  </span>
                ),
              )}
            </div>

            <a
              href="/login"
              data-testid="link-build-mosaic"
              className="mt-11 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-sm hover:bg-white transition-colors"
            >
              Start building your mosaic →
            </a>
          </Reveal>
        </div>
      </div>

      {/* ── States of Brand Success ── */}
      <div className="relative z-10 border-t border-[#2a2a2a] bg-[#050505] py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-3xl mb-14">
            <SectionLabel>States of Brand Success</SectionLabel>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.1]">
              Every tessera is a dimension of your mark — measured, protected, or proven.
            </h3>
            <p className="mt-5 text-[#888] text-base leading-relaxed">
              A mosaic is never made of one tile. Incomplete mosaics invite imitation; complete
              mosaics invite respect. SCAURUS measures where you are, identifies what is missing,
              and closes the gap.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_STATES.map((s, i) => (
              <Reveal key={s.state} delay={i * 40}>
                <div className="h-full p-6 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-[10px] font-extrabold text-[#0a0a0a]"
                      style={{ backgroundColor: COBALT, clipPath: HEX_CLIP }}
                    >
                      {i + 1}
                    </span>
                    <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-[#f5f5f5]">
                      {s.state}
                    </h4>
                  </div>
                  <p className="text-[#999] text-sm leading-relaxed mb-4">{s.meaning}</p>
                  <p className="text-xs font-semibold" style={{ color: COBALT }}>
                    {s.cap}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── One data lake. Five routes. One mark. ── */}
          <Reveal delay={120}>
            <div className="mt-16 p-10 md:p-12 rounded-2xl bg-[#0d0d0d] border border-[#2a2a2a] text-center">
              <p className="text-2xl md:text-3xl font-extrabold tracking-tight">
                One data lake. Five routes. One mark.
              </p>
              <p className="mt-4 text-[#888] text-base leading-relaxed max-w-2xl mx-auto">
                Every route serves the same goal — completing the mosaic. Charged in{" "}
                <strong className="text-[#f5f5f5]">Particles</strong>, purchased in{" "}
                <strong className="text-[#f5f5f5]">Quants</strong>: you buy exactly the tile you
                are placing, when you need it.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                {ROUTES.map((r) => (
                  <span
                    key={r}
                    className="px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#141414] text-[#ccc] text-xs font-semibold tracking-wide"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
