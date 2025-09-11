import Issue from "../models/issueModel.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";
import User from "../models/userModel.js";

export const createIssue = async (req, res) => {
   const firebaseUID = req.user?.uid;
    if (!firebaseUID) {
      res.status(401).json({ message: "Unauthorized. No Firebase user identified." });
      return;
    }
  try {
    const { title, description, category, location } = req.body;
    let imageUrl = null;
    if(req.file){
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "issues"
      );
      imageUrl = result.secure_url;
    }
        const newIssue = new Issue({
      title,
      description,
      category,
      location:JSON.parse(location),
      imageUrl,
      userId:firebaseUID,
    });
    await newIssue.save();
    await User.findOneAndUpdate(
      { firebaseUID },
      { $inc: { numIssueRaised: 1 } }
    );
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIssuesByUserId = async (req, res) => {
  const firebaseUID = req.user?.uid; 
  if (!firebaseUID) return res.status(401).json({ message: "Unauthorized" });

  try {
    const issues = await Issue.find({ userId: firebaseUID }).sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  const firebaseUID = req.user?.uid;
  if (!firebaseUID) return res.status(401).json({ message: "Unauthorized" });

  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    if (issue.userId !== firebaseUID) {
      return res.status(403).json({ message: "Forbidden. You cannot delete this issue." });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
