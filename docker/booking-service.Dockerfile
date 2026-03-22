FROM node:18

WORKDIR /app

COPY booking-service/package*.json ./
RUN npm install

COPY booking-service/ .

EXPOSE 3003

CMD ["node", "src/index.js"]