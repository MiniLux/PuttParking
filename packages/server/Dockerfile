FROM node:20-slim
RUN corepack enable
WORKDIR /app

# Copy workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy package.json files for dependency resolution
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/

# Install all dependencies (tsx needed at runtime)
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/shared/ packages/shared/
COPY packages/server/ packages/server/

ENV NODE_ENV=production
ENV PORT=2567
EXPOSE 2567

CMD ["pnpm", "--filter", "@putt-parking/server", "exec", "tsx", "src/index.ts"]
