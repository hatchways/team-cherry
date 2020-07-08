const router = require("express").Router();
const jwt = require("jsonwebtoken");

const {
  validateLogin,
  validateRegister,
} = require("./middleware/requiresFormValidation");
const { User, Company } = require("../models");
const cookieConfig = require("../cookie-config");
const { createErrorResponse } = require("./middleware/util");

router.post("/register", validateRegister, async (req, res) => {
  const existingUser = await User.findOne({ where: { email: req.body.email } });

  if (existingUser) {
    return createErrorResponse(res, 400, {
      email: "That email already exists",
    });
  }

  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
  });

  const [company, isNew] = await Company.findOrCreate({
    where: {
      name: req.body.company,
    },
  });

  await newUser.addCompany(company);

  // token payload
  const payload = {
    id: newUser.id,
    email: newUser.email,
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 31556926 },
    (err, token) => {
      res
        .cookie("token", token, cookieConfig)
        .json({ success: true, user, company });
    }
  );

  res.json(newUser);
});

router.post("/login", validateLogin, async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    return createErrorResponse(res, 400, { user: "User doesn't exist" });
  }

  const isMatch = await user.checkPassword(req.body.password);
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
          .json({ success: true, user })
    );
  } else {
    return createErrorResponse(res, 400, {
      password: "Password does not match",
    });
  }
});

module.exports = router;
