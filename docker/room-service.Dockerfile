FROM node:18

WORKDIR /app

COPY room-service/package*.json ./
RUN npm install

COPY room-service/ .

EXPOSE 3002

CMD ["node", "src/index.js"]