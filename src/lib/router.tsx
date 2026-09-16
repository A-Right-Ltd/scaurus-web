import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { isClientRoute } from "@/lib/spa-routes";

const PathContext = createContext("/");
const ParamsContext = createContext<Record<string, string>>({});

function matchPath(pattern: string | undefined, path: string): Record<string, string> | null {
  if (!pattern) return {};
  const keys: string[] = [];
  const regex = new RegExp(
    `^${pattern.replace(/:([^/]+)/g, (_, key: string) => {
      keys.push(key);
      return "([^/]+)";
    })}/?$`,
  );
  const match = path.match(regex);
  if (!match) return null;
  const params: Record<string, string> = {};
  keys.forEach((key, i) => {
    params[key] = decodeURIComponent(match[i + 1]);
  });
  return params;
}

export function navigate(to: string) {
  if (window.location.pathname === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
}

export function Switch({ children }: { children: ReactNode }) {
  const path = useContext(PathContext);
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (!child || typeof child !== "object" || !("props" in child)) continue;
    const pattern = (child as { props: { path?: string } }).props.path;
    const params = matchPath(pattern, path);
    if (params) {
      return <ParamsContext.Provider value={params}>{child}</ParamsContext.Provider>;
    }
  }
  return null;
}

export function Route({
  component: Component,
}: {
  path?: string;
  component: ComponentType;
}) {
  return <Component />;
}

export function Link({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    if (!isClientRoute(href)) {
      onClick?.();
      return;
    }
    event.preventDefault();
    onClick?.();
    navigate(href);
  };
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export function usePath() {
  return useContext(PathContext);
}

export function useParams<T extends Record<string, string | undefined>>() {
  return useContext(ParamsContext) as T;
}
