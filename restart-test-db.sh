docker-compose -f /root/gpt-backend-test/docker-compose.yml down
rm -rf ./mongo-test
docker-compose -f /root/gpt-backend-test/docker-compose.yml up -d
