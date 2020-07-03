const User = require("./user");
const Mention = require("./mention");
const UserMentions = require("./userMentions");

// create database association(N-M) between users and mentions
Mention.belongsToMany(User, { through: UserMentions });
User.belongsToMany(Mention, { through: UserMentions });

module.exports = {
  User,
  Mention,
  UserMentions,
};
