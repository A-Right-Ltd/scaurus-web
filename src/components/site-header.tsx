import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { ScaurusMark } from "@/components/scaurus-logos";
import { MobileNavSection, NavDropdown } from "@/components/nav-menu";
import { useSessionUser } from "@/hooks/use-session-user";
import { BRAND_FONT, SCAURUS_ACCENT } from "@/lib/brand-tokens";
import { PRODUCT_MENUS } from "@/lib/nav";
import { usePath } from "@/lib/router";
import { useTheme } from "@/lib/theme-provider";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const user = useSessionUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = usePath();
  const isDark = theme === "dark";
  const authHref = user ? "/quant/dashboard" : "/login";
  const authLabel = user ? "Dashboard" : "Sign in";

  return (
    <header
      className="sticky top-0 z-[60] border-b border-border/70 bg-background/90 backdrop-blur-md"
      style={{ fontFamily: BRAND_FONT }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 md:px-6">
        <a href="/" className="flex items-center gap-2.5 mr-2" data-testid="link-home-logo">
          <ScaurusMark size={28} dark={isDark} />
          <span className="text-sm font-extrabold tracking-[0.18em] text-foreground">SCAURUS</span>
        </a>

        <nav className="hidden md:flex items-center text-foreground/80">
          {PRODUCT_MENUS.map((menu) => (
            <NavDropdown key={menu.id} menu={menu} path={path} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            data-testid="button-theme-toggle"
            aria-label="Toggle colour mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href={authHref}
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border border-border text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-colors"
            data-testid="link-quant-login"
          >
            {authLabel}
          </a>
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground"
            onClick={() => setMobileOpen(true)}
            data-testid="button-mobile-menu"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-background text-foreground md:hidden">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <span className="text-sm font-extrabold tracking-[0.18em]">SCAURUS</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="h-9 w-9 inline-flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {PRODUCT_MENUS.map((menu) => (
            <MobileNavSection key={menu.id} menu={menu} onNavigate={() => setMobileOpen(false)} />
          ))}
          <div className="px-6 py-6">
            <a
              href={authHref}
              className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: SCAURUS_ACCENT }}
              onClick={() => setMobileOpen(false)}
            >
              {authLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
