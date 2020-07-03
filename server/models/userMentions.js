const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./user");
const Mention = require("./mention");

const UserMentions = db.define("UserMentions", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  mentionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Mention,
      key: "id",
    },
  },
});

module.exports = UserMentions;
