import { memo, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Calendar, CheckCircle2, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScaurusMark } from "@/components/scaurus-logos";
import { Listbox } from "@/components/ui/listbox";
import {
  emptyAccountInterestFields,
  isAccountInterestComplete,
  submitAccountInterest,
  type AccountInterestPayload,
} from "@/lib/account-interest";
import { BRAND_FONT, SCAURUS_ACCENT } from "@/lib/brand-tokens";

const LOCATIONS = [
  "United Kingdom", "United States", "European Union", "Germany", "France",
  "Spain", "Italy", "Netherlands", "Switzerland", "Australia", "Canada",
  "Japan", "China", "India", "Singapore", "Hong Kong", "UAE", "Other",
];

const ORG_TYPES = [
  "Law firm", "In-house legal team", "Brand owner", "IP consultancy",
  "Government / public sector", "Academic / research", "Other",
];

const HEAR_ABOUT = [
  "Word of mouth", "Press", "Podcast", "Outdoor advertising",
  "Social media", "Google / Search engine", "LinkedIn", "Other",
];

const DEMO_POINTS = [
  { title: "30 minutes", body: "A focused session, not a product tour." },
  { title: "Your portfolio", body: "We work from your marks, not a canned deck." },
  { title: "Three engines", body: "Quant, Digital, and Pro in one sitting." },
];

const fieldClass =
  "w-full bg-[#111113] border border-[#2a2a2a] text-[#f5f5f5] rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#555] focus:border-[#2D6AFF] focus:ring-1 focus:ring-[#2D6AFF]/40";

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888]">
        {label}
      </label>
      {children}
    </div>
  );
}

export interface LeadCaptureModalProps {
  open: boolean;
  mode: "demo" | "waitlist";
  onClose: () => void;
  source?: string;
}

