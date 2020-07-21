const router = require("express").Router();
const { Op } = require("sequelize");

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User, UserMentions } = require("../models");
const NodeCache = require("node-cache");

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

  // pagination variables
  const pageSize = Math.ceil(20 / companies.length); // number of companies should never exceed page size(20)
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let output = [];
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
      include: [
        {
          model: UserMentions,
        },
      ],
      order: [["date", "DESC"]],
    });

    mentions = mentions.map((mention) => {
      let userFound = mention.UserMentions.find(
        (um) => um.UserId == req.user.id
      );
      let liked = userFound && userFound.liked ? true : false;
      return { ...mention.dataValues, liked };
    });

    output = output.concat(mentions);
  }

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
