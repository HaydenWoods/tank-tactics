FROM node:16

WORKDIR /var/bot

RUN npm -g i typescript
RUN npm -g i ts-node

ADD . .

RUN npm i 

CMD [ "ts-node", "-r", "tsconfig-paths/register", "./src/index.ts" ]