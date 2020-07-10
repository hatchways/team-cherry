const router = require("express").Router();
const { Op } = require("sequelize");

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

// TODO test mentions in action

router.get("/", requiresAuth, async (req, res) => {
  let output = [];
  const { keywords, platforms } = req.body;
  const searchQuery = `%${keywords}%`;

  const user = await User.findByPk(req.user.id);
  const companies = await user.getCompanies();
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

  res.json({ mentions: output });
});

router.get("/email-list", async (req, res) => {
  res.json({ message: "Endpoint for email list" });
});

router.get("/toggle", async (req, res) => {
  res.json({ message: "Endpoint for mention toggles" });
});

module.exports = router;
