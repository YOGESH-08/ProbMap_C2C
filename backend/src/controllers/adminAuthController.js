import admin from "../firebase/firebaseConfig.js";
import Admin from "../models/adminModel.js";

const auth = admin.auth();

class AdminAuthController {
  login = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "JWT required" });
    }

    try {
      const decoded = await auth.verifyIdToken(idToken, true);
      const adminUser = await Admin.findOne({ firebaseUID: decoded.uid });

      if (!adminUser) {
        return res.status(403).json({ error: "Access denied. Not an admin." });
      }

      return res.status(200).json({
        message: "Admin login successful",
        admin: {
          fullName: adminUser.fullName,
          email: adminUser.email,
          city: adminUser.city,
        },
      });
    } catch (error) {
      console.error("Admin login failed:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export default new AdminAuthController();
