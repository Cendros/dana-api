FROM oven/bun:debian@sha256:dcc9626709c5737ce052a2244bb4edd869db6f023f8c94ecf6217e01976484f7

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY . .

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000