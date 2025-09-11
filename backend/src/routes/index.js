import { Router } from "express";
import issueRoutes from "./issueRoutes.js";
import authRoutes from "./authRoutes.js"

const router = Router();

router.use("/issue",issueRoutes);
router.use("/auth",authRoutes);

export default router;