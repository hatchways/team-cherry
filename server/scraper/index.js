const Scraper = require("./scraper");
const scraper = new Scraper();

module.exports = function callScraper() {
  // dudd function that would be calling the actual scraper;
  // import this into /server/bin/www and setInterval to periodically scrape
  scraper.run();
};
