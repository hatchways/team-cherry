const {
  validateLoginInput,
  validateRegisterInput,
} = require("../../validators");

const validateLogin = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
};
