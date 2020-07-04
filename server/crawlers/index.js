const redditCrawler = require("./redditCrawler");
require("dotenv").config();

async function scrapeReddit(companyName) {
  return await redditCrawler(companyName);
}

async function test() {
  let results = await scrapeReddit("Twitter");
  console.log(results);
}
test();

module.exports = { scrapeReddit };
