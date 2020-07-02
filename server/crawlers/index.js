const redditCrawler = require("./redditCrawler");

async function scrapeReddit(companyName, countOfPagesToScrape) {
  return await redditCrawler(companyName, countOfPagesToScrape);
}

module.exports = { scrapeReddit };
