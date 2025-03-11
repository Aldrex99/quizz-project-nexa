FROM node:22 AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start"]
