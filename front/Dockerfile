FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe AS deps
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe AS development
WORKDIR /usr/app
COPY --from=deps /usr/app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]

FROM node@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe AS build
WORKDIR /usr/app
COPY --from=deps /usr/app/node_modules ./node_modules
COPY . .
ARG API_BACKEND_URL
ENV VITE_API_URL=${API_BACKEND_URL}
RUN npm run build

FROM nginx@sha256:5e36bd7a8adfe291560a6849d3125438fbe244f29a567522099caceef32bce54 AS production
COPY --from=build /usr/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
