require("dotenv").config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const origin = `${process.env.CORS_ORIGIN}` !== "undefined" ? `${process.env.CORS_ORIGIN}` : "*";

app.use(function(_, res, next) {
  res.header("Access-Control-Allow-Origin", `${origin}`);
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, authorization, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PATCH, PUT");
  next();
});

require('./server/routes');

module.exports = app;