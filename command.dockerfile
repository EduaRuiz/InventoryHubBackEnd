FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY ./dist/apps/inventory-hub-back-end .
EXPOSE 3000
CMD ["node", "main.js"]
