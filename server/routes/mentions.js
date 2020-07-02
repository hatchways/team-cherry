const router = require("express").Router();
const { Mention } = require("../models");

// TODO test mentions in action

router.get("/", async (req, res) => {
  const mentions = await Mention.findAll();

  res.json(mentions);
});

router.get("/:id", async (req, res) => {
  const mention = await Mention.findByPk(req.params.id);

  res.json(mention);
});

router.post("/", async (req, res) => {
  const newMention = await Mention.findOrCreate({
    where: {
      title: req.body.title,
    },
    defaults: {
      ...req.body,
    },
  });

  res.json(newMention);
});

router.delete("/:id", async (req, res) => {
  const mention = await Mention.findByPk(req.params.id);
  await mention.destroy();

  return res.status(204);
});

module.exports = router;
