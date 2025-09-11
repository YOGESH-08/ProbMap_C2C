import express from "express";
import {
  createIssue,
  getIssuesByUserId,
  deleteIssue,
} from "../controllers/issueController.js";
import upload from "../middlewares/upload.js";
import FirebaseAuthMiddleware from "../middlewares/firebaseAuth.js"; 
const router = express.Router();

router.post(
  "/",
  FirebaseAuthMiddleware.verifySessionCookie,
  upload.single("image"),
  createIssue
);
router.get("/myissues", FirebaseAuthMiddleware.verifySessionCookie, getIssuesByUserId);
router.delete(
  "/:id",
  FirebaseAuthMiddleware.verifySessionCookie,
  deleteIssue
);

export default router;
