import React, { useEffect, useState } from "react";
import Acard from "./Acard";

const UserIssues = () => {
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
      console.log("GOT user issues : ",data);
      if (!res.ok) throw new Error(data.error || "Failed to fetch issues");
      setIssues(data);
    } catch (err) {
        console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIssues();
  }, []);

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const res = await fetch(`/api/issues/${id}`, {
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
  if (issues.length === 0) return <p>No issues raised yet.</p>;

  return (
    <div className="space-y-6">
      {issues.map((issue) => (
        <Acard
          key={issue._id}
          details={{
            id: issue._id,
            name: issue.title,
            location: `${issue.location.latitude}, ${issue.location.longitude}`,
            description: issue.description,
            adminDescription: issue.adminResponse?.message || "Pending",
            severity: issue.severity,
            status: issue.status,
          }}
          onDelete={() => deleteIssue(issue._id)}
        />
      ))}
    </div>
  );
};

export default UserIssues;
