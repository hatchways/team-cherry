module.exports = function duddScraper() {
  // placeholder function for an actually scraper
  this.run = function run(companyName, pagesToScrape) {
    const date = new Date(Date.now());
    console.log(`Scraper is running: ${date.toString()} `);

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

    return dummyData;
  };
};
