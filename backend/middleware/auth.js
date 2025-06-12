const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
