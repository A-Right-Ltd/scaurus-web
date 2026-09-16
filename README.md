# scaurus-web

Scaurus marketing shell for `scaurus.com`. Landing lives at `/`. Login and the
app are same-origin rewrites to Quant:

- `/quant/*` → `aittorney-quant-web`
- `/api/quant/*` → `aittorney-quant-api`

Brand after login is driven by `organisations.brand` on the Quant API.

## Setup

```bash
pnpm install
pnpm dev
# → http://localhost:5175/
```

Local `/api/quant/*` is proxied to `http://localhost:5001` (quant-api docker
host map). Override with `VITE_API_URL`. Local `/quant/*` is proxied to the
quant-web Vite server on `5173`.

Do not commit secrets; `.env` / `.env.local` are gitignored.
