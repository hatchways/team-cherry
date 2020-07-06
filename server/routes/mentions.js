const router = require("express").Router();

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

const callScraper = require("../scraper");

// TODO test mentions in action

router.get("/", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  // note that the getter method for n-m can accept options
  // as if it were a regular query
  const mentions = await user.getMentions();

  res.json(mentions);
});

router.get("/:id", requiresAuth, async (req, res) => {
  const mention = await Mention.findByPk(req.params.id);

  res.json(mention);
});

module.exports = router;
