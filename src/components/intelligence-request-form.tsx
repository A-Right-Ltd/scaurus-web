import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const fieldClass =
  "w-full px-3 py-2.5 border border-border rounded-lg text-sm text-foreground bg-background outline-none focus:border-[#2D6AFF] transition-colors";

export function IntelligenceRequestForm({
  title,
  description,
  source,
  submitInterest = submitAccountInterest,
}: {
  title: string;
  description: string;
  source: string;
  submitInterest?: (data: AccountInterestPayload) => Promise<unknown>;
}) {
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(emptyAccountInterestFields);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AccountInterestPayload) => submitInterest(data),
    onSuccess: () => {
      setError("");
      setSubmitted(true);
      qc.invalidateQueries({ queryKey: ["/api/quant/early-access/count"] });
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
    },
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center" style={{ fontFamily: BRAND_FONT }}>
        <p className="text-lg font-semibold text-foreground mb-2">Request received</p>
        <p className="text-sm text-muted-foreground">
          Thank you. The SCAURUS team will follow up with indicative patent intelligence for this request.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isAccountInterestComplete(form)) return;
        mutation.mutate({ ...form, source });
      }}
      className="rounded-2xl border border-border bg-card p-6 space-y-5"
      style={{ fontFamily: BRAND_FONT }}
    >
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">First Name *</label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={fieldClass}
            data-testid="input-intel-first-name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Last Name *</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={fieldClass}
            data-testid="input-intel-last-name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Work Email *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={fieldClass}
          data-testid="input-intel-email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Company website *</label>
        <input
          type="text"
          required
          value={form.companyWebsite}
          onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
          className={fieldClass}
          data-testid="input-intel-website"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Primary location *</label>
        <select
          required
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className={`${fieldClass} appearance-none cursor-pointer`}
          data-testid="select-intel-location"
        >
          <option value="">Select...</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Organisation type *</label>
        <select
          required
          value={form.orgType}
          onChange={(e) => setForm({ ...form, orgType: e.target.value })}
          className={`${fieldClass} appearance-none cursor-pointer`}
          data-testid="select-intel-org-type"
        >
          <option value="">Select...</option>
          {ORG_TYPES.map((org) => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Number of lawyers *</label>
        <input
          type="text"
          required
          value={form.numberOfLawyers}
          onChange={(e) => setForm({ ...form, numberOfLawyers: e.target.value })}
          className={fieldClass}
          data-testid="input-intel-lawyers"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">How did you hear about us? *</label>
        <select
          required
          value={form.hearAbout}
          onChange={(e) => setForm({ ...form, hearAbout: e.target.value })}
          className={`${fieldClass} appearance-none cursor-pointer`}
          data-testid="select-intel-hear-about"
        >
          <option value="">Select...</option>
          {HEAR_ABOUT.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-xs text-center">{error}</p>}

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-12 rounded-xl font-semibold text-sm text-white"
        style={{ backgroundColor: SCAURUS_ACCENT }}
        data-testid="button-submit-intel"
      >
        {mutation.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
        ) : (
          "Request intelligence"
        )}
      </Button>
    </form>
  );
}
