FROM node:current-alpine3.9 AS Builder

LABEL maintainer="meijin007 AT gmail.com"

WORKDIR /app

ADD . /app

RUN npm install --silent \
    && npm run build

FROM node:current-alpine3.9 AS runner

RUN apk add sqlite

RUN addgroup --gid 1001 app \
    && adduser -g "First Last,RoomNumber,WorkPhone,HomePhone" -u 1001 -D -G app app
USER app

COPY --from=Builder --chown=app:app /app/lib/src /app/package.json /app/ormconfig.js /app/
# Copy configuration for production
COPY --from=Builder --chown=app:app /app/config/ /app/config/

RUN cd app \
    && npm install --silent

ENV NODE_ENV production
ENV PORT 1337

EXPOSE ${PORT}

CMD [ "node", "/app/app.js"]
