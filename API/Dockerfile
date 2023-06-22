FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
EXPOSE 5432
EXPOSE 27017
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "dev"]
