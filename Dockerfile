FROM oven/bun:latest

WORKDIR /pulse

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "api"]
