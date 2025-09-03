const jwt = require('jsonwebtoken');

const Middleware = (req, res, next) => {
  const token = req.headers['x-token'];

  if (!token || token === "defaultToken") {
    return res.status(400).json({ error: "Authorization header not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = Middleware;
