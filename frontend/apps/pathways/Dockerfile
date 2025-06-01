FROM node:20.12.2-alpine3.19 AS base

FROM base as builder

RUN apk update
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
RUN pnpm install turbo@2.3.0 --global

COPY . .

RUN turbo prune pathways --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json .
RUN npm install -g pnpm@latest
RUN pnpm install

COPY --from=builder /app/out/full .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/pathways/.next/standalone .
COPY --from=installer --chown=nextjs:nodejs /app/apps/pathways/public ./apps/pathways/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/pathways/.next/static ./apps/pathways/.next/static

# CMD node apps/pathways/.next/standalone/server/index.js
CMD node apps/pathways/server.js
