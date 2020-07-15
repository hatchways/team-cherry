const router = require("express").Router();
const { Op } = require("sequelize");

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

  //TODO Do pagination without cache, use original idea(counter for page size and total mentions fetched so far)

  const searchQuery = `%${keywords}%`;
  page = parseInt(page) || 1;

  const user = await User.findByPk(req.user.id);
  const companies = await user.getCompanies();

  // pagination variables
  const pageSize = Math.ceil(20 / companies.length);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  output = [];
  for (let company of companies) {
    let mentions = await company.getMentions({
      limit,
      offset,
      where: {
        // is the mention from one of the toggled platforms?
        platform: platforms,

        // is the search query on the title or content?
        [Op.or]: [
          {
            title: {
              [Op.iLike]: searchQuery,
            },
          },
          {
            content: {
              [Op.iLike]: searchQuery,
            },
          },
        ],
      },
    });
    output = output.concat(mentions);
  }
  // TODO sort output based on date
  // output.sort((a, b) => Date.parse(a.date) + Date.parse(b.date));

  const count = output.length;
  const hasMore = count ? true : false;

  res.json({ page, hasMore, count, mentions: output });
});

router.get("/email-list", async (req, res) => {
  res.json({ message: "Endpoint for email list" });
});

router.get("/toggle", async (req, res) => {
  res.json({ message: "Endpoint for mention toggles" });
});

module.exports = router;
