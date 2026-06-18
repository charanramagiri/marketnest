const crypto = require("crypto");

const hashValue = (value) => crypto.createHash("sha256").update(value).digest("hex");

const createSecureToken = () => crypto.randomBytes(32).toString("hex");

module.exports = {
  hashValue,
  createSecureToken
};
