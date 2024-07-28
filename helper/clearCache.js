const { keys, del } = require("../config/cache_setup");

exports.clearCacheByPrefix = async (prefix) => {
  const allKeys = await keys();
  const matchingKeys = allKeys.filter((key) => key.startsWith(prefix));
  matchingKeys.forEach(async (key) => await del(key));
};
