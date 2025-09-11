import express from "express";
import AdminController from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js";
import firebaseAuth from "../middlewares/firebaseAuth.js";

const router = express.Router();

router.get(
  "/city-issues",
  adminAuth.verifyToken,
  AdminController.getCityIssues
);

router.patch(
  "/update-issue/:id",
  adminAuth.verifyToken,
  AdminController.updateIssueStatus
);

export default router;
