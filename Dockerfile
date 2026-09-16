FROM node:24-bookworm-slim

RUN corepack enable && corepack prepare pnpm@10.30.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=development
EXPOSE 5175

CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0"]
