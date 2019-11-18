docker pull mongo:3.6.15
docker run --name mongo --restart=always -d -p 27017:27017 mongo mongod
#docker exec -i -t mongo bash
