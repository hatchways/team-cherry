const createErrorResponse = (res, status, errors) => {
  return res.status(status).json({ errors, status });
};

module.exports = {
  createErrorResponse,
};
