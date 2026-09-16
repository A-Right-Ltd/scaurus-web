const EXACT_PATHS = ["/"] as const;
const PREFIXES = ["/intelligence"] as const;

export function isClientRoute(href: string): boolean {
  if (/^(https?:)?\/\//.test(href)) return false;
  const path = href.split("?")[0];
  if ((EXACT_PATHS as readonly string[]).includes(path)) return true;
  return PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
