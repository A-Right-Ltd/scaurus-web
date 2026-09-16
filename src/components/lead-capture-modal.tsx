import { useState } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export interface LeadCaptureModalProps {
  open: boolean;
  mode: "demo" | "waitlist";
  onClose: () => void;
  source?: string;
}

export default function LeadCaptureModal({ open, mode, onClose, source }: LeadCaptureModalProps) {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyWebsite: "",
    location: "",
    orgType: "",
    numberOfLawyers: "",
    hearAbout: "",
  });
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/quant/account-interest", data);
      return res.json();
    },
    onSuccess: () => {
      setError("");
      qc.invalidateQueries({ queryKey: ["/api/quant/early-access/count"] });
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
    },
  });

  if (!open) return null;

  const resolvedSource = source ?? (mode === "waitlist" ? "waitlist" : "demo-booking");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="backdrop-demo"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">{mode === "waitlist" ? "Join the Waiting List" : "Book a Demo"}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors flex-shrink-0"
            data-testid="button-close-demo"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const allFilled = form.firstName && form.lastName && form.email && form.companyWebsite && form.location && form.orgType && form.numberOfLawyers && form.hearAbout;
            if (!allFilled) return;
            mutation.mutate({ ...form, source: resolvedSource }, {
              onSuccess: () => {
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
            });
          }}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">First Name *</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors"
                data-testid="input-demo-first-name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors"
                data-testid="input-demo-last-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1.5">Work Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors"
              data-testid="input-demo-email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1.5">Company website *</label>
            <input
              type="text"
              required
              value={form.companyWebsite}
              onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors"
              data-testid="input-demo-website"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1.5">Primary location *</label>
            <select
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors bg-white appearance-none cursor-pointer"
              data-testid="select-demo-location"
            >
              <option value="">Select...</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1.5">Organisation type *</label>
            <select
              required
              value={form.orgType}
              onChange={(e) => setForm({ ...form, orgType: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors bg-white appearance-none cursor-pointer"
              data-testid="select-demo-org-type"
            >
              <option value="">Select...</option>
              {ORG_TYPES.map((org) => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1.5">Number of lawyers *</label>
            <input
              type="text"
              required
              value={form.numberOfLawyers}
              onChange={(e) => setForm({ ...form, numberOfLawyers: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors"
              data-testid="input-demo-lawyers"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1.5">How did you hear about us? *</label>
            <select
              required
              value={form.hearAbout}
              onChange={(e) => setForm({ ...form, hearAbout: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm text-black outline-none focus:border-black transition-colors bg-white appearance-none cursor-pointer"
              data-testid="select-demo-hear-about"
            >
              <option value="">Select...</option>
              {HEAR_ABOUT.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-xs text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 bg-black text-white hover:bg-neutral-800 rounded-xl font-semibold text-sm transition-all duration-200"
            data-testid="button-submit-demo"
          >
            {mutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : mode === "waitlist" ? (
              <><Calendar className="w-4 h-4 mr-2" /> Join the Waiting List</>
            ) : (
              <><Calendar className="w-4 h-4 mr-2" /> Continue to Book</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
