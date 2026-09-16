import { useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { HexMark } from "@/components/scaurus-logos";
import { BRAND_FONT, SCAURUS_ACCENT as COBALT } from "@/lib/brand-tokens";

const ENGINES = [
  {
    letter: "P",
    name: "SCAURUS Pro",
    line: "Build, clear, and file IP rights with AI-native precision.",
    href: "#pro",
  },
  {
    letter: "Q",
    name: "SCAURUS Quant",
    line: "Portfolio intelligence. Valuation. Risk. On demand.",
    href: "#quant",
  },
  {
    letter: "D",
    name: "SCAURUS Digital",
    line: "Domain, web, and brand signal surveillance — live.",
    href: "#digital",
  },
];

interface Particle {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  cobalt: boolean;
}

function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    const seeded = (n: number) => {
      const x = Math.sin(n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 48 }, (_, i) => ({
      left: seeded(i + 1) * 100,
      top: seeded(i + 101) * 100,
      size: 1 + seeded(i + 201) * 2.5,
      delay: seeded(i + 301) * 6,
      duration: 5 + seeded(i + 401) * 6,
      cobalt: seeded(i + 501) > 0.72,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float-dot"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.cobalt ? COBALT : "rgba(245,245,245,0.5)",
            opacity: p.cobalt ? 0.65 : 0.35,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ThreeEnginesIntro() {
  const [played, setPlayed] = useState(false);
  const [cardsShown, setCardsShown] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setCardsShown(true);
      },
      { threshold: 0.15 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const handlePlay = () => {
    setPlayed(true);
    setCardsShown(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-[#f5f5f5] overflow-hidden border-t border-[#1a1a1a]"
      style={{ fontFamily: BRAND_FONT }}
      aria-label="SCAURUS intro — three engines, one source of truth"
    >
      {/* ── Cinematic intro panel ── */}
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 md:min-h-[80vh] lg:px-8">
        <ParticleField />

        {/* Play intro pill — top centre */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f5f5f5] text-black text-sm font-semibold hover:bg-white transition-colors"
            data-testid="button-play-intro"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Play intro
          </button>
        </div>

        {/* Animated three-line statement */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <p
            className={`text-xs md:text-sm font-bold uppercase mb-6 transition-all ease-out duration-1000 ${
              played ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ color: COBALT, letterSpacing: "0.32em", transitionDelay: "0ms" }}
            data-testid="text-intro-line-1"
          >
            THREE ENGINES
          </p>
          <h2
            className={`text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05] transition-all ease-out duration-1000 ${
              played ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
            style={{ transitionDelay: played ? "800ms" : "0ms" }}
            data-testid="text-intro-line-2"
          >
            One source of truth.
          </h2>
          <p
            className={`text-xs md:text-sm font-bold uppercase mt-6 transition-all ease-out duration-1000 ${
              played ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ color: "#888", letterSpacing: "0.32em", transitionDelay: played ? "1300ms" : "0ms" }}
            data-testid="text-intro-line-3"
          >
            NEXT GEN IP INFRASTRUCTURE
          </p>
        </div>

        {!played && (
          <p className="relative z-10 mt-10 text-sm text-[#666]">
            Press play to see how SCAURUS fits together.
          </p>
        )}
      </div>

      {/* ── The three engines resolve into cards ── */}
      <div className="relative pb-28 md:pb-36">
        <div ref={cardsRef} className="scaurus-shell grid grid-cols-1 gap-6 md:grid-cols-3">
          {ENGINES.map((e, i) => (
            <a
              key={e.letter}
              href={e.href}
              data-testid={`card-engine-${e.letter.toLowerCase()}`}
              className={`group flex flex-col h-full p-8 rounded-2xl bg-[#111113] border border-[#2a2a2a] hover:border-[#444] transition-all duration-700 ease-out ${
                cardsShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: cardsShown ? `${i * 140}ms` : "0ms" }}
            >
              <HexMark letter={e.letter} size={56} className="mb-6 transition-transform duration-500 group-hover:scale-105" />
              <div className="text-xl font-bold mb-3">{e.name}</div>
              <p className="text-[#888] text-sm leading-relaxed flex-1">{e.line}</p>
              <div
                className="mt-6 text-sm font-medium inline-flex items-center gap-1.5"
                style={{ color: COBALT }}
              >
                Explore
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
