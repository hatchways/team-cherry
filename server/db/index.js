const { Sequelize } = require("sequelize");

const dbName =
  process.env.NODE_ENV === "test"
    ? "test-db"
    : process.env.DB_NAME || "db name not set";

const db = new Sequelize(
  //   process.env.DB_NAME || "db name not set",
  dbName,
  process.env.DB_USERNAME || "postgres",
  process.env.DB_PASSWORD || "password",
  { host: "localhost", dialect: "postgres" }
);

module.exports = db;
