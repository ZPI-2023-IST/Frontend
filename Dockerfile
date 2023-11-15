# this dockerfile deploys for the development environment

FROM node:18-alpine

EXPOSE 3000

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
