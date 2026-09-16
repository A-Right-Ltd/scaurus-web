import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart3, Shield, Brain, Search, ArrowRight } from "lucide-react";

const BRAND_FONT = "'Outfit', sans-serif";

const EASING_CUBIC = (t: number) => 1 - Math.pow(1 - t, 3);

const TIMING = {
  TYPING_SPEED: 25,
  TYPING_SPEED_FAST: 20,
  DELETE_SPEED: 15,
  PAUSE_BETWEEN_MESSAGES: 3000,
  PAUSE_AFTER_TYPING: 400,
  THINKING_DURATION: 1500,
  DONE_PAUSE: 500,
  CURSOR_BLINK: 530,
  COUNTUP_DURATION: 1400,
  BAR_GROW_DURATION: 1200,
  RISK_BAR_DURATION: 1000,
};

function useAnimationTrigger() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, triggered };
}

function useCountUp(target: number, duration: number, active: boolean, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf: number;
    let start: number | null = null;
    const delayTimeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        setValue(Math.round(EASING_CUBIC(progress) * target));
        if (progress < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    }, delay);
    return () => { clearTimeout(delayTimeout); cancelAnimationFrame(raf); };
  }, [active, target, duration, delay]);

  return value;
}

function useTypewriter(texts: string[], active: boolean, delay = 0, typingSpeed = 30, pauseBetween = 2500) {
  const [display, setDisplay] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setShowCursor(p => !p), TIMING.CURSOR_BLINK);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    let charIdx = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    const currentText = texts[textIndex];

    const delayTimeout = setTimeout(() => {
      const tick = () => {
        if (!isDeleting) {
          charIdx++;
          setDisplay(currentText.slice(0, charIdx));
          if (charIdx === currentText.length) {
            timeout = setTimeout(() => { isDeleting = true; tick(); }, pauseBetween);
            return;
          }
          timeout = setTimeout(tick, typingSpeed);
        } else {
          charIdx--;
          setDisplay(currentText.slice(0, charIdx));
          if (charIdx === 0) {
            setTextIndex(prev => (prev + 1) % texts.length);
            return;
          }
          timeout = setTimeout(tick, TIMING.DELETE_SPEED);
        }
      };
      tick();
    }, delay);

    return () => { clearTimeout(delayTimeout); clearTimeout(timeout); };
  }, [active, textIndex, texts, delay, typingSpeed, pauseBetween]);

  return { display, showCursor };
}

const CARD_BASE = "bg-white/[0.07] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)] hover:border-white/[0.14]";

function CardWrapper({ active, delay, children, className = "", testId }: { active: boolean; delay: number; children: React.ReactNode; className?: string; testId: string }) {
  return (
    <div
      className={`${CARD_BASE} ${className} ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: active ? `${delay}ms` : "0ms" }}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

const SIDEBAR_ITEMS = ["Upload", "Dashboard", "Risk Analysis", "Gap Analysis", "Brand Value", "Agent Analysis", "Report Builder"];

function AnimatedSidebar({ active, delay }: { active: boolean; delay: number }) {
  const [activeIdx, setActiveIdx] = useState(1);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % SIDEBAR_ITEMS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <CardWrapper active={active} delay={delay} testId="card-showcase-sidebar" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
          <BarChart3 className="w-3.5 h-3.5 text-white/60" />
        </div>
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>SCAURUS Quant</span>
      </div>
      <div className="space-y-1.5">
        {SIDEBAR_ITEMS.map((item, i) => (
          <div
            key={item}
            className={`text-xs px-3 py-2 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === activeIdx ? "bg-white/15 text-white font-medium" : "text-white/40"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}

const BAR_HEIGHTS = [65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70];

function AnimatedPortfolioOverview({ active, delay }: { active: boolean; delay: number }) {
  const marks = useCountUp(247, TIMING.COUNTUP_DURATION, active, delay + 200);
  const registered = useCountUp(142, TIMING.COUNTUP_DURATION, active, delay + 300);
  const pending = useCountUp(68, TIMING.COUNTUP_DURATION, active, delay + 400);
  const atRisk = useCountUp(37, TIMING.COUNTUP_DURATION, active, delay + 500);
  const [barScale, setBarScale] = useState(0);
  const [barShift, setBarShift] = useState(0);

  useEffect(() => {
    if (!active) return;
    let rafId: number;
    const growTimeout = setTimeout(() => {
      let start: number | null = null;
      const animate = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / TIMING.BAR_GROW_DURATION, 1);
        setBarScale(EASING_CUBIC(progress));
        if (progress < 1) rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    }, delay + 400);
    return () => { clearTimeout(growTimeout); cancelAnimationFrame(rafId); };
  }, [active, delay]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setBarShift(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [active]);

  const getBarHeight = useCallback((base: number, idx: number) => {
    const shift = Math.sin((barShift + idx) * 0.7) * 5;
    return Math.max(10, Math.min(100, base + shift)) * barScale;
  }, [barScale, barShift]);

  return (
    <CardWrapper active={active} delay={delay} testId="card-showcase-overview" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-semibold text-white/90" style={{ fontFamily: BRAND_FONT }}>Portfolio Overview</span>
        <span className="text-xs text-white/40" data-testid="text-showcase-marks">{marks} marks</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-xl font-bold text-white/90" data-testid="text-showcase-registered">{registered}</p>
          <p className="text-[11px] text-white/40 mt-0.5">Registered</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white/90" data-testid="text-showcase-pending">{pending}</p>
          <p className="text-[11px] text-white/40 mt-0.5">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white/90" data-testid="text-showcase-atrisk">{atRisk}</p>
          <p className="text-[11px] text-white/40 mt-0.5">At Risk</p>
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-white/20 rounded-sm transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ height: `${getBarHeight(h, i)}%` }}
          />
        ))}
      </div>
    </CardWrapper>
  );
}

