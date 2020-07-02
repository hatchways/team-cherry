const redditCrawler = require("./redditCrawler");

async function scrapeReddit(companyName, countOfPagesToScrape) {
  await redditCrawler.initialize();
  let results = await redditCrawler.getResults(
    companyName,
    countOfPagesToScrape
  );
  return results;
}

module.exports = { scrapeReddit };
