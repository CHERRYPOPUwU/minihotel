FROM node:18

WORKDIR /app

COPY api-gateway/package*.json ./
RUN npm install

COPY api-gateway/ .

EXPOSE 3000

CMD ["node", "src/index.js"]