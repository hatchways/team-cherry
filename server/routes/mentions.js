const router = require("express").Router();
const { Op } = require("sequelize");
const NodeCache = require("node-cache");
const mentionsCache = new NodeCache();

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");
const { tryToGetFromCache } = require("./util");

router.get("/", requiresAuth, async (req, res) => {
  let { keywords, platforms, page } = req.query;
  if (!platforms) {
    platforms = [];
  }
  if (!keywords) {
    keywords = "";
  }

  const searchQuery = `%${keywords}%`;
  page = parseInt(page) || 1;

  const user = await User.findByPk(req.user.id);
  const companies = await user.getCompanies();

  let cacheKey = "keywords=" + keywords + "&platforms=" + platforms.join(",");
  let companyNames = companies.map((c) => c.name);
  let output = tryToGetFromCache(mentionsCache, cacheKey, companyNames);

  if (!output) {
    console.log("cache reset");
    output = [];
    for (let company of companies) {
      let mentions = await company.getMentions({
        where: {
          // is the mention from one of the toggled platforms?
          platform: platforms,

          // is the search query on the title or content?
          [Op.or]: [
            {
              title: {
                [Op.like]: searchQuery,
              },
            },
            {
              content: {
                [Op.like]: searchQuery,
              },
            },
          ],
        },
      });

      output = output.concat(mentions);
    }
    // TODO sort output based on date
    output.sort((a, b) => Date.parse(a.date) + Date.parse(b.date));
    mentionsCache.set(cacheKey, output);
    mentionsCache.set("key", cacheKey);
    mentionsCache.set("companies", companyNames);
  }

  console.log(output.map((c) => c.date));
  const pageSize = 5; // you can change this value
  const offset = page * pageSize;
  const chunk = output.slice(offset - pageSize, offset);
  const hasMore = offset <= output.length;
  const count = chunk.length;

  res.json({ page, hasMore, count, mentions: chunk });
});

router.get("/email-list", async (req, res) => {
  res.json({ message: "Endpoint for email list" });
});

router.get("/toggle", async (req, res) => {
  res.json({ message: "Endpoint for mention toggles" });
});

module.exports = router;
