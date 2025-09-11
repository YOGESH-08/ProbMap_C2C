import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

class AdminAuthMiddleware {
  verifyToken = async (req, res, next) => {
    try {
      const token = req.cookies?.session;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized. No session token." });
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      if (!admin.isAdmin) {
        return res.status(403).json({ error: "Forbidden. Not an admin." });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error("Invalid admin session", error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

export default new AdminAuthMiddleware();
