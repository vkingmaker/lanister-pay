const redis = require('redis');

const RedisClient = redis.createClient(6379);
RedisClient.on("error", (error) => {
	console.log("ERROR ------>", error);
});

module.exports =  RedisClient;