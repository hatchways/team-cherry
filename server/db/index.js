const { Sequelize } = require("sequelize");

const dbName =
  process.env.NODE_ENV === "test"
    ? "test-db"
    : process.env.DB_name || "db name not set";

const logging = false;

const sequelize = new Sequelize(
  dbName,
  process.env.DB_username || "postgres",
  process.env.DB_password || "password",
  { host: "localhost", dialect: "postgres", logging }
);

module.exports = sequelize;
