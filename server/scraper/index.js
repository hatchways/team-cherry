const ScraperManager = require("./scraper");
const scraper = new ScraperManager();

module.exports = async function callScraper(companyName) {
  let data = await scraper.run(companyName);
  return data;
};
