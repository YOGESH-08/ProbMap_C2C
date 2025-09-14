import React, { useEffect, useState } from "react";
import EnhancedAcard from "./EnhancedAcard";

const UserIssues = ({ filterStatus }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    try {
      const res = await fetch("http://localhost:5000/issue/myissues", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch issues");
      }
      const data = await res.json();

      let filtered = data;
      if (filterStatus === "pending") {
        filtered = data.filter((issue) => issue.status === "pending");
      } else if (filterStatus === "history") {
        filtered = data.filter((issue) => issue.status !== "pending");
      }

      setIssues(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filterStatus]);

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const res = await fetch(`http://localhost:5000/issue/myissues/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete issue");
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading your issues...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (issues.length === 0)
    return (
      <p style={{ paddingTop: "15px" }}>
        No{" "}
        {filterStatus === "pending"
          ? "pending"
          : "resolved/rejected/acknowledged"}{" "}
        issues found.
      </p>
    );

  return (
    <div className="issues-container">
      {issues.map((issue) => (
        <EnhancedAcard
          key={issue._id}
          details={{
            id: issue._id,
            name: issue.title,
            location: issue.location,
            description: issue.description,
            adminDescription: issue.adminResponse?.message || "Pending",
            severity: issue.importance,
            status: issue.status,
            imageUrl: issue.imageUrl,
            district: issue.district || "",
            createdAt: issue.createdAt,
            respondedAt: issue.adminResponse?.respondedAt,
            category: issue.category,
            userInfo: issue.userInfo,
          }}
          onDelete={() => deleteIssue(issue._id)}
        />
      ))}
    </div>
  );
};

export default UserIssues;
