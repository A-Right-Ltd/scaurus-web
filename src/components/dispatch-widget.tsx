import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { BRAND_FONT, SCAURUS_ACCENT } from "@/lib/brand-tokens";

export function DispatchWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[80]" style={{ fontFamily: BRAND_FONT }}>
      {open && (
        <div
          className="mb-3 w-[min(100vw-2.5rem,22rem)] rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
          data-testid="panel-dispatch"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">Ask Dispatch</p>
              <p className="text-[11px] text-muted-foreground">SCAURUS AI layer</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted"
              aria-label="Close Dispatch"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="px-4 py-4 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dispatch is being configured for this demo. It will sit across Quant, Pro, and Patent Intelligence as the embedded assistant.
            </p>
            <input
              disabled
              placeholder="Ask Dispatch…"
              className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        style={{ backgroundColor: SCAURUS_ACCENT }}
        data-testid="button-ask-dispatch"
      >
        <MessageSquare className="w-4 h-4" />
        Ask Dispatch
      </button>
    </div>
  );
}
