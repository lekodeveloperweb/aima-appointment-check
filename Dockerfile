FROM node:18.18.0

WORKDIR /app

ENV CHROME_PATH=/app/bin/google-chrome-stable

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]
