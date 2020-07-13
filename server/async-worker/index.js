const callScraper = require("../scraper");
const { Mention, Company } = require("../models");
const User = require("../models/user");

module.exports = async function asyncWorker() {
  try {
    console.log("[Scraper] Calling async scraper");

    const companies = await Company.findAll();
    for (let company of companies) {
      let mentions = await callScraper(company.name);

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
  } catch (error) {
    console.error(error)
  }

};
