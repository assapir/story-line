FROM node:current-alpine AS Builder

LABEL maintainer="meijin007 AT gmail.com"

WORKDIR /app

ADD . /app

RUN apk --no-cache add python build-base

RUN npm install --silent \
    && npm run build

FROM node:current-alpine AS runner

ENV NODE_ENV production

RUN apk --no-cache add sqlite

RUN addgroup --gid 1001 app \
    && adduser -g "First Last,RoomNumber,WorkPhone,HomePhone" -u 1001 -D -G app app
USER app

COPY --from=Builder --chown=app:app /app/lib/src /app/package.json /app/ormconfig.js /app/
# Copy configuration for production
COPY --from=Builder --chown=app:app /app/config/ /app/config/
COPY --from=Builder --chown=app:app /app/node_modules/ /app/node_modules/

RUN cd app \
    && npm install

ENV PORT 1337

EXPOSE ${PORT}

ENTRYPOINT [ "node", "/app/app.js"]
