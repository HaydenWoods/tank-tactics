FROM node:16

WORKDIR /var/bot

RUN npm -g i typescript
RUN npm -g i ts-node

ADD . .

RUN yarn 

CMD [ "ts-node", "-r", "tsconfig-paths/register", "./src/index.ts" ]