require("dotenv").config();

const UsersRoutes = require("./fcs");

const URL = `${process.env.APP_URL}`;
module.exports = (app) => {
  app.use(`${URL}`, UsersRoutes);
};