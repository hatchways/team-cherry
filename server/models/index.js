const User = require("./user");
const Mention = require("./mention");
const Company = require("./Company");
const CompanyMentions = require("./companyMentions");
const UserCompanies = require("./userCompanies");

// create database associations
User.belongsToMany(Company, { through: UserCompanies });
Company.belongsToMany(User, { through: UserCompanies });

Mention.belongsToMany(Company, { through: CompanyMentions });
Company.belongsToMany(Mention, { through: CompanyMentions });

module.exports = {
  User,
  Mention,
  CompanyMentions,
  Company,
};
