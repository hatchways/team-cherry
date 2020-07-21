const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const {
  validateLogin,
  validateRegister,
} = require("./middleware/requiresFormValidation");
const { User, Company, Mention, UserMentions } = require("../models");
const cookieConfig = require("../cookie-config");
const { createErrorResponse } = require("./middleware/util");
const requiresAuth = require("./middleware/requiresAuth");

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

  let mailOptions = {
    to: `${req.body.email}`,
    subject: "Account Created",
    text:
      "Welcome to MentionsCrawler. You have successfully created an account.",
  };
  let mailConfig = {
    service: "gmail",
    auth: {
      user: "mentionscrawler123@gmail.com",
      pass: "P455w0rd",
    },
  };
  nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
      resolve(info);
    }
  });

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

router.post("/logout", requiresAuth, async (req, res, next) => {
  res.clearCookie("token").sendStatus(200);
});

router.put("/subscribe-mail/update", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  user.subscriberEmail = req.body.subscriberEmail;
  await user.save();

  // refresh the user token to bring on the email change
  res.sendStatus(204);
});

router.get("/mentions/liked", requiresAuth, async (req, res, next) => {
  const likedMentions = await UserMentions.findAll({
    where: {
      UserId: req.user.id,
      liked: true,
    },
    include: [{ model: Mention }],
  });

  const total = likedMentions.length;

  res.json({ total, mentions: likedMentions });
});

router.post(
  "/mentions/:mentionId/like",
  requiresAuth,
  async (req, res, next) => {
    let [userMention, isNew] = await UserMentions.findOrCreate({
      where: {
        UserId: req.user.id,
        MentionId: req.params.mentionId,
      },
    });

    userMention.liked = !userMention.liked;
    await userMention.save();

    res.json({
      mention: userMention,
    });
  }
);

module.exports = router;
