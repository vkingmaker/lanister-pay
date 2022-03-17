const redis = require('redis');

const RedisClient = redis.createClient({
	url: process.env.REDISCLOUD_URL
}, {no_ready_check: true});

RedisClient.on("error", (error) => {
	console.log("ERROR ------>", error);
});

module.exports =  RedisClient;