const express = require("express");
const router = express.Router();

router.get("/welcome", function (req, res, next) {
  console.log(req.headers)
  console.log('you made it')
  res.status(200).json({ user: "Step 1 (completed)" });
});

module.exports = router;
