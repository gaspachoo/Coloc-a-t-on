FROM node:alpine AS builder

RUN apk update

WORKDIR /usr/app/
COPY package*.json ./
RUN npm install --omit=dev --loglevel=warn

FROM node:alpine AS development

RUN apk update && \
    apk add --no-cache python3

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

CMD sh -c "npx prisma generate && npx prisma migrate deploy && npx tsx app.ts"

FROM node:alpine AS production

RUN apk update && \
    apk add --no-cache python3

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/package-lock.json .
COPY controllers ./controllers
COPY routes ./routes
COPY services ./services
COPY repositories ./repositories
COPY app.ts .

CMD [ "node", "app.ts" ]
