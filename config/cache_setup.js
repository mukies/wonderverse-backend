const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 7200,
  useClones: false,
});

module.exports = {
  async get(key) {
    return cache.get(key);
  },
  async set(key, value, ttl) {
    return cache.set(key, value, ttl);
  },
  async del(key) {
    return cache.del(key);
  },
};
