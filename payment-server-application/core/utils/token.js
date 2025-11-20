const jwt = require("jsonwebtoken");
exports.generateToken = (user_id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Please set it in your .env file");
  }

  return jwt.sign(
    { user_id }, // payload
    process.env.JWT_SECRET, // secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // expiration
  );
};
