const router = require("express").Router();
const { Op } = require("sequelize");

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

// TODO test mentions in action

router.get("/", requiresAuth, async (req, res) => {
  // this can be possibly refactored by including the user company
  // on the token payload
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

router.get("/:query", requiresAuth, async (req, res) => {
  // const mention = await Mention.findByPk(req.params.id);
  const mentions = await Mention.findAll({
    where: {
      [Op.iLike]: "%" + req.params.query + "%",
    },
  });

  res.json(mention);
});

module.exports = router;
