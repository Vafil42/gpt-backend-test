from node:20-alpine as build

workdir /home/node/app
add package*.json ./
run npm install
add . .
run npm run build

from node:20-alpine

workdir /home/node/app
copy package*.json ./
run npm install --omit=dev
copy --from=build /home/node/app/dist ./dist
add ./.env .

expose 8080 27017
cmd ["node", "dist/src/main.js"]
