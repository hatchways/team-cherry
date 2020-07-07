const { DataTypes } = require("sequelize");
const db = require("../db");

const Mention = db.define("Mention", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  platform: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  popularity: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Mention;