function LeadCaptureModal({ open, mode, onClose, source }: LeadCaptureModalProps) {
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(emptyAccountInterestFields);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const formId = useId();
  const qc = useQueryClient();
  const isWaitlist = mode === "waitlist";
  const resolvedSource = source ?? (isWaitlist ? "waitlist" : "demo-booking");

  onCloseRef.current = onClose;

  const mutation = useMutation({
    mutationFn: (data: AccountInterestPayload) => submitAccountInterest(data),
    onSuccess: () => {
      setError("");
      qc.invalidateQueries({ queryKey: ["/api/quant/early-access/count"] });
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    if (!open) return;
    setError("");
    setSubmitted(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isAccountInterestComplete(form)) return;
    mutation.mutate(
      { ...form, source: resolvedSource },
      {
        onSuccess: () => {
          if (isWaitlist) {
            setSubmitted(true);
            return;
          }
          const params = new URLSearchParams({
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            a1: form.companyWebsite,
            a2: form.location,
            a3: form.orgType,
            a4: form.numberOfLawyers,
            a5: form.hearAbout,
          });
          window.open(`https://calendly.com/azhar-sonarsight/new-meeting?${params.toString()}`, "_blank");
          onClose();
        },
      },
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] text-[#f5f5f5]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-dialog-title"
      data-testid="dialog-demo"
      style={{ fontFamily: BRAND_FONT }}
    >
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 18% 40%, rgba(45,106,255,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex h-dvh flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5 md:px-8">
          <div className="flex items-center gap-2.5">
            <ScaurusMark size={26} dark />
            <span className="text-sm font-extrabold tracking-[0.18em]">SCAURUS</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#888] transition-colors hover:bg-white/5 hover:text-white"
            data-testid="button-close-demo"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-2">
          <aside className="relative hidden flex-col justify-center px-12 xl:px-20 lg:flex">
            <p
              className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em]"
              style={{ color: SCAURUS_ACCENT }}
            >
              {isWaitlist ? "Early access" : "Book a demo"}
            </p>
            <h2
              id="demo-dialog-title"
              className="max-w-md text-4xl font-extrabold tracking-tight leading-[1.08] xl:text-5xl"
            >
              {isWaitlist ? "Join the waiting list." : "See the operating layer live."}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#888]">
              {isWaitlist
                ? "Tell us who you are and we will be in touch when a place opens."
                : "A focused walkthrough of Quant, Digital, and Pro — on your marks, your risk, your valuation."}
            </p>
            {!isWaitlist && (
              <ul className="mt-12 max-w-md space-y-6">
                {DEMO_POINTS.map((point) => (
                  <li key={point.title} className="flex gap-4">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: SCAURUS_ACCENT }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#f5f5f5]">{point.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#777]">{point.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <section className="min-h-0 overflow-y-auto border-white/10 px-5 py-8 md:px-10 lg:border-l lg:px-12 lg:py-12">
            <div className="mx-auto w-full max-w-lg lg:ml-0">
              <div className="mb-8 lg:hidden">
                <p
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: SCAURUS_ACCENT }}
                >
                  {isWaitlist ? "Early access" : "Book a demo"}
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight leading-[1.1]">
                  {isWaitlist ? "Join the waiting list." : "See the operating layer live."}
                </h2>
              </div>

              {submitted ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center lg:min-h-0 lg:items-start lg:text-left">
                  <div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${SCAURUS_ACCENT}22` }}
                  >
                    <CheckCircle2 className="h-7 w-7" style={{ color: SCAURUS_ACCENT }} />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight">You are on the list.</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#888]">
                    Thank you. The SCAURUS team will review your details and be in touch shortly.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white"
                    style={{ backgroundColor: SCAURUS_ACCENT }}
                    data-testid="button-close-waitlist-thankyou"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field id={`${formId}-first`} label="First name *">
                      <input
                        ref={firstFieldRef}
                        id={`${formId}-first`}
                        type="text"
                        required
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className={fieldClass}
                        data-testid="input-demo-first-name"
                      />
                    </Field>
                    <Field id={`${formId}-last`} label="Last name *">
                      <input
                        id={`${formId}-last`}
                        type="text"
                        required
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className={fieldClass}
                        data-testid="input-demo-last-name"
                      />
                    </Field>
                  </div>

                  <Field id={`${formId}-email`} label="Work email *">
                    <input
                      id={`${formId}-email`}
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={fieldClass}
                      data-testid="input-demo-email"
                    />
                  </Field>

                  <Field id={`${formId}-website`} label="Company website *">
                    <input
                      id={`${formId}-website`}
                      type="text"
                      required
                      autoComplete="url"
                      placeholder="https://"
                      value={form.companyWebsite}
                      onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                      className={fieldClass}
                      data-testid="input-demo-website"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field id={`${formId}-location`} label="Primary location *">
                      <Listbox
                        id={`${formId}-location`}
                        required
                        value={form.location}
                        options={LOCATIONS}
                        onChange={(location) => setForm({ ...form, location })}
                        className={fieldClass}
                        data-testid="select-demo-location"
                      />
                    </Field>
                    <Field id={`${formId}-org`} label="Organisation type *">
                      <Listbox
                        id={`${formId}-org`}
                        required
                        value={form.orgType}
                        options={ORG_TYPES}
                        onChange={(orgType) => setForm({ ...form, orgType })}
                        className={fieldClass}
                        data-testid="select-demo-org-type"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field id={`${formId}-lawyers`} label="Number of lawyers *">
                      <input
                        id={`${formId}-lawyers`}
                        type="text"
                        required
                        inputMode="numeric"
                        value={form.numberOfLawyers}
                        onChange={(e) => setForm({ ...form, numberOfLawyers: e.target.value })}
                        className={fieldClass}
                        data-testid="input-demo-lawyers"
                      />
                    </Field>
                    <Field id={`${formId}-hear`} label="How did you hear about us? *">
                      <Listbox
                        id={`${formId}-hear`}
                        required
                        value={form.hearAbout}
                        options={HEAR_ABOUT}
                        onChange={(hearAbout) => setForm({ ...form, hearAbout })}
                        className={fieldClass}
                        data-testid="select-demo-hear-about"
                      />
                    </Field>
                  </div>

                  {error && (
                    <p className="text-center text-xs text-red-400">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: SCAURUS_ACCENT, height: "3.25rem" }}
                    data-testid="button-submit-demo"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : isWaitlist ? (
                      <>
                        <Calendar className="h-4 w-4" /> Join the waiting list
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" /> Continue to calendar
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#666]">
                    {isWaitlist
                      ? "We will only use this to follow up on your request."
                      : "You will be taken to a calendar to pick a time."}
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default memo(LeadCaptureModal);
