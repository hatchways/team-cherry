const redditCrawler = require("./redditCrawler");
require("dotenv").config();

async function scrapeReddit(companyName, countOfPagesToScrape) {
  return await redditCrawler(companyName, countOfPagesToScrape);
}

async function test() {
  let results = await scrapeReddit("Twitter");
  console.log(results);
}
test();

module.exports = { scrapeReddit };
