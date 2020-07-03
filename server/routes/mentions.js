const router = require("express").Router();

const requiresAuth = require("./middleware/requiresAuth");
const { Mention, User } = require("../models");

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

router.post("/", requiresAuth, async (req, res) => {
  const [mention, isNew] = await Mention.findOrCreate({
    where: {
      title: req.body.title,
    },
    defaults: {
      ...req.body,
    },
  });

  // send if new, else no content
  if (isNew) {
    const user = await User.findByPk(req.user.id);
    // https://sequelize.org/master/manual/assocs.html ctrl-f to "Foo.hasMany(Bar)"
    user.addMention(mention);
    res.json(mention);
  } else {
    res.status(204);
  }
});

router.delete("/:id", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const mentions = await user.getMentions({
    where: {
      id: req.params.id,
    },
  });

  if (mentions.length) {
    const mention = mentions[0];
    await mention.destroy();
  }

  res.sendStatus(204);
});

module.exports = router;
