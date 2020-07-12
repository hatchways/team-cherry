function createErrorResponse(res, status, errors) {
  return res.status(status).json({ errors, status });
}

function tryToGetFromCache(cache, cacheKey, companyNames) {
  // cache invalidation conditions:
  //   1. keys changed
  //   2. tracked companies changed
  //   3. no cache to begin with

  let prevCacheKey = cache.get("key");
  let sameKeys = cacheKey === prevCacheKey;

  let prevCompanies = cache.get("companies");
  let sameCompanyNames =
    Array.isArray(prevCompanies) &&
    companyNames.length === prevCompanies.length &&
    companyNames.every((name, index) => name == prevCompanies[index]);

  if (!sameKeys || !sameCompanyNames) {
    return false;
  }

  // will return undefined if there is nothing in the cache
  return cache.get(cacheKey);
}

module.exports = {
  createErrorResponse,
  tryToGetFromCache,
};
