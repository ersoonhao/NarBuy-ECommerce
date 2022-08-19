# FROM node:10

FROM node:16
WORKDIR /usr/src/app


ENV CI=True
ENV PORT=8080
# COPY package.json .
COPY package*.json ./


RUN npm install

# Bundle app source
COPY . .

# RUN npm test

EXPOSE 8080
#https://we-are.bookmyshow.com/understanding-expose-in-dockerfile-266938b6a33d
CMD [ "node", "server.js" ]

