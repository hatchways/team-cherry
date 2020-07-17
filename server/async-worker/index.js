const callScraper = require("../scraper");
const { Mention, Company } = require("../models");
const User = require("../models/user");
const UserCompanies = require("../models/userCompanies");

module.exports = async function asyncWorker(io, loggedInUsers) {
  console.log("[Scraper] Calling async scraper");

  let newMentions = [];

  const companies = await Company.findAll();
  for (let company of companies) {
    let mentions = await callScraper(company.name);
    newMentions["" + company.id] = [];

    for (let m of mentions) {
      [mention, isNew] = await Mention.findOrCreate({
        where: {
          id: m.id,
        },
        defaults: {
          id: m.id,
          title: m.title,
          platform: m.platform,
          date: m.date,
          content: m.content,
          popularity: m.popularity,
          imageUrl: m.image,
        },
      });

      await company.addMention(mention);
    }

    console.log(`[Scraper] Finished adding mentions for ${company.name}`);
  }

};
