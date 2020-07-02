const { DataTypes } = require("sequelize");
const db = require("../db");

// Some things to consider
//      - Should the relationship be 1-N or M-N
//          -example: A resource mentions to companies of interest,
//                    would it be redundant to have that resource stored twice?
//                    Is it possible to have both companies point to that
//                    resource, without having to duplicate it?

const Mention = db.define("Mention", {
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
  // popularity is an interesting one, each platform defines this metric
  // differently, which makes storing it somewhat challenging. Might have to
  // implement a helper function that uses different strats in order to score
  // popularity depeneding on each platforms metric, What data type is stored is
  // up for discussion, but as a placeholder, we'll use String enums
  popularity: {
    type: DataTypes.ENUM,
    values: ["High", "Average", "Low"],
    defaultValue: "Average",
  },
});

module.exports = Mention;
