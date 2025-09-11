// middlewares/adminAuthMiddleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; 

class AdminAuthMiddleware {
  verifyToken = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const admin = await Admin.findById(decoded.adminId);
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      req.admin = admin; 
      next();
    } catch (error) {
      console.error("Invalid admin token", error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

export default new AdminAuthMiddleware();
