import Issue from "../models/issueModel.js";
import User from "../models/userModel.js";

// User: Request to become a volunteer
export const requestVolunteer = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVolunteer && user.volunteerStatus === "approved") {
      return res.status(400).json({ error: "Already an approved volunteer" });
    }
    user.isVolunteer = true;
    user.volunteerStatus = "pending";
    await user.save();
    res.json({ message: "Volunteer request submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User: Get volunteer status
export const getVolunteerStatus = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      isVolunteer: user.isVolunteer,
      volunteerStatus: user.volunteerStatus,
      volunteerPoints: user.volunteerPoints,
      volunteerSince: user.volunteerSince,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User: List issues in user's district
export const listDistrictIssues = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Only approved volunteers can view district issues
    if (!user.isVolunteer || user.volunteerStatus !== "approved") {
      return res
        .status(403)
        .json({ error: "Access denied: not an approved volunteer" });
    }

    if (!user.addresses || user.addresses.length === 0) {
      return res.status(400).json({ error: "No district info found for user" });
    }

    const district = user.addresses[0];

    // Return only pending issues in the volunteer's district
    const issues = await Issue.find({
      district,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User: Submit a resolution claim for an issue
export const submitResolutionClaim = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    if (!user || user.volunteerStatus !== "approved") {
      return res.status(403).json({ error: "Not an approved volunteer" });
    }
    const { issueId, message } = req.body;
    const proofImageUrl = req.file ? req.file.path : undefined;
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    if (issue.volunteerClaim && issue.volunteerClaim.status === "submitted") {
      return res
        .status(400)
        .json({ error: "Claim already submitted for this issue" });
    }
    issue.volunteerClaim = {
      status: "submitted",
      volunteerId: user.firebaseUID,
      submittedAt: new Date(),
      message,
      proofImageUrl,
    };
    await issue.save();
    res.json({ message: "Claim submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: List all volunteer requests
export const adminListVolunteerRequests = async (req, res) => {
  try {
    const users = await User.find({
      isVolunteer: true,
      volunteerStatus: "pending",
    }).select("fullName email phone volunteerStatus createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update volunteer status (approve/reject)
export const adminUpdateVolunteerStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.volunteerStatus = status;
    user.isVolunteer = status === "approved";
    user.volunteerSince = status === "approved" ? new Date() : undefined;
    await user.save();
    res.json({ message: `Volunteer status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: List all claims submitted by volunteers
export const adminListClaims = async (req, res) => {
  try {
    const issues = await Issue.find({ "volunteerClaim.status": "submitted" });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Review a volunteer's claim (approve/reject)
export const adminReviewClaim = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status, message } = req.body; // 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const issue = await Issue.findById(issueId);
    if (
      !issue ||
      !issue.volunteerClaim ||
      issue.volunteerClaim.status !== "submitted"
    ) {
      return res
        .status(404)
        .json({ error: "No submitted claim for this issue" });
    }
    issue.volunteerClaim.status = status;
    issue.volunteerClaim.reviewedAt = new Date();
    issue.volunteerClaim.message = message;
    if (status === "approved") {
      issue.status = "resolved";
      // Award points to volunteer
      const volunteer = await User.findOne({
        firebaseUID: issue.volunteerClaim.volunteerId,
      });
      if (volunteer) {
        volunteer.volunteerPoints += 10; // Arbitrary points per claim
        await volunteer.save();
      }
    }
    await issue.save();
    res.json({ message: `Claim ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Public: Get volunteer leaderboard
export const getVolunteerLeaderboard = async (req, res) => {
  try {
    const users = await User.find({
      isVolunteer: true,
      volunteerStatus: "approved",
    })
      .sort({ volunteerPoints: -1 })
      .limit(10)
      .select("fullName volunteerPoints volunteerSince");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: List all approved volunteers
export const adminListApprovedVolunteers = async (req, res) => {
  try {
    const users = await User.find({
      isVolunteer: true,
      volunteerStatus: "approved",
    }).select("fullName email phone volunteerPoints volunteerSince");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Remove a volunteer
export const adminRemoveVolunteer = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.isVolunteer = false;
    user.volunteerStatus = "rejected";
    user.volunteerSince = undefined;
    await user.save();
    res.json({ message: "Volunteer removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
