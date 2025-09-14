import Issue from "../models/issueModel.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
class AdminController {
  getCityIssues = async (req, res) => {
    try {
      console.log("req.user:",req.user);
      const admin = await Admin.findOne({ firebaseUID: req.user.firebaseUID });
      if (!admin) return res.status(403).json({ error: "Unauthorized" });

      const issues = await Issue.find().sort({ createdAt: -1 });
      res.json(issues);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateIssueStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, message } = req.body;

      if (!["acknowledged", "resolved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updated = await Issue.findByIdAndUpdate(
  id,
  { 
    status, 
    adminResponse: { 
      message, 
      respondedAt: new Date() 
    } 
  },
  { new: true }
);


      if (!updated) return res.status(404).json({ error: "Issue not found" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 getIssuesByStatus = async (status, res) => {
    try {
      const issues = await Issue.find({ status }).sort({ createdAt: -1 });
      res.json(issues);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAllPendingIssues = (req, res) => this.getIssuesByStatus("pending", res);
  getAllAcknowledged = (req, res) => this.getIssuesByStatus("acknowledged", res);
  getAllResolved = (req, res) => this.getIssuesByStatus("resolved", res);
  getAllRejected = (req, res) => this.getIssuesByStatus("rejected", res);
};

export default new AdminController();
