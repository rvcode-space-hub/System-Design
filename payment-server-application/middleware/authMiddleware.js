const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Expected format → "Bearer token"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.user_id) {
      return res.status(401).json({
        success: false,
        message: "User ID missing in token",
      });
    }

    // Attach user info to request
    req.user = { user_id: decoded.user_id };

    next();

  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
