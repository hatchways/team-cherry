const twitterCrawler = require("./twitterCrawler");
require("dotenv").config();

async function scrapeTwitter(companyName) {
  return await twitterCrawler(companyName);
}

async function test() {
  let results = await scrapeTwitter("HearthStone");
  console.log(results);
}
test();

module.exports = { scrapeTwitter };
