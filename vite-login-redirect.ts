type RedirectRequest = { url?: string };
type RedirectResponse = {
  statusCode: number;
  setHeader: (key: string, value: string) => void;
  end: () => void;
};

const PATH_ALIASES: Record<string, string> = {
  "/login": "/quant/login",
};

function redirectLogin(req: RedirectRequest, res: RedirectResponse, next: () => void) {
  const url = req.url?.split("?")[0] ?? "";
  const location = PATH_ALIASES[url];
  if (location) {
    res.statusCode = 302;
    res.setHeader("Location", location);
    res.end();
    return;
  }
  next();
}

export function loginRedirectPlugin() {
  return {
    name: "login-redirect",
    configureServer(server: { middlewares: { use: (fn: typeof redirectLogin) => void } }) {
      server.middlewares.use(redirectLogin);
    },
    configurePreviewServer(server: { middlewares: { use: (fn: typeof redirectLogin) => void } }) {
      server.middlewares.use(redirectLogin);
    },
  };
}
