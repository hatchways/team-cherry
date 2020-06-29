const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateRegisterInput = require("../validators/register");

const { User } = require("../models");

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

module.exports = router;
