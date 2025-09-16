import { Router } from "express";
import issueRoutes from "./issueRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import superAdminRoutes from "./superAdminRoutes.js";
import volunteerRoutes from "./volunteerRoutes.js";
const router = Router();

router.use("/admin", adminRoutes);
router.use("/issue", issueRoutes);
router.use("/auth", authRoutes);
router.use("/superadmin", superAdminRoutes);
router.use("/volunteer", volunteerRoutes);

export default router;
