FROM node:current-alpine as Bilder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build

FROM nginx:stable-alpine

RUN addgroup --gid 1001 app \
    && adduser -g "First Last,RoomNumber,WorkPhone,HomePhone" -u 1001 -D -G app app
USER app

COPY --from=Bilder --chown=app:app /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]