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

router.post("/", requiresAuth, async (req, res) => {
  // NOTE I think this is better served as just a test route in order to test the scraper
  // This shouldn't be placed in the final PR as there will be another means to post new data
  // into the database.
  const user = await User.findByPk(req.user.id);

  let mentions = callScraper(req.user.company, 100);

  let result = [];
  for (let m of mentions) {
    let userMentions = await user.getMentions({
      where: {
        title: m.title,
      },
    });

    // if this is new
    if (!userMentions.length) {
      [mention, isNew] = await Mention.findOrCreate({
        where: {
          title: m.title,
        },
        defaults: {
          title: m.title,
          platform: m.platform,
          date: m.date,
          content: m.content || "",
          popularity: m.popularity,
          imageUrl: m.image,
        },
      });
      result.push(mention);
      user.addMention(mention);
    }
  }
  res.json({ mentions: result });
});

router.delete("/:id", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  // found a way to untag a given mention from user,
  // while preserving the mention on its own separate table
  const mention = await Mention.findByPk(req.params.id);
  if (mention) {
    user.removeMention(mention);
  }

  res.sendStatus(204);
});

module.exports = router;
