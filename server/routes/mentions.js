const router = require("express").Router();
const { Mention } = require("../models");

// TODO test mentions in action
// TODO Create database relationship between mentions and user

router.get("/", async (req, res) => {
  const mentions = await Mention.findAll();

  res.json(mentions);
});

router.get("/:id", async (req, res) => {
  const mention = await Mention.findByPk(req.params.id);

  res.json(mention);
});

router.post("/", async (req, res) => {
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
    res.json(mention);
  } else {
    res.status(204);
  }
});

router.delete("/:id", async (req, res) => {
  const mention = await Mention.findByPk(req.params.id);
  await mention.destroy();

  return res.status(204);
});

module.exports = router;
