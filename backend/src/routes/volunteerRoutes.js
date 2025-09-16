import express from "express";
import upload from "../middlewares/upload.js";
import FirebaseAuthMiddleware from "../middlewares/firebaseAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  requestVolunteer,
  getVolunteerStatus,
  listDistrictIssues,
  submitResolutionClaim,
  adminListVolunteerRequests,
  adminUpdateVolunteerStatus,
  adminListClaims,
  adminReviewClaim,
  getVolunteerLeaderboard,
  adminListApprovedVolunteers,
  adminRemoveVolunteer,
} from "../controllers/volunteerController.js";

const router = express.Router();

// User routes (require Firebase session)
router.post(
  "/request",
  FirebaseAuthMiddleware.verifySessionCookie,
  requestVolunteer
);
router.get(
  "/status",
  FirebaseAuthMiddleware.verifySessionCookie,
  getVolunteerStatus
);
router.get(
  "/district-issues",
  FirebaseAuthMiddleware.verifySessionCookie,
  listDistrictIssues
);
router.post(
  "/submit-claim",
  FirebaseAuthMiddleware.verifySessionCookie,
  upload.single("proof"),
  submitResolutionClaim
);

// Admin routes
router.get(
  "/admin/requests",
  adminAuth.verifyCookie,
  adminListVolunteerRequests
);
router.patch(
  "/admin/requests/:userId",
  adminAuth.verifyCookie,
  adminUpdateVolunteerStatus
);
router.get("/admin/claims", adminAuth.verifyCookie, adminListClaims);
router.post(
  "/admin/claims/:issueId/review",
  adminAuth.verifyCookie,
  upload.single("adminProof"),
  adminReviewClaim
);
router.get(
  "/admin/volunteers",
  adminAuth.verifyCookie,
  adminListApprovedVolunteers
);
router.delete(
  "/admin/volunteers/:userId",
  adminAuth.verifyCookie,
  adminRemoveVolunteer
);

// Public leaderboard
router.get("/leaderboard", getVolunteerLeaderboard);

export default router;
