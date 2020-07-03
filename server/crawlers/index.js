const redditCrawler = require("./redditCrawler");
require("dotenv").config();

async function scrapeReddit(companyName, countOfPagesToScrape) {
  return await redditCrawler(companyName, countOfPagesToScrape);
}

async function test() {
  let results = await scrapeReddit("", 1000);
  console.log(results);
}
test();

module.exports = { scrapeReddit };
