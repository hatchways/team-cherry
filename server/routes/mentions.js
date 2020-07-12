const router = require("express").Router();
const { Op } = require("sequelize");
const NodeCache = require("node-cache");
const mentionsCache = new NodeCache();

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

router.get("/", requiresAuth, async (req, res) => {
  let { keywords, platforms, page } = req.query;
  if (!platforms) {
    platforms = [];
  }
  const searchQuery = `%${keywords}%`;
  const user = await User.findByPk(req.user.id);

  page = parseInt(page) || 1;

  const companies = await user.getCompanies();

  // the other way is to just grab all the mentions, sort by date and return based on an array slice(mentions.slice(offset - pageSize, offset))
  // this could be expensive however as it would be reperforming the same query on every load. could be solved by using a backend cache however(npm node-cache)
  let output = mentionsCache.get("mentions");
  if (!output) {
    output = [];
    for (let company of companies) {
      let mentions = await company.getMentions({
        where: {
          // note: passing the array directly into `where` will implicitly use [Op.in]
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
    mentionsCache.set("mentions", output);
  }

  const pageSize = 5; // you can change this value
  const offset = page * pageSize;
  const chunk = output.slice(offset - pageSize, offset);
  const hasMore = offset < output.length;
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
