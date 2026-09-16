import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ListboxProps = {
  id?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  "data-testid"?: string;
};

type MenuBox = { top: number; left: number; width: number };

function positionMenu(button: HTMLElement, menu: HTMLElement): MenuBox {
  const rect = button.getBoundingClientRect();
  const pad = 8;
  const gap = 4;
  const maxHeight = 280;
  const width = rect.width;
  const left = Math.min(
    Math.max(pad, rect.left),
    Math.max(pad, window.innerWidth - width - pad),
  );
  const menuHeight = Math.min(menu.scrollHeight, maxHeight);
  const spaceBelow = window.innerHeight - rect.bottom - pad;
  const spaceAbove = rect.top - pad;
  const openUp = spaceBelow < Math.min(160, menuHeight) && spaceAbove > spaceBelow;
  const top = openUp
    ? Math.max(pad, rect.top - menuHeight - gap)
    : rect.bottom + gap;
  return { top, left, width };
}

export function Listbox({
  id,
  value,
  options,
  onChange,
  placeholder = "Select...",
  required,
  className,
  "data-testid": testId,
}: ListboxProps) {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listId = `${buttonId}-list`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value)));
  const [menuBox, setMenuBox] = useState<MenuBox | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setMenuBox(null);
      return;
    }

    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;

    setActiveIndex((index) => {
      const selected = options.indexOf(value);
      return selected >= 0 ? selected : index;
    });
    setMenuBox(positionMenu(button, menu));

    const onReposition = (event: Event) => {
      if (menu.contains(event.target as Node)) return;
      setMenuBox(positionMenu(button, menu));
    };
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, options, value]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !menuBox) return;
    const menu = menuRef.current;
    const option = menu?.querySelector<HTMLElement>("[data-active=true]");
    if (!menu || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < menu.scrollTop) menu.scrollTop = top;
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  }, [open, activeIndex, menuBox]);

  const commit = (next: string) => {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus({ preventScroll: true });
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) commit(option);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className={cn(className, "flex items-center justify-between gap-3 text-left")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        data-testid={testId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onButtonKeyDown}
      >
        <span className={value ? "truncate" : "truncate text-[#555]"}>{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#666] transition-transform", open && "rotate-180")} />
      </button>
      {required && <input type="hidden" name={buttonId} value={value} required tabIndex={-1} />}
      {open && createPortal(
        <ul
          ref={menuRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={buttonId}
          aria-activedescendant={`${listId}-${activeIndex}`}
          data-testid={testId ? `${testId}-list` : undefined}
          className="fixed z-[110] max-h-[280px] overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#111113] py-1 shadow-2xl outline-none"
          style={{
            top: menuBox?.top ?? -9999,
            left: menuBox?.left ?? 0,
            width: menuBox?.width ?? buttonRef.current?.offsetWidth,
          }}
          onKeyDown={onMenuKeyDown}
        >
          {options.map((option, index) => {
            const selected = option === value;
            const active = index === activeIndex;
            return (
              <li
                key={option}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                data-active={active ? "true" : undefined}
                className={cn(
                  "cursor-pointer px-4 py-2.5 text-sm text-[#f5f5f5]",
                  selected && "bg-[#2D6AFF]/20",
                  active && "bg-white/10",
                  !selected && !active && "hover:bg-white/5",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(option)}
              >
                {option}
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </div>
  );
}
