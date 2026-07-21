const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Runs before all protected routes.
 */
const requireAuth = async (req, res, next) => {
  let token;
  try {
    token = req.cookies.token;
    const { id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(id);
    next();
  } catch {
    return res.status(401).cookie("token", "logout", { maxAge: 0 }).json({
      error: "Not authorized",
    });
  }
};

module.exports = requireAuth;
