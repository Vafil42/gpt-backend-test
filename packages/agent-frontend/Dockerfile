from node:20 as build

workdir /home/node/app
copy package*.json ./
run npm install 
copy . .
run npm run build

from nginx:stable

workdir /var/www/html
copy --from=build /home/node/app/dist .

copy default.conf.template /etc/nginx/conf.d/
copy docker-entrypoint.sh /

expose 80

entrypoint ["/docker-entrypoint.sh"]
cmd ["nginx", "-g", "daemon off;"]

