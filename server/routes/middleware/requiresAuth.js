const jwt = require("jsonwebtoken");
const { createErrorResponse } = require("./util");

module.exports = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return createErrorResponse(res, 403, "Forbidden");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return createErrorResponse(res, 401, "Unable to decode token");
      } else if (decodedToken.exp <= Date.now() / 1000) {
        return createErrorResponse(res, 401, "Token Expired");
      } else {
        req.user = { id: decodedToken.id };
        next();
      }
    });
  }
};
