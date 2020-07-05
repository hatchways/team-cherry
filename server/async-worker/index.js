const { Op } = require("sequelize");
const callScraper = require("../scraper");
const { Mention, User } = require("../models");

// A rough draft of how new mentions would get pulled into the db
// without using an explicit /POST route as well as using
// a given user's credentials.
module.exports = async function asyncWorker() {
  // TODO refactor this into smaller functions
  console.log("[Scraper] Calling async scraper");

  const users = await User.findAll();
  for (let user of users) {
    let mentions = await callScraper(user.company);
    let count = 0;

    for (let m of mentions) {
      let userMentions = await user.getMentions({
        where: {
          title: m.title,
        },
      });

      // if this is new
      if (!userMentions.length) {
        let col, val;
        // if this is a twitter mention
        if (m.platform == "Twitter") {
          col = "content";
          val = m.content;
        }
        // if this is a reddit mention
        else if (m.platform == "Reddit") {
          col = "title";
          val = m.title;
        }
        [mention, isNew] = await Mention.findOrCreate({
          where: {
            [col]: val,
          },
          defaults: {
            title: m.title || "",
            platform: m.platform,
            date: m.date * 1000, // convert unix timestamp
            content: m.content || "",
            popularity: m.popularity,
            imageUrl: m.image,
          },
        });

        user.addMention(mention);
        count++;
      }
    }

    console.log(
      `[Scraper] Finished adding ${count} mentions for ${user.company}`
    );
  }
};
