# platform needed to run image on linux server
FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
EXPOSE 5000
WORKDIR /app

CMD ["npm", "run", "start"]