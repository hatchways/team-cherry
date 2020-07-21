const router = require("express").Router();
const jwt = require("jsonwebtoken");
const axios = require('axios')

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
    return createErrorResponse(res, 409, {
      email: "That email already exists",
    });
  }

  const user = await User.create({
    email: req.body.email,
    subscriberEmail: req.body.email,
    password: req.body.password,
  });

  const [company, isNew] = await Company.findOrCreate({
    where: {
      name: req.body.company,
    },
  });

  await user.addCompany(company);

  // token payload
  const payload = {
    id: user.id,
    email: user.email,
  };

  const send = async (address) => {
    let config = {
      headers: {
        Authorization: `Bearer ${process.env.sendgridKey}`,
      }
    }
    let data = {
      personalizations: [
        {
          to: [
            {
              email: `${address}`,
            },
          ],
        }
      ],
      from: {
        email: "mentionscrawler123@gmail.com",
        name: "Mentionscrawler Team"
      },
      subject: "Welcome to MentionsCrawler!",
      content: [{
        type: "text/plain",
        value: "Thank you for signing up!"
      }]
    }
    try {
      await axios.post("https://api.sendgrid.com/v3/mail/send", data, config)
    } catch (error) {
      console.error(error, 'failing new subscriber')
    }
  }

  await send(user.email)

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
  // res.json({ user: newUser });
});

router.post("/login", validateLogin, async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    return createErrorResponse(res, 404, { user: "User doesn't exist" });
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
    return createErrorResponse(res, 403, {
      password: "Password does not match",
    });
  }
});

module.exports = router;
