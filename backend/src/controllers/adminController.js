import Issue from "../models/issueModel.js";
import Admin from "../models/adminModel.js";

class AdminController {
  getCityIssues = async (req, res) => {
    try {
      const admin = await Admin.findOne({ firebaseUID: req.user.uid });
      if (!admin) return res.status(403).json({ error: "Unauthorized" });

      const issues = await Issue.find({ "location.city": admin.city }).sort({ createdAt: -1 });
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
        { status, adminMessage: message },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: "Issue not found" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default new AdminController();
