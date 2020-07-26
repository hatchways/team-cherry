const { redditCrawler, twitterCrawler } = require("../crawlers");

module.exports = function ScraperManager() {
  this.run = async function run(companyName) {
    const date = new Date(Date.now());
    let results = [];

    const redditMentions = await redditCrawler(companyName);
    // const twitterMentions = await twitterCrawler(companyName);
    const twitterMentions = [];
    results = results.concat(redditMentions, twitterMentions);

    return results;
  };
};
