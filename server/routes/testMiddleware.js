const router = require("express").Router();

const requiresAuth = require("./middleware/requiresAuth");

router.get("/", requiresAuth, async (req, res, next) => {
  res.json({ user: req.user });
});



module.exports = router;
