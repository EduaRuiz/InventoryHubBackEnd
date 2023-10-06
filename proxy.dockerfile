FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY ./dist/apps/proxy .
EXPOSE 3001
CMD ["node", "main.js"]
