const {
  redditCrawler,
  twitterCrawler,
  nytCrawler,
  newsApiCrawler,
} = require('../crawlers');

module.exports = function ScraperManager() {
  this.run = async function run(companyName) {
    const date = new Date(Date.now());
    console.log(`Scraper is running: ${date.toString()} `);

    let results = [];

    const redditMentions = await redditCrawler(companyName);
    // const twitterMentions = await twitterCrawler(companyName);
    const twitterMentions = [];
    const nytMentions = await nytCrawler(companyName);
    console.log('calling news api crawler');
    const newsApiMentions = await newsApiCrawler(companyName);
    console.log('finished newsApi crawler');
    results = results.concat(
      redditMentions,
      twitterMentions,
      nytMentions,
      newsApiMentions
    );
    return results;
  };
};
