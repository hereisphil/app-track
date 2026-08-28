FROM node:lts-trixie-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:lts-trixie-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
ENV DATABASE_PATH=/data/app_track.sqlite
VOLUME /data
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
