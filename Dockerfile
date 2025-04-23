FROM oven/bun:latest AS base

WORKDIR /usr/src/install

FROM base AS install

COPY package.json .
COPY bun.lockb .

RUN bun install

FROM base AS build

COPY --from=install /usr/src/install/node_modules ./node_modules
COPY . .

RUN bun run build

FROM base AS release

WORKDIR /usr/src/app

COPY --from=build /usr/src/install/dist ./dist

EXPOSE 2025

ENTRYPOINT [ "bun", "run", "./dist/index.js" ]