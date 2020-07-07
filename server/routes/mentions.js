const router = require("express").Router();
const { Op } = require("sequelize");

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

// TODO test mentions in action

router.get("/", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  // get companies associated with the user
  const companies = await user.getCompanies();

  // get mentions associated with the companies
  output = [];
  for (let company of companies) {
    let mentions = await company.getMentions();
    output = output.concat(mentions);
  }

  res.json({ mentions: output });
});

router.get("/search/:query", requiresAuth, async (req, res) => {
  const mentions = await Mention.findAll({
    where: {
      title: {
        // checks if the search queried exists at some point in the title
        [Op.iLike]: "%" + req.params.query + "%",
      },
    },
  });

  res.json(mentions);
});

router.get("/email-list", async (req, res) => {
  res.json({ message: "Endpoint for email list" });
});

router.get("/toggle", async (req, res) => {
  res.json({ message: "Endpoint for mention toggles" });
});

module.exports = router;
