FROM node:16
WORKDIR /app

EXPOSE 80

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]