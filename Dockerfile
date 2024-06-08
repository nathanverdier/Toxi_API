FROM node:latest
WORKDIR /app

EXPOSE 8081

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]