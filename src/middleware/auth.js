// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Check structure of decoded token
    // console.log("Decoded JWT:", decoded);

    // ✅ Fix: handle both possible token structures
    // (depends on how token was generated)
    if (decoded.user && decoded.user.id) {
      req.user = decoded.user; // { id: '...' }
    } else if (decoded.id) {
      req.user = { id: decoded.id };
    } else {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
