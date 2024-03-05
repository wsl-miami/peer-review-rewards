FROM node:18-alpine as builder
WORKDIR /app
# COPY package.json /app
COPY . .

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=8096

RUN npm i
# RUN npm run build

FROM nginx
# Create environment
ENV NODE_ENV production
EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
# CMD ["npm", "run", "start"]
