import { useEffect, useRef, useState } from "react";
import { Crosshair, Radar, ShieldAlert, GitBranch } from "lucide-react";

const BRAND_FONT = "'Outfit', sans-serif";
const COBALT = "oklch(0.6 0.2 250)";

const KEYFRAMES = `
@keyframes rtx-scan {
  0%   { transform: translateY(-110%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(560%); opacity: 0; }
}
@keyframes rtx-pulse {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
}
@keyframes rtx-bar {
  0%   { width: 0; }
  60%  { width: var(--rtx-w); }
  100% { width: var(--rtx-w); }
}
@keyframes rtx-flick {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}
@keyframes rtx-link {
  0%   { stroke-dashoffset: 120; opacity: 0; }
  40%  { opacity: 0.9; }
  100% { stroke-dashoffset: 0; opacity: 0.9; }
}
`;

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Respects the user's reduced-motion preference. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/** Looping count-up that runs only while on screen; static when motion is reduced. */
function useLoopCount(
  target: number,
  active: boolean,
  reduced: boolean,
  duration = 2200,
) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reduced) {
      setVal(target);
      return;
    }
    if (!active) return;
    let raf = 0;
    let start = 0;
    let cancelled = false;
    const run = () => {
      start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    run();
    const loop = setInterval(run, duration + 2600);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearInterval(loop);
    };
  }, [target, active, duration]);
  return val;
}

const SIGNALS = [
  "Filing velocity",
  "Opposition history",
  "CT-log domains",
  "Earnings intent",
  "Nice-class gaps",
  "Litigiousness score",
];

const VULNS: { label: string; pct: number }[] = [
  { label: "Opposition exposure", pct: 78 },
  { label: "Lookalike domains live", pct: 64 },
  { label: "Unprotected class adjacencies", pct: 52 },
  { label: "Hostile expansion pressure", pct: 41 },
];

const VECTORS: {
  icon: typeof Crosshair;
  title: string;
  desc: string;
  level: number;
  sev: string;
}[] = [
  {
    icon: Crosshair,
    title: "Opposition Ambush",
    desc: "Adversaries with aggressive enforcement histories filing in your classes — scored before they oppose.",
    level: 82,
    sev: "Critical",
  },
  {
    icon: Radar,
    title: "Lookalike Domains",
    desc: "CT-log and registration velocity surfacing impersonation infrastructure going live before the marks appear.",
    level: 67,
    sev: "High",
  },
  {
    icon: GitBranch,
    title: "Coverage Gaps",
    desc: "Unprotected adjacencies a competitor can walk straight into — mapped against their existing footprint.",
    level: 54,
    sev: "Elevated",
  },
  {
    icon: ShieldAlert,
    title: "Hostile Expansion",
    desc: "Filing-pattern detection flagging competitors moving toward your territory 18 months before they arrive.",
    level: 73,
    sev: "High",
  },
];

