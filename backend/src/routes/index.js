import { Router } from "express";
import issueRoutes from "./issueRoutes.js";

const router = Router();

router.use("/issue",issueRoutes);


export default router;