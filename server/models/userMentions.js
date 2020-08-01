const { DataTypes } = require('sequelize');
const db = require('../db');
const User = require('./user');
const Mention = require('./mention');

const UserMentions = db.define('UserMentions', {
  // model reference attributes
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  MentionId: {
    type: DataTypes.TEXT,
    references: {
      model: Mention,
      key: 'id',
    },
  },

  // other extra attributes
  liked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = UserMentions;
