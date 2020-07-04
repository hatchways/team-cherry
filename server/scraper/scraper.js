const { redditScraper, twitterScraper } = require("../crawlers");

module.exports = function ScraperManager() {
  this.run = async function run(companyName) {
    const date = new Date(Date.now());
    console.log(`Scraper is running: ${date.toString()} `);

    let results = [];

    const dummyData = [
      {
        image: "/imgs/reddit_icon.png",
        title:
          '"The Mask Of Zorro" was one of the last and best of the "Charming Swashbuckling Rogue Lead" movies.',
        popularity: 15154,
        content: undefined,
        date: 1593896200,
        platform: "Reddit",
      },
      {
        image: "/imgs/reddit_icon.png",
        title:
          "If the frosting on your cupcake is taller than the cupcake itself, that's too much frosting.",
        popularity: 16226,
        content: undefined,
        date: 1593900124,
        platform: "Reddit",
      },
      {
        image: "/imgs/reddit_icon.png",
        title:
          "This day last year, I rang a bell signifying the fact that chemotherapy is over.",
        popularity: 21956,
        content: undefined,
        date: 1593902996,
        platform: "Reddit",
      },
    ];

    const redditMentions = await redditScraper(companyName);
    const twitterMentions = await twitterScraper(companyName);

    results = results.concat(redditMentions, twitterMentions, dummyData);

    return results;
  };
};
