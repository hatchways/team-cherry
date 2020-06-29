const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const create4xxResponse = (status, msg) =>
    res.status(status).json({ error: msg });
  const { token } = req.cookies;
  if (!token) {
    return create4xxResponse(403, "Forbidden");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return create4xxResponse(401, "Unable to decode token");
      } else if (decodedToken.exp <= Date.now() / 1000) {
        return create4xxResponse(401, "Token Expired");
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};
