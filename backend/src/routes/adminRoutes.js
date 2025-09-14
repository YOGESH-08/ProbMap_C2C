import express from "express";
import AdminController from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js";
import firebaseAuth from "../middlewares/firebaseAuth.js";
import adminAuthController from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login",adminAuthController.login);
router.post("/logout", adminAuth.verifyCookie, adminAuthController.login);

router.get(
  "/city-issues",
  adminAuth.verifyCookie,
  AdminController.getCityIssues
);

router.patch(
  "/update-issue/:id",
  adminAuth.verifyCookie,
  AdminController.updateIssueStatus
);

router.get("/users", adminAuth.verifyCookie, AdminController.getAllUsers);
router.get("/pendingIssues",adminAuth.verifyCookie,AdminController.getAllPendingIssues);
router.get("/resolvedIssues",adminAuth.verifyCookie,AdminController.getAllResolved);
router.get("/acknowledgedIssues",adminAuth.verifyCookie,AdminController.getAllAcknowledged);
router.get("/rejectedIssues",adminAuth.verifyCookie,AdminController.getAllRejected);

export default router;
