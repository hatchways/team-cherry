const createErrorResponse = (res, status, msg) => {
  return res.status(status).json({ error: msg, status });
};

module.exports = {
  createErrorResponse,
};
