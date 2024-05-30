# ========== BUILD ==========

FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# ========== HOST ==========

FROM nginx:stable-alpine
RUN apk update && apk add bash

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /app/dist
WORKDIR /app/dist
COPY ./container .
RUN ["chmod", "+x", "./start.sh"]

EXPOSE 80
CMD ["bash", "start.sh"]