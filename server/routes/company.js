const router = require("express").Router();

const { User, Company } = require("../models");
const requiresAuth = require("./middleware/requiresAuth");

router.post("/", requiresAuth, async (req, res) => {
  // test route for adding company onto the user
  const user = await User.findByPk(req.user.id);
  const [company, isNew] = await Company.findOrCreate({
    where: {
      name: req.body.companyName,
    },
  });

  await user.addCompany(company);

  res.json(company);
});

router.get("/", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const companies = await user.getCompanies();

  res.json({ companies });
});

router.delete("/", requiresAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const companyToRemove = await Company.findOne({
    where: {
      name: req.body.name,
    },
  });

  await user.removeCompany(companyToRemove);

  res.sendStatus(204);
});

// test route to validate that 1-n relationship is working properly
router.get("/:company/users", async (req, res) => {
  const company = await Company.findOne({
    where: {
      name: req.params.company,
    },
  });

  const users = await company.getUsers();

  res.json(users);
});

module.exports = router;
