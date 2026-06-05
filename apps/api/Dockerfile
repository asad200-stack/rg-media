FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/database/package.json packages/database/
COPY packages/database/prisma packages/database/prisma/

RUN npm ci

COPY apps/api apps/api
COPY packages/database packages/database
COPY scripts/start-api.sh scripts/start-api.sh

RUN npm run generate -w @rg-media/database
RUN npm run build -w @rg-media/database
RUN npm run build -w @rg-media/api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app /app
RUN chmod +x scripts/start-api.sh

EXPOSE 3001
CMD ["/bin/sh", "scripts/start-api.sh"]
