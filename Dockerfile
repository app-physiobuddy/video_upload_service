FROM node:lts-slim
WORKDIR /app


COPY package*.json ./
COPY src ./src

RUN npm install

EXPOSE ${APP_PORT}

CMD ["npm", "start"]