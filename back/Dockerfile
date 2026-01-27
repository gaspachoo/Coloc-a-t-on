FROM node:alpine AS builder
WORKDIR /usr/app/
COPY package.json ./
COPY prisma ./prisma/ 
RUN npm install && npx prisma generate

FROM node:alpine AS development
RUN apk update && apk add --no-cache python3
WORKDIR /usr/app
COPY package.json ./
RUN npm install

COPY . .

RUN npx prisma generate
CMD sh -c "npx prisma db push && npx tsx app.ts"

FROM node:alpine AS production
WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/prisma ./prisma
COPY --from=builder /usr/app/generated ./generated 

COPY controllers ./controllers
COPY routes ./routes
COPY services ./services
COPY repositories ./repositories
COPY app.ts .

ENV PRISMA_QUERY_ENGINE_LIBRARY=/usr/app/node_modules/@prisma/client/runtime/libquery_engine-linux-musl.so.node

CMD [ "node", "app.ts" ]