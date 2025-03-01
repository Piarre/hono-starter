FROM oven/bun:latest as base

WORKDIR /usr/src/install

FROM base as install

COPY package.json .
COPY bun.lockb .

RUN bun install

FROM base as build

COPY --from=install /usr/src/install/node_modules ./node_modules
COPY . .

RUN bun run build

FROM base as release

WORKDIR /usr/src/app

COPY --from=build /usr/src/install/dist ./dist

EXPOSE 2025

ENTRYPOINT [ "bun", "run", "./dist/index.js" ]