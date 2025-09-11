import { Router } from "express";
import issueRoutes from "./issueRoutes.js";
import authRoutes from "./authRoutes.js"
import adminRoutes from "./adminRoutes.js";
const router = Router();

router.use("/admin",adminRoutes);
router.use("/issue",issueRoutes);
router.use("/auth",authRoutes);

export default router;