import { useState, useEffect, useRef } from "react";
import { Target, Mic, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgentSwarmCanvas from "@/components/agent-swarm-canvas";
import AnimatedShowcase, { AnimatedShowcaseMobile } from "@/components/animated-showcase";
import ScaurusSections from "@/components/scaurus-sections";
import ThreeEnginesIntro from "@/components/three-engines-intro";
import { ScaurusMark } from "@/components/scaurus-logos";
import LeadCaptureModal from "@/components/lead-capture-modal";
import { BRAND_FONT, SCAURUS_ACCENT } from "@/lib/brand-tokens";

const PHRASES = ["AI first for IP"];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsRevealed(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isRevealed };
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [formMode, setFormMode] = useState<"demo" | "waitlist">("demo");

  const showcase = useScrollReveal();
  const finalCta = useScrollReveal();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentPhrase = PHRASES[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        setDisplayText(currentPhrase.slice(0, charIndex));

        if (charIndex === currentPhrase.length) {
          timeout = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 2000);
          return;
        }
        timeout = setTimeout(tick, 50);
      } else {
        charIndex--;
        setDisplayText(currentPhrase.slice(0, charIndex));

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
          timeout = setTimeout(tick, 300);
          return;
        }
        timeout = setTimeout(tick, 30);
      }
    };

    timeout = setTimeout(tick, 500);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearTimeout(timeout);
      clearInterval(cursorInterval);
    };
  }, [isVisible]);

  const handleBarClick = () => {
    setFormMode("demo");
    setShowDemoForm(true);
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-background">
      <main>
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-[0.03]">
          <AgentSwarmCanvas brandLetter="S" />
        </div>

        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl w-full">
          <div
            id="logo-container"
            className={`relative mb-8 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <ScaurusMark size={64} dark={true} />
                <span
                  className="text-5xl md:text-7xl font-extrabold tracking-tight text-white select-none"
                  style={{ fontFamily: BRAND_FONT, letterSpacing: "0.04em" }}
                  data-testid="text-coming-soon-logo"
                >
                  SCAURUS
                </span>
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: SCAURUS_ACCENT }}>The operating layer for intellectual property</p>
            </div>
          </div>

          <div className="space-y-6 w-full">
            <h1
              className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ fontFamily: BRAND_FONT }}
            >
              Next-gen AI-native infrastructure for intellectual property
            </h1>

            <p
              className={`text-base md:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              Intellectual property will define the next era of enterprise value. SCAURUS is the AI-native system built to value it, protect it, and prove it.
            </p>

            <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <button
                type="button"
                className="relative w-full bg-neutral-800 rounded-[28px] shadow-2xl shadow-black/20 cursor-pointer max-w-xl mx-auto block"
                onClick={handleBarClick}
                aria-label="AI first for IP — book a SCAURUS demo"
                data-testid="bar-early-access"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center flex-shrink-0 hover:border-neutral-400 transition-colors">
                    <Target className="w-4 h-4 text-neutral-400" />
                  </div>

                  <div className="flex-1 relative min-h-[28px] flex items-center">
                    <span className="text-neutral-500 text-base pointer-events-none select-none">
                      {displayText}
                      <span
                        className={`inline-block w-0.5 h-5 bg-neutral-500 ml-0.5 align-middle transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`}
                      />
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Mic className="w-5 h-5 text-neutral-500" />
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: SCAURUS_ACCENT }}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setFormMode("demo"); setShowDemoForm(true); }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
                data-testid="button-book-demo"
              >
                <Calendar className="w-4 h-4" />
                Book a demo
              </button>

            </div>
          </div>
        </div>
      </section>

      <ThreeEnginesIntro />

      <section className="relative bg-gradient-to-b from-[#111113] via-[#1a1a1a] to-[#111113] text-white overflow-hidden py-28 md:py-36">
        <div ref={showcase.ref} className={`max-w-6xl mx-auto px-6 transition-all duration-1000 relative z-10 ${showcase.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-500 font-medium mb-6">Inside SCAURUS Quant</p>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: BRAND_FONT }}
              data-testid="text-showcase-heading"
            >
              The Analytics Engine
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto">
              Portfolio intelligence, powered by AI.
            </p>
          </div>

          <AnimatedShowcase />
          <AnimatedShowcaseMobile />
        </div>
      </section>

      <ScaurusSections />
      </main>

      <footer className="bg-[#0a0a0a] text-[#f5f5f5] py-28 md:py-36 border-t border-[#2a2a2a]" style={{ fontFamily: BRAND_FONT }}>
        <div ref={finalCta.ref} className={`max-w-3xl mx-auto px-6 text-center transition-all duration-1000 ${finalCta.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="flex justify-center mb-8">
            <ScaurusMark size={48} dark />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Start with SCAURUS.
          </h2>
          <p className="text-[#888] text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            One platform. Three engines. Every IP signal you need — continuous, connected, and yours.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <Button
              onClick={() => { setFormMode("demo"); setShowDemoForm(true); }}
              className="bg-[#f5f5f5] text-[#0a0a0a] hover:bg-white font-semibold rounded-xl px-6 py-3 text-sm"
              style={{ fontFamily: BRAND_FONT }}
              data-testid="button-final-cta-try"
            >
              Try SCAURUS →
            </Button>
            <Button
              variant="outline"
              onClick={() => { setFormMode("demo"); setShowDemoForm(true); }}
              className="border-[#2a2a2a] text-[#f5f5f5] font-semibold rounded-xl bg-transparent hover:bg-[#1a1a1a]"
              style={{ fontFamily: BRAND_FONT }}
              data-testid="button-final-cta-demo"
            >
              Book a Demo
            </Button>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-[#2a2a2a] text-[#f5f5f5] font-semibold rounded-xl hover:bg-[#1a1a1a] transition-colors text-sm"
              data-testid="button-final-cta-signin"
            >
              Sign in to the platform
            </a>
          </div>
          <p className="text-[#555] text-xs mt-12">
            &copy; 2026 A Right Ltd.
          </p>
        </div>
      </footer>

      <LeadCaptureModal
        open={showDemoForm}
        mode={formMode}
        onClose={() => setShowDemoForm(false)}
      />
    </div>
  );
}
