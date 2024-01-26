from node:20 as build

workdir /home/node/app
copy package*.json ./
run npm install 
copy . .
run npm run build

from nginx:stable

workdir /var/www/html
copy --from=build /home/node/app/dist .
copy ./nginx.conf /etc/nginx/conf.d/default.conf

expose 80

cmd ["nginx", "-g", "daemon off;"]

