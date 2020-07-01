const puppeteer = require("puppeteer");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();

    await page.goto("https://old.reddit.com/", { waitUntil: "networkidle0" });
  },

  getResults: async () => {
    let platform = "Reddit";
    let mentions = await page.$$('#siteTable > div[class *= "thing"]');
    let results = [];

    for (let mention of mentions) {
      let title = await mention.$eval('a[class*="title"]', (node) =>
        node.innerText.trim()
      );

      let content_URL = await mention.$eval(
        'p[class="title"] > a[class*="title"]',
        (node) => node.getAttribute("href").trim()
      );

      let image = await mention.evaluate((mention) => {
        let imgElement = mention.querySelector('a[class*="thumbnail"] > img');
        if (imgElement != null) {
          return imgElement.getAttribute("src").trim();
        } else {
          return null;
        }
      });

      let date = await mention.evaluate((mention) => {
        let date = mention.querySelector(".live-timestamp");

        if (date != null) {
          return date.getAttribute("datetime").trim();
        } else {
          return null;
        }
      });

      let popularity = await mention.$eval(
        'div[class="score unvoted"]',
        (node) => node.innerText.trim()
      );

      results.push({
        title,
        // content,
        image,
        date,
        popularity,
        platform,
      });
    }

    return results;
  },
};

module.exports = self;