const RISK_ITEMS = [
  { label: "Expiring within 6m", target: 12, barWidth: 35, barOpacity: "bg-white/40", testId: "text-showcase-expiring" },
  { label: "Non-use vulnerability", target: 8, barWidth: 22, barOpacity: "bg-white/30", testId: "text-showcase-nonuse" },
  { label: "Brexit risk flags", target: 5, barWidth: 14, barOpacity: "bg-white/20", testId: "text-showcase-brexit" },
];

function AnimatedRiskAnalysis({ active, delay }: { active: boolean; delay: number }) {
  const [barWidths, setBarWidths] = useState([0, 0, 0]);
  const [barShift, setBarShift] = useState(0);
  const val0 = useCountUp(RISK_ITEMS[0].target, TIMING.COUNTUP_DURATION, active, delay + 200);
  const val1 = useCountUp(RISK_ITEMS[1].target, TIMING.COUNTUP_DURATION, active, delay + 300);
  const val2 = useCountUp(RISK_ITEMS[2].target, TIMING.COUNTUP_DURATION, active, delay + 400);
  const vals = [val0, val1, val2];

  useEffect(() => {
    if (!active) return;
    const staggerDelays = [delay + 200, delay + 300, delay + 400];
    const rafIds: number[] = [];
    const timeouts = RISK_ITEMS.map((item, i) =>
      setTimeout(() => {
        let start: number | null = null;
        const animate = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / TIMING.RISK_BAR_DURATION, 1);
          setBarWidths(prev => {
            const next = [...prev];
            next[i] = EASING_CUBIC(progress) * item.barWidth;
            return next;
          });
          if (progress < 1) rafIds[i] = requestAnimationFrame(animate);
        };
        rafIds[i] = requestAnimationFrame(animate);
      }, staggerDelays[i])
    );
    return () => { timeouts.forEach(clearTimeout); rafIds.forEach(cancelAnimationFrame); };
  }, [active, delay]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setBarShift(p => p + 1), 4000);
    return () => clearInterval(interval);
  }, [active]);

  const getWidth = (base: number, idx: number) => {
    const shift = Math.sin((barShift + idx) * 1.1) * 3;
    return Math.max(5, Math.min(60, base + shift));
  };

  return (
    <CardWrapper active={active} delay={delay} testId="card-showcase-risk" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white/60" />
        </div>
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>Risk Analysis</span>
      </div>
      <div className="space-y-3">
        {RISK_ITEMS.map((item, i) => (
          <div key={item.label}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">{item.label}</span>
              <span className="text-xs font-semibold text-white/80" data-testid={item.testId}>{vals[i]}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className={`${item.barOpacity} h-1.5 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`} style={{ width: `${getWidth(barWidths[i], i)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}

const AUDIT_MESSAGES = [
  [
    { agent: "M", text: "Portfolio shows strong geographic coverage but 3 marks face renewal risk in the next 90 days." },
    { agent: "S", text: "Recommend prioritising Class 9 filings in APAC region to close coverage gaps." },
  ],
  [
    { agent: "M", text: "Detected 7 potential conflicts across EU Nice classifications. Similarity score above 0.85 threshold." },
    { agent: "S", text: "Suggest filing defensive marks in Classes 25 and 35 to strengthen brand perimeter." },
  ],
  [
    { agent: "M", text: "Non-use vulnerability identified for 4 marks inactive >3 years. Cancellation risk elevated." },
    { agent: "S", text: "Consider filing evidence of use or assigning marks to active subsidiaries." },
  ],
];

function AnimatedBrandAudit({ active, delay }: { active: boolean; delay: number }) {
  const [setIdx, setSetIdx] = useState(0);
  const [msg1, setMsg1] = useState("");
  const [msg2, setMsg2] = useState("");
  const [cursor1, setCursor1] = useState(true);
  const [cursor2, setCursor2] = useState(false);
  const [phase, setPhase] = useState<"idle" | "typing1" | "typing2" | "done">("idle");

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => setPhase("typing1"), delay + 300);
    return () => clearTimeout(timeout);
  }, [active, delay]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCursor1(p => !p);
      setCursor2(p => !p);
    }, TIMING.CURSOR_BLINK);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (phase === "idle") return;

    const messages = AUDIT_MESSAGES[setIdx];
    let timeout: ReturnType<typeof setTimeout>;
    let charIdx = 0;

    if (phase === "typing1") {
      setMsg1("");
      setMsg2("");
      const tick = () => {
        charIdx++;
        setMsg1(messages[0].text.slice(0, charIdx));
        if (charIdx < messages[0].text.length) {
          timeout = setTimeout(tick, TIMING.TYPING_SPEED);
        } else {
          timeout = setTimeout(() => { setPhase("typing2"); }, TIMING.PAUSE_AFTER_TYPING);
        }
      };
      tick();
    } else if (phase === "typing2") {
      charIdx = 0;
      const tick = () => {
        charIdx++;
        setMsg2(messages[1].text.slice(0, charIdx));
        if (charIdx < messages[1].text.length) {
          timeout = setTimeout(tick, TIMING.TYPING_SPEED);
        } else {
          timeout = setTimeout(() => { setPhase("done"); }, TIMING.PAUSE_BETWEEN_MESSAGES);
        }
      };
      tick();
    } else if (phase === "done") {
      timeout = setTimeout(() => {
        setSetIdx(prev => (prev + 1) % AUDIT_MESSAGES.length);
        setPhase("typing1");
      }, TIMING.DONE_PAUSE);
    }

    return () => clearTimeout(timeout);
  }, [phase, setIdx]);

  const messages = AUDIT_MESSAGES[setIdx];

  return (
    <CardWrapper active={active} delay={delay} testId="card-showcase-audit" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-white/60" />
        </div>
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>Brand Health Audit</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60 font-bold flex-shrink-0 mt-0.5">{messages[0].agent}</div>
          <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 min-h-[32px]">
            <p className="text-xs text-white/60 leading-snug">
              {msg1}
              {phase === "typing1" && <span className={`inline-block w-0.5 h-3 bg-white/50 ml-0.5 align-middle ${cursor1 ? "opacity-100" : "opacity-0"}`} />}
            </p>
          </div>
        </div>
        {(msg2 || phase === "typing2") && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60 font-bold flex-shrink-0 mt-0.5">{messages[1].agent}</div>
            <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 min-h-[32px]">
              <p className="text-xs text-white/60 leading-snug">
                {msg2}
                {phase === "typing2" && <span className={`inline-block w-0.5 h-3 bg-white/50 ml-0.5 align-middle ${cursor2 ? "opacity-100" : "opacity-0"}`} />}
              </p>
            </div>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}

const AI_QA_PAIRS = [
  {
    query: "Which marks expire in the next 12 months across EU jurisdictions?",
    response: "Found 23 marks across 8 EU jurisdictions expiring by March 2027. 7 are high-priority Class 9 registrations.",
  },
  {
    query: "Show me all pending applications with opposition risk above 70%",
    response: "Identified 5 pending applications with elevated opposition risk. 3 in Nice Class 25, 2 in Class 35. Recommend proactive monitoring.",
  },
  {
    query: "What is our brand coverage gap in Southeast Asia?",
    response: "Coverage gaps detected in 4 ASEAN markets: Vietnam, Thailand, Philippines, Indonesia. 12 core marks unregistered in these jurisdictions.",
  },
];

function AnimatedAIAssistant({ active, delay }: { active: boolean; delay: number }) {
  const [pairIdx, setPairIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing-query" | "thinking" | "typing-response" | "done">("idle");
  const [queryText, setQueryText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => setPhase("typing-query"), delay + 500);
    return () => clearTimeout(timeout);
  }, [active, delay]);

  useEffect(() => {
    if (phase !== "thinking") return;
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setDots(".".repeat(count));
    }, 400);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "idle") return;

    const pair = AI_QA_PAIRS[pairIdx];
    let timeout: ReturnType<typeof setTimeout>;
    let charIdx = 0;

    if (phase === "typing-query") {
      setQueryText("");
      setResponseText("");
      const tick = () => {
        charIdx++;
        setQueryText(pair.query.slice(0, charIdx));
        if (charIdx < pair.query.length) {
          timeout = setTimeout(tick, TIMING.TYPING_SPEED);
        } else {
          timeout = setTimeout(() => setPhase("thinking"), TIMING.PAUSE_AFTER_TYPING);
        }
      };
      tick();
    } else if (phase === "thinking") {
      timeout = setTimeout(() => setPhase("typing-response"), TIMING.THINKING_DURATION);
    } else if (phase === "typing-response") {
      charIdx = 0;
      const tick = () => {
        charIdx++;
        setResponseText(pair.response.slice(0, charIdx));
        if (charIdx < pair.response.length) {
          timeout = setTimeout(tick, TIMING.TYPING_SPEED_FAST);
        } else {
          timeout = setTimeout(() => setPhase("done"), TIMING.PAUSE_BETWEEN_MESSAGES);
        }
      };
      tick();
    } else if (phase === "done") {
      timeout = setTimeout(() => {
        setPairIdx(prev => (prev + 1) % AI_QA_PAIRS.length);
        setPhase("typing-query");
      }, TIMING.DONE_PAUSE);
    }

    return () => clearTimeout(timeout);
  }, [phase, pairIdx]);

  return (
    <CardWrapper active={active} delay={delay} testId="card-showcase-ai" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
          <Search className="w-3.5 h-3.5 text-white/60" />
        </div>
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>AI Assistant</span>
      </div>
      <div className="bg-white/5 rounded-lg px-3 py-2.5 mb-2.5 min-h-[40px]">
        <p className="text-xs text-white/40">
          {queryText || "Ask anything about your portfolio..."}
          {phase === "typing-query" && <span className="inline-block w-0.5 h-3 bg-white/50 ml-0.5 align-middle animate-pulse" />}
        </p>
      </div>
      {phase === "thinking" && (
        <div className="bg-white/5 rounded-lg px-3 py-2.5 mb-2.5">
          <p className="text-xs text-white/30">Analysing{dots}</p>
        </div>
      )}
      {(phase === "typing-response" || phase === "done") && responseText && (
        <div className="bg-white/5 rounded-lg px-3 py-2.5 mb-2.5">
          <p className="text-xs text-white/60 leading-snug">
            {responseText}
            {phase === "typing-response" && <span className="inline-block w-0.5 h-3 bg-white/50 ml-0.5 align-middle animate-pulse" />}
          </p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/5 rounded-full px-3 py-2">
          <p className="text-[11px] text-white/30">Ask anything about your portfolio...</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
          <ArrowRight className="w-3 h-3 text-white/50" />
        </div>
      </div>
    </CardWrapper>
  );
}

export default function AnimatedShowcase() {
  const { ref, triggered } = useAnimationTrigger();

  return (
    <div ref={ref} className="hidden md:block">
      <div className="grid grid-cols-3 gap-5 mb-5" data-testid="showcase-top-row">
        <AnimatedSidebar active={triggered} delay={0} />
        <AnimatedPortfolioOverview active={triggered} delay={100} />
        <AnimatedRiskAnalysis active={triggered} delay={200} />
      </div>
      <div className="grid grid-cols-2 gap-5 max-w-[66%] mx-auto" data-testid="showcase-bottom-row">
        <AnimatedBrandAudit active={triggered} delay={300} />
        <AnimatedAIAssistant active={triggered} delay={400} />
      </div>
    </div>
  );
}

export function AnimatedShowcaseMobile() {
  const { ref, triggered } = useAnimationTrigger();
  const marks = useCountUp(247, TIMING.COUNTUP_DURATION, triggered, 200);
  const registered = useCountUp(142, TIMING.COUNTUP_DURATION, triggered, 300);
  const pending = useCountUp(68, TIMING.COUNTUP_DURATION, triggered, 400);
  const atRisk = useCountUp(37, TIMING.COUNTUP_DURATION, triggered, 500);
  const [barScale, setBarScale] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let rafId: number;
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const animate = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / TIMING.BAR_GROW_DURATION, 1);
        setBarScale(EASING_CUBIC(progress));
        if (progress < 1) rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    }, 300);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [triggered]);

  const auditTexts = useMemo(() => AUDIT_MESSAGES.map(set => set[0].text), []);
  const aiQueryTexts = useMemo(() => AI_QA_PAIRS.map(p => p.query), []);

  const auditTypewriter = useTypewriter(
    auditTexts,
    triggered,
    600,
    25,
    3000
  );

  const aiQueryTypewriter = useTypewriter(
    aiQueryTexts,
    triggered,
    900,
    30,
    3000
  );

  return (
    <div ref={ref} className="md:hidden grid grid-cols-1 gap-4">
      <CardWrapper active={triggered} delay={0} testId="card-showcase-overview-mobile" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white/90" style={{ fontFamily: BRAND_FONT }}>Portfolio Overview</span>
          <span className="text-[10px] text-white/40">{marks} marks</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white/90">{registered}</p>
            <p className="text-[9px] text-white/40 mt-0.5">Registered</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white/90">{pending}</p>
            <p className="text-[9px] text-white/40 mt-0.5">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white/90">{atRisk}</p>
            <p className="text-[9px] text-white/40 mt-0.5">At Risk</p>
          </div>
        </div>
        <div className="flex items-end gap-1 h-16">
          {BAR_HEIGHTS.map((h, i) => (
            <div key={i} className="flex-1 bg-white/20 rounded-sm transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ height: `${h * barScale}%` }} />
          ))}
        </div>
      </CardWrapper>

      <CardWrapper active={triggered} delay={100} testId="card-showcase-risk-mobile" className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-3 h-3 text-white/60" />
          <span className="text-xs font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>Risk</span>
        </div>
        <div className="space-y-2">
          {RISK_ITEMS.slice(0, 2).map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">{item.label.split(" ")[0]}</span>
                <span className="text-[10px] font-semibold text-white/80">{item.target}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className={`${item.barOpacity} h-1.5 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`} style={{ width: triggered ? `${item.barWidth}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>

      <CardWrapper active={triggered} delay={200} testId="card-showcase-ai-mobile" className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-3 h-3 text-white/60" />
          <span className="text-xs font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>AI Query</span>
        </div>
        <div className="bg-white/5 rounded-lg px-2.5 py-2">
          <p className="text-[10px] text-white/40">
            {aiQueryTypewriter.display || "Ask anything..."}
            {aiQueryTypewriter.showCursor && <span className="inline-block w-0.5 h-2.5 bg-white/50 ml-0.5 align-middle" />}
          </p>
        </div>
      </CardWrapper>

      <CardWrapper active={triggered} delay={300} testId="card-showcase-audit-mobile" className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-3 h-3 text-white/60" />
          <span className="text-xs font-semibold text-white/80" style={{ fontFamily: BRAND_FONT }}>Brand Health Audit</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white/60 font-bold">M</div>
            <div className="flex-1 bg-white/5 rounded-lg px-2.5 py-1.5">
              <p className="text-[10px] text-white/60 leading-snug">
                {auditTypewriter.display}
                {auditTypewriter.showCursor && <span className="inline-block w-0.5 h-2.5 bg-white/50 ml-0.5 align-middle" />}
              </p>
            </div>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}
