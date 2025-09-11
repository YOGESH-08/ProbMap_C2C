import express from "express";
import AdminController from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.get(
  "/issues",
  adminAuth.verifyToken,
  AdminController.getCityIssues
);

router.patch(
  "/issues/:id",
  adminAuth.verifyToken,
  AdminController.updateIssueStatus
);

export default router;