export default function RedTeamEngine() {
  const { ref, inView } = useInView(0.15);
  const reduced = useReducedMotion();
  const motion = inView && !reduced;
  const exposure = useLoopCount(42, inView, reduced); // £4.2M, shown as £{n/10}M
  const findings = useLoopCount(37, inView, reduced);

  return (
    <section
      ref={ref}
      id="engine"
      className="py-28 md:py-36 px-6 border-t border-[#2a2a2a] bg-[#070707] relative overflow-hidden"
      style={{ fontFamily: BRAND_FONT }}
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* ── Narrative ── */}
        <div
          className={`transition-all duration-1000 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p
            className="text-[11px] font-bold uppercase mb-6"
            style={{ color: COBALT, letterSpacing: "0.18em" }}
          >
            SCAURUS Engine · Red Team
          </p>
          <h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.08]"
            data-testid="text-engine-heading"
          >
            Offensive
            <br />
            Brand-Threat
            <br />
            Intelligence.
          </h2>
          <p className="text-[#888] text-base leading-relaxed mb-5">
            Most IP tools wait for the dispute. The SCAURUS Engine{" "}
            <strong className="text-[#f5f5f5]">red-teams your own portfolio</strong>{" "}
            — running the attack an opposing party would run, before they run it.
          </p>
          <p className="text-[#888] text-base leading-relaxed mb-5">
            A coordinated swarm decomposes your brand into atomic public signals —
            filing velocity, opposition history, CT-log domains, earnings intent,
            class gaps, litigiousness. Each signal is innocent on its own. The
            engine{" "}
            <strong className="text-[#f5f5f5]">recomposes them into the vulnerability</strong>{" "}
            a register lookup can never see.
          </p>
          <p className="text-[#888] text-base leading-relaxed mb-8">
            The classifier reads individual signals. The composition is the threat.
            SCAURUS surfaces it as a ranked, costed attack surface — continuously.
          </p>

          <div className="flex gap-8">
            <div data-testid="stat-engine-exposure">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                £{(exposure / 10).toFixed(1)}M
              </div>
              <div className="text-xs text-[#777] uppercase tracking-wider mt-1">
                Exposure surfaced
              </div>
            </div>
            <div className="w-px bg-[#2a2a2a]" />
            <div data-testid="stat-engine-findings">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {findings}
              </div>
              <div className="text-xs text-[#777] uppercase tracking-wider mt-1">
                Vulnerabilities found
              </div>
            </div>
          </div>
        </div>

        {/* ── Live red-team scan panel ── */}
        <div
          className={`transition-all duration-1000 ease-out delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="rounded-2xl bg-[#0e0e0e] border border-[#2a2a2a] overflow-hidden shadow-2xl">
            {/* header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2a2a2a] bg-[#111113]">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: COBALT,
                  animation: motion ? "rtx-flick 1.4s ease-in-out infinite" : "none",
                }}
              />
              <span className="text-xs font-semibold text-[#aaa] tracking-wide">
                red-team / scan
              </span>
              <span className="ml-auto text-[10px] font-mono text-[#666] uppercase tracking-widest">
                live
              </span>
            </div>

            {/* signal scan grid */}
            <div className="relative px-5 py-6">
              {/* scan sweep */}
              {motion && (
                <div
                  className="pointer-events-none absolute left-0 right-0 h-16 z-10"
                  style={{
                    top: 0,
                    background: `linear-gradient(180deg, transparent, ${COBALT}22 45%, ${COBALT}66 50%, ${COBALT}22 55%, transparent)`,
                    animation: "rtx-scan 3.4s linear infinite",
                  }}
                />
              )}
              <p className="text-[10px] font-bold uppercase text-[#666] tracking-widest mb-3">
                Decomposing signals
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {SIGNALS.map((s, i) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#161616] border border-[#262626]"
                    style={{
                      animation: motion
                        ? `rtx-pulse 2.4s ease-in-out ${i * 0.28}s infinite`
                        : "none",
                    }}
                    data-testid={`chip-signal-${i}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: COBALT }}
                    />
                    <span className="text-xs text-[#bbb] truncate">{s}</span>
                  </div>
                ))}
              </div>

              {/* recomposition arrow */}
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-[#2a2a2a]" />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: COBALT }}
                >
                  Recompose ↓
                </span>
                <div className="h-px flex-1 bg-[#2a2a2a]" />
              </div>

              {/* vulnerability readout */}
              <div className="rounded-xl bg-[#111113] border border-[#262626] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f5f5f5]">
                    Vulnerability surfaced
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                    style={{ color: COBALT, borderColor: `${COBALT}55` }}
                  >
                    Ranked
                  </span>
                </div>
                <div className="space-y-3">
                  {VULNS.map((v, i) => (
                    <div key={v.label} data-testid={`bar-vuln-${i}`}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#999]">{v.label}</span>
                        <span className="text-[#777] font-mono">{v.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#222] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={
                            {
                              background: `linear-gradient(90deg, ${COBALT}, #f5f5f5)`,
                              "--rtx-w": `${v.pct}%`,
                              width: inView ? `${v.pct}%` : 0,
                              animation: motion
                                ? `rtx-bar 3s ease-out ${0.3 + i * 0.25}s infinite`
                                : "none",
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Attack vectors ── */}
      <div className="max-w-6xl mx-auto mt-20">
        <p
          className={`text-[11px] font-bold uppercase mb-6 transition-opacity duration-1000 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
          style={{ color: COBALT, letterSpacing: "0.18em" }}
        >
          Attack vectors modelled
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VECTORS.map((v, i) => (
            <div
              key={v.title}
              data-testid={`card-vector-${i}`}
              className={`p-6 rounded-2xl bg-[#111113] border border-[#262626] transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <v.icon className="w-5 h-5" style={{ color: COBALT }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#333] text-[#999]"
                >
                  {v.sev}
                </span>
              </div>
              <h3 className="text-base font-bold mb-2 text-[#f5f5f5]">{v.title}</h3>
              <p className="text-[#888] text-xs leading-relaxed mb-4">{v.desc}</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-[#222] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={
                      {
                        background: `linear-gradient(90deg, ${COBALT}, #f5f5f5)`,
                        "--rtx-w": `${v.level}%`,
                        width: inView ? `${v.level}%` : 0,
                        animation: motion
                          ? `rtx-bar 3.2s ease-out ${0.4 + i * 0.2}s infinite`
                          : "none",
                      } as React.CSSProperties
                    }
                  />
                </div>
                <span className="text-[11px] font-mono text-[#777] w-9 text-right">
                  {v.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
