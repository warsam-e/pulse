
FROM oven/bun:1 AS base
WORKDIR /pulse

FROM base AS install
RUN mkdir -p /temp/pulse
COPY . /temp/pulse/
RUN cd /temp/pulse && bun install --frozen-lockfile && bun run build:server

FROM base AS final
COPY --from=install /temp/pulse/dist/server ./server
RUN rm -rf /temp/pulse

USER bun
ENV NODE_ENV=production
EXPOSE 3000/tcp
ENTRYPOINT [ "./server" ]
