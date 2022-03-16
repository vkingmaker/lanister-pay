require("dotenv").config();
const express = require('express'),
			logger = require('morgan'),
			bodyParser = require('body-parser'),
			app = express();

const RedisClient = require('./lib/redis');

RedisClient.connect().then(() => console.log("Redis connected successfully!!"));

const origin = `${process.env.CORS_ORIGIN}` !== "undefined" ? `${process.env.CORS_ORIGIN}` : "*";

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(_, res, next) {
  res.header("Access-Control-Allow-Origin", `${origin}`);
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, authorization, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PATCH, PUT");
  next();
});

require('./server/routes')(app);

module.exports = app;