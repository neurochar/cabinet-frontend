# syntax=docker/dockerfile:1.7-labs
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:${NODE_VERSION}-slim AS prod-deps
WORKDIR /app

COPY --from=build /app/.output/server/package*.json ./.output/server/
RUN cd .output/server && \
    npm install --omit=dev --ignore-scripts --no-audit --no-fund && \
    npm cache clean --force

FROM node:${NODE_VERSION}-slim AS package
WORKDIR /app

COPY --from=build /app/.output ./.output
RUN rm -rf ./.output/server/node_modules
COPY --from=prod-deps /app/.output/server/node_modules ./.output/server/node_modules

FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=package /app/.output ./.output

USER node
CMD ["node", ".output/server/index.mjs"]