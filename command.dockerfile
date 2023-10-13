FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
# RUN npm install -g npm@latest
RUN npm install
COPY ./dist/apps/inventory-command .
EXPOSE 3000
CMD ["node", "main.js"]

# docker tag command-app eduarandres/command-app:latest
# docker push eduarandres/command-app:latest