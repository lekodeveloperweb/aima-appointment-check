FROM node:21-alpine

WORKDIR /app

ENV CHROME_PATH=/usr/bin/chromium

RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main
# RUN apt-get install -y chromium

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]
