FROM node:alpine AS builder
WORKDIR /usr/app/
COPY package.json ./
COPY prisma ./prisma/ 
RUN npm install
RUN npx prisma generate

FROM node:alpine AS development
RUN apk update && apk add --no-cache python3
WORKDIR /usr/app
COPY package.json ./
RUN npm install

COPY . .

CMD sh -c "npx prisma generate && npx prisma db push && npx tsx app.ts"

FROM node:alpine AS production
WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/prisma ./prisma
COPY --from=builder /usr/app/generated ./generated 
COPY prisma.config.ts .

COPY controllers ./controllers
COPY routes ./routes
COPY services ./services
COPY repositories ./repositories
COPY utils ./utils
COPY types ./types
COPY app.ts .

RUN mkdir -p /usr/app/uploads

ENV PRISMA_QUERY_ENGINE_LIBRARY=/usr/app/node_modules/@prisma/client/runtime/libquery_engine-linux-musl.so.node

CMD sh -c "if [ \"$(find prisma/migrations -mindepth 1 -maxdepth 1 -type d | wc -l)\" -gt 0 ]; then npx prisma migrate deploy; else npx prisma db push; fi && npx tsx app.ts"