const { DataTypes } = require("sequelize");
const db = require("../db");

const Company = db.define("Company", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Company;
