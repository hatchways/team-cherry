const callScraper = require("../scraper");
const { Mention, User } = require("../models");

// A rough draft of how new mentions would get pulled into the db
// without using an explicit /POST route as well as using
// a given user's credentials.
module.exports = async function asyncWorker() {
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
        [mention, isNew] = await Mention.findOrCreate({
          where: {
            title: m.title,
          },
          defaults: {
            title: m.title,
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
