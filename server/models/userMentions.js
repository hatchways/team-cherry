const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./user");
const Mention = require("./mention");

const UserMentions = db.define("UserMentions", {
  // extra auxilliliary attributes would be stored here
});

module.exports = UserMentions;
