const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  } // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field cannot be empty";
  }
  if (!Validator.isLength(data.password, { min: 7, max: 30 })) {
    errors.password = "Password must be at least 7 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
