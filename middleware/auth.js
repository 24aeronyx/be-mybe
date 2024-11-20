const jwt = require("jsonwebtoken");

const auth = {
  authenticateJWT: (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied, no token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Invalid token:", error);
      return res.status(401).json({ message: "invalid or expired token" });
    }
  },
};

module.exports = auth;
