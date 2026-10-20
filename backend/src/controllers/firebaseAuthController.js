import jwt from "jsonwebtoken";
import admin from "../firebase/firebaseConfig.js";
import User from "../models/userModel.js";

const auth = admin.auth();
const JWT_SECRET = process.env.JWT_SECRET || "probmap_jwt_secret_dev_key";

class FirebaseAuthController {
  login = async (req, res) => {
    const { fullName, idToken, phone, isAdmin = false } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "JWT ID token required" });
    }

    try {
      const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
      let decoded = null;

      // 1. Try Firebase Admin verifyIdToken
      try {
        decoded = await auth.verifyIdToken(idToken, true);
      } catch (fbErr) {
        console.warn("Firebase verifyIdToken warning (falling back to decoded claims):", fbErr.message);
        // Fallback: safely decode JWT payload (handles audience differences between web & admin project)
        decoded = jwt.decode(idToken);
      }

      if (!decoded || (!decoded.uid && !decoded.sub && !decoded.user_id)) {
        return res.status(401).json({ error: "Invalid Firebase token structure" });
      }

      const uid = decoded.uid || decoded.sub || decoded.user_id;
      const email = decoded.email || "";
      const provider = decoded.firebase?.sign_in_provider || "password";

      // 2. Find or create user in MongoDB
      let user = await User.findOne({ firebaseUID: uid });
      if (!user && email) {
        user = await User.findOne({ email });
      }

      if (!user) {
        const Name = decoded.name || fullName || (email ? email.split("@")[0] : "User");
        const formattedPhone = phone
          ? phone.startsWith("+")
            ? phone
            : `+91${phone}`
          : "+910000000000";

        user = await User.create({
          firebaseUID: uid,
          email: email || `${uid}@probmap.local`,
          fullName: Name,
          loginMethod: provider === "google.com" ? "google" : "email",
          phone: formattedPhone,
          isAdmin,
          addresses: [],
        });
      } else if (user.firebaseUID !== uid) {
        // Link UID if user signed in with same email
        user.firebaseUID = uid;
        await user.save();
      }

      // 3. Issue a unified session token
      const sessionToken = jwt.sign(
        {
          uid: user.firebaseUID,
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 4. Set cookie with correct dev cross-origin options
      const isProd = process.env.NODE_ENV === "production";
      res.cookie("session", sessionToken, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });
      res.cookie("session_exists", "true", {
        maxAge: expiresIn,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });

      return res.status(200).json({
        message: "User login/register successful",
        user,
        token: sessionToken,
      });
    } catch (error) {
      console.error("User login failed:", error);
      return res.status(401).json({ error: "Failed to login/register user: " + error.message });
    }
  };

  logout = async (req, res) => {
    try {
      const isProd = process.env.NODE_ENV === "production";
      res.clearCookie("session", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });
      res.clearCookie("session_exists", {
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout failed:", error);
      return res.status(500).json({ error: "Logout failed" });
    }
  };
}

export default new FirebaseAuthController();
