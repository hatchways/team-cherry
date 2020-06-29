const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateRegisterInput = require("../validators/register");
const validateLoginInput = require("../validators/login");

const { User } = require("../models");
const cookieConfig = require("../cookie-config");

router.post("/register", async (req, res) => {
  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    return hashedPw;
  };
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const existingUser = await User.findOne({ where: { email: req.body.email } });

  if (existingUser) {
    return res.status(400).json({ email: "That email already exists" });
  }

  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
  });

  newUser.password = await hashPassword(newUser.password);
  await newUser.save();
  res.json(newUser);
});

router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  const user = await User.findOne({ where: { email: req.body.email } });

  // a note about bcrypt.compare: arg position is important,
  // the function signature states plaintext pw should be the first arg THEN the hashed pw comes after
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (isMatch) {
    // what gets sent and decoded on client side
    const payload = {
      id: user.id,
      email: user.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 31556926 },
      (err, token) =>
        res
          .cookie("token", token, cookieConfig) // cookie is viewable in PostMan
          .json({ success: true, user, token: "Bearer " + token })
    );
  } else {
    return res.status(400).json({
      passwordIncorrect: "Password does not match",
    });
  }
});

module.exports = router;
