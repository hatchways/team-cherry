const Scraper = require("./scraper");
const scraper = new Scraper();

module.exports = function callScraper(companyName, pagesToScrape) {
  // dudd function that would be calling the actual scraper;
  // import this into /server/bin/www and setInterval to periodically scrape
  let data = scraper.run(companyName, pagesToScrape);
  return data;
};
