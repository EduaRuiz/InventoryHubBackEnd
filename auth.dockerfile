FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY ./dist/apps/inventory-auth .
EXPOSE 3003
CMD ["node", "main.js"]

# docker tag auth-app eduarandres/auth-app:latest
# docker push eduarandres/auth-app:latest