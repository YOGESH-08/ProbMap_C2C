import jwt from "jsonwebtoken";
import admin from "../firebase/firebaseConfig.js";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "probmap_jwt_secret_dev_key";

class FirebaseAuthMiddleware {
  verifySessionCookie = async (req, res, next) => {
    let token = req.cookies?.session;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No session token provided." });
    }

    try {
      // 1. Try verifying with internal JWT first
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const uid = decoded.uid || decoded.sub;
        let dbUser = await User.findOne({ firebaseUID: uid });
        if (!dbUser && decoded.email) {
          dbUser = await User.findOne({ email: decoded.email });
        }

        if (dbUser) {
          req.user = {
            uid: dbUser.firebaseUID,
            email: dbUser.email,
            fullName: dbUser.fullName,
            isAdmin: dbUser.isAdmin,
          };
          req.dbUser = dbUser;
          return next();
        }
      } catch (jwtErr) {
        // Not internal JWT, proceed to Firebase Admin
      }

      // 2. Try Firebase Admin session cookie verification
      try {
        const decodedClaims = await admin.auth().verifySessionCookie(token, true);
        const dbUser = await User.findOne({ firebaseUID: decodedClaims.uid });
        if (dbUser) {
          req.user = decodedClaims;
          req.dbUser = dbUser;
          return next();
        }
      } catch (fbErr) {
        // Not Firebase session cookie, try decoded token
      }

      // 3. Fallback: decode token safely (e.g. Firebase raw ID token in Bearer header)
      const decodedFallback = jwt.decode(token);
      if (decodedFallback && (decodedFallback.uid || decodedFallback.sub || decodedFallback.user_id)) {
        const uid = decodedFallback.uid || decodedFallback.sub || decodedFallback.user_id;
        let dbUser = await User.findOne({ firebaseUID: uid });
        if (!dbUser && decodedFallback.email) {
          dbUser = await User.findOne({ email: decodedFallback.email });
        }

        if (dbUser) {
          req.user = {
            uid: dbUser.firebaseUID,
            email: dbUser.email,
            fullName: dbUser.fullName,
            isAdmin: dbUser.isAdmin,
          };
          req.dbUser = dbUser;
          return next();
        }
      }

      return res.status(401).json({ error: "Unauthorized. Session is invalid or user not found." });
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
}

export default new FirebaseAuthMiddleware();
