FROM node:18-alpine
WORKDIR /app
COPY . .
# COPY package.json ./
RUN npm i
EXPOSE 5000
CMD ["npm", "run", "start"]