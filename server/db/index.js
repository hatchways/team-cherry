const { Sequelize } = require("sequelize");

const dbName =
  process.env.NODE_ENV === "test"
    ? "test-db"
    : "dngcenu1n502d";

const logging = true;

let sequelize = null;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    "dngcenu1n502d",
    "mikclidtuuqvwd",
    "f7193bbe1f29065476fdb33eb9440489a9fa61f997cc781741e76686d22d290d",
    { host: "ec2-18-235-109-97.compute-1.amazonaws.com", port: 5432, dialect: "postgres", logging }
  )
}
else {
  sequelize = new Sequelize(
    "postgres",
    "postgres",
    "11111111",
    { host: "localhost", dialect: "postgres", logging }
  )
}

module.exports = sequelize;
