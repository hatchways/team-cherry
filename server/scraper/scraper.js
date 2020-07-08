const { redditScraper, twitterScraper } = require("../crawlers");

module.exports = function ScraperManager() {
  this.run = async function run(companyName) {
    const date = new Date(Date.now());
    console.log(`Scraper is running: ${date.toString()} `);

    let results = [];

    const redditMentions = await redditScraper(companyName);
    const twitterMentions = await twitterScraper(companyName);

    results = results.concat(redditMentions, twitterMentions);

    return results;
  };
};
