FROM oven/bun:1.3.13-slim

WORKDIR /app
COPY . /app

RUN bun install --frozen-lockfile

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

EXPOSE 3000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "--quiet", "--spider", "http://localhost:3000/health" ]

ENTRYPOINT [ "bun", "api:start" ]
