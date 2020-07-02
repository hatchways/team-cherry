const puppeteer = require("puppeteer");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    self.browser = await puppeteer.launch({
      headless: false,
    });
    self.page = await self.browser.newPage();

    // Open the main page of Reddit.
    await self.page.goto("https://old.reddit.com/", {
      waitUntil: "networkidle0",
    });
  },

  getResults: async (companyName, countOfPagesToScrape) => {
    let results = [];
    let countOfPagesScraped = 0;

    // Scrape the number of pages specifed by "countOfPagesToScrape".
    while (countOfPagesScraped < countOfPagesToScrape) {
      // Scrape the current page and append the results to "results" variable.
      let resultsOnOnePage = await self.scrapeOnePage(companyName);
      results = [...results, ...resultsOnOnePage];

      countOfPagesScraped++;

      // Click the "next page" button if we have more pages to scrape.
      if (countOfPagesScraped < countOfPagesToScrape) {
        let nextPageButton = await self.page.$('span[class="next-button"] > a');
        if (nextPageButton != null) {
          await nextPageButton.click();
          await self.page.waitForNavigation({ waitUntil: "networkidle0" });
        } else {
          break;
        }
      }
    }

    return results;
  },

  scrapeOnePage: async (companyName) => {
    let platform = "Reddit";

    // Get all mentions on the current page.
    let mentions = await self.page.$$('#siteTable > div[class *= "thing"]');

    // Results to be returned.
    let results = [];

    // For each mention, check if its title contains the specifed company name.
    // If it does, get all the wanted info, open its content page to get its content,
    // and add it to the "results" variable.
    for (let mention of mentions) {
      // Get title.
      let title = await mention.$eval('a[class*="title"]', (node) =>
        node.innerText.trim()
      );

      // Check if title contains the specifed company name.
      // Skip to the next pass if it doesn't.
      if (!title.includes(companyName)) {
        continue;
      }

      let content = "";
      // Get the URL of this mention's content page.
      let content_URL = await mention.$eval(
        'p[class="title"] > a[class*="title"]',
        (node) => node.getAttribute("href").trim()
      );

      // if it DOESN'T link to an enternal website, which is a sign of advertisement.
      if (content_URL.substr(0, 3) === "/r/") {
        // Create a new page to open the mention's content page.
        let contentPage = await self.browser.newPage();
        await contentPage.goto("https://old.reddit.com" + content_URL, {
          waitUntil: "networkidle0",
        });

        // Get the text of the first paragraph of the content.
        content = await contentPage.evaluate(() => {
          let firstParagraph = document.querySelector(
            'div[class = "expando"] > form[class *= "usertext"] > div[class*="usertext-body"] > div[class="md"] > p'
          );
          if (firstParagraph != null) {
            return firstParagraph.innerText.trim();
          } else {
            return "";
          }
        });
      }

      // Get image URL.
      let image = await mention.evaluate((mention) => {
        let imgElement = mention.querySelector('a[class*="thumbnail"] > img');
        if (imgElement != null) {
          return imgElement.getAttribute("src").trim();
        } else {
          return null;
        }
      });

      // Get date.
      let date = await mention.evaluate((mention) => {
        let date = mention.querySelector(".live-timestamp");

        if (date != null) {
          return date.getAttribute("datetime").trim();
        } else {
          return null;
        }
      });

      // Get popularity.
      let popularity = await mention.$eval(
        'div[class="score unvoted"]',
        (node) => node.innerText.trim()
      );

      // Append it to the "results" variable.
      results.push({
        title,
        content,
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
