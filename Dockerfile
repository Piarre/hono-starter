FROM oven/bun:latest

WORKDIR /usr/src/app

COPY . .

RUN apt-get update -y && apt-get update -y

RUN bun install
RUN bun run build

EXPOSE 2025

ENTRYPOINT [ "bun", "run", "./dist/index.js" ]