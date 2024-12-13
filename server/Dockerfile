FROM node:18

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api

COPY package*.json ./

RUN chown node:node package*.json

USER node

RUN npm install

COPY --chown=node:node . .

CMD ["npm", "start"]

EXPOSE 3000