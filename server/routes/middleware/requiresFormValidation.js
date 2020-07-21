const {
  validateLoginInput,
  validateRegisterInput,
} = require("../../validators");

const { createErrorResponse } = require("../util");

const validateLogin = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return createErrorResponse(res, 400, errors);
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return createErrorResponse(res, 400, errors);
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
};
