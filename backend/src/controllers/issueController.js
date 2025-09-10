import Issue from "../models/issueModel.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

export const createIssue = async (req, res) => {
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
    });
    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    issue.status = req.body.status || issue.status;
    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
