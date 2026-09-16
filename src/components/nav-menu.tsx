import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/lib/router";
import { BRAND_FONT, SCAURUS_ACCENT } from "@/lib/brand-tokens";
import { navOpenAttrs, navTestId, type NavLink, type ProductMenu } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function NavItemAnchor({
  item,
  className,
  onNavigate,
}: {
  item: NavLink;
  className?: string;
  onNavigate?: () => void;
}) {
  const open = item.open ?? "same-tab";
  if (open === "spa") {
    return (
      <Link href={item.href} className={className} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className} {...navOpenAttrs(open)} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

export function NavDropdown({ menu, path }: { menu: ProductMenu; path: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = menu.isActive(path);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors"
        style={{ fontFamily: BRAND_FONT, color: active ? SCAURUS_ACCENT : undefined }}
        data-testid={navTestId(menu.label)}
      >
        {menu.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[220px] rounded-xl border border-border bg-background py-1.5 shadow-lg z-50">
          {menu.items.map((item) => (
            <NavItemAnchor
              key={item.href}
              item={item}
              className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
              onNavigate={() => setOpen(false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileNavSection({ menu, onNavigate }: { menu: ProductMenu; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold"
        style={{ fontFamily: BRAND_FONT }}
      >
        {menu.label}
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pb-3">
          {menu.items.map((item) => (
            <NavItemAnchor
              key={item.href}
              item={item}
              className="block px-8 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
