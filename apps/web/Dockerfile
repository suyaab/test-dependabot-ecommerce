# https://turbo.build/repo/docs/handbook/deploying-with-docker

##########
# Base
##########
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

##########
# Builder
##########
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm add --global turbo@2.0.4
RUN turbo prune @ecommerce/web --docker

##########
# Installer
# Add lockfile and package.json's of isolated subworkspace
##########
FROM base AS installer
WORKDIR /app

ARG GIT_SHA
ARG CI=true
ARG LINGO_ENV
ARG ADOBE_DTM_SCRIPT
ARG BRAZE_WEB_KEY
ARG BRAZE_SDK_URL
ARG BRAZE_SUBSCRIPTION_SPECIAL_OFFERS
ARG BRAZE_SUBSCRIPTION_NEWS_CONTENT
ARG BRAZE_SUBSCRIPTION_PRODUCT_UPDATES
ARG NEXT_PUBLIC_ARVATO_RETURN_SCRIPT
ARG NEXT_PUBLIC_ARVATO_TRACKING_SCRIPT
ARG NEXT_PUBLIC_HARNESS_CLIENT_API_KEY
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
ARG HARNESS_SERVER_API_KEY
ARG REDIS_URL
ARG REDIS_ACCESS_KEY

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=@ecommerce/web...

##########
# Runner
##########
FROM base AS runner
WORKDIR /app

# install newrelic for standalone server
# https://github.com/newrelic/newrelic-node-nextjs/issues/69#issuecomment-1176098277
RUN pnpm i @newrelic/next

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/newrelic.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

CMD node -r @newrelic/next apps/web/server.js
