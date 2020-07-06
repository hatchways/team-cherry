const router = require("express").Router();

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

const callScraper = require("../scraper");

// TODO test mentions in action

router.get("/", requiresAuth, async (req, res) => {
  // this can be possibly refactored by including the user company
  // on the token payload
  const user = await User.findByPk(req.user.id);

  // get company associated with the user
  const company = await user.getCompany();

  // get mentions associated with the company
  const mentions = await company.getMentions();

  res.json(mentions);
});

router.get("/:id", requiresAuth, async (req, res) => {
  const mention = await Mention.findByPk(req.params.id);

  res.json(mention);
});

module.exports = router;
