const User = require("./user");
const Mention = require("./mention");
const Company = require("./Company");
const CompanyMentions = require("./companyMentions");
const UserCompanies = require("./userCompanies");
const UserMentions = require("./userMentions");

// create database associations
User.belongsToMany(Company, { through: UserCompanies });
Company.belongsToMany(User, { through: UserCompanies });

User.belongsToMany(Mention, { through: UserMentions });
Mention.belongsToMany(User, { through: UserMentions });

// this might be necessary for when you are fetching from
// the UserMentions through table explicity, but you require attributes
// from the Mention model instance itself or vice versa. Such is the case for building an endpoint
// where the user can grab all the liked mentions. Similarly,
// When fetching all of a company's mentions we can include the UserMentions through table
// in order to obtain whether or not a given mention was liked
Mention.hasMany(UserMentions);
UserMentions.belongsTo(Mention);

Mention.belongsToMany(Company, { through: CompanyMentions });
Company.belongsToMany(Mention, { through: CompanyMentions });

module.exports = {
  User,
  Mention,
  UserMentions,
  CompanyMentions,
  Company,
};
