import express from "express";
import { createIssue, getIssues, getIssueById, updateIssueStatus } from "../controllers/issueController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("image"),createIssue);
router.get("/", getIssues);
router.get("/:id", getIssueById);
router.patch("/:id", updateIssueStatus);

export default router;
