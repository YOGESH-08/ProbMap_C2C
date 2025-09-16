import React, { useEffect, useState } from "react";

export default function VolunteerIssues() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtIssues, setDistrictIssues] = useState([]);
  const [district, setDistrict] = useState("");
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/volunteer/status", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get status");
      setStatus(data);
      setDistrict(data.volunteerDistrict || "");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrictIssues = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/volunteer/district-issues",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load issues");
      setDistrictIssues(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (status?.volunteerStatus === "approved") fetchDistrictIssues();
  }, [status?.volunteerStatus]);

  const handleRegister = async () => {
    if (!district) {
      const d = prompt("Enter your district to register as volunteer:");
      if (!d) return;
      setDistrict(d);
    }
    try {
      const res = await fetch("http://localhost:5000/volunteer/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ district }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request");
      alert("Volunteer request submitted!");
      fetchStatus();
    } catch (e) {
      alert(e.message);
    }
  };

  const submitClaim = async (issueId) => {
    try {
      const fileEl = document.createElement("input");
      fileEl.type = "file";
      fileEl.accept = "image/*";
      fileEl.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const form = new FormData();
        form.append("issueId", issueId);
        form.append("proof", file);
        const res = await fetch(
          "http://localhost:5000/volunteer/submit-claim",
          {
            method: "POST",
            credentials: "include",
            body: form,
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to submit claim");
        alert("Claim submitted");
        fetchDistrictIssues();
      };
      fileEl.click();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!status || status.volunteerStatus === "none") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Volunteer Program</h2>
        <p>
          Register as a volunteer to help verify and resolve issues in your
          district.
        </p>
        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Your district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{ padding: 8, marginRight: 8 }}
          />
          <button onClick={handleRegister}>Register as Volunteer</button>
        </div>
      </div>
    );
  }

  if (status.volunteerStatus === "pending") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Volunteer Program</h2>
        <p>
          Your request is pending approval. We will notify you once approved.
        </p>
      </div>
    );
  }

  if (status.volunteerStatus === "rejected") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Volunteer Program</h2>
        <p>Your request was rejected. You may try again later.</p>
        {status.volunteerRejectionReason && (
          <p style={{ color: "#ff9800" }}>
            Reason: {status.volunteerRejectionReason}
          </p>
        )}
      </div>
    );
  }

  if (status.volunteerStatus === "removed") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Volunteer Program</h2>
        <p>Your volunteer access was removed.</p>
        {status.volunteerRemovalReason && (
          <p style={{ color: "#ff9800" }}>
            Reason: {status.volunteerRemovalReason}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Volunteer Dashboard</h2>
      <p>District: {status.volunteerDistrict}</p>
      <p>Points: {status.volunteerPoints}</p>

      <h3 style={{ marginTop: 20 }}>All Issues in Your District</h3>
      {districtIssues.length === 0 && <p>No issues found.</p>}
      <div style={{ display: "grid", gap: 12 }}>
        {districtIssues.map((issue) => (
          <div
            key={issue._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
              color: "#333",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{issue.title}</strong>
              <span>{issue.status}</span>
            </div>
            <div>{issue.description}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              {issue.district} • {new Date(issue.createdAt).toLocaleString()}
            </div>
            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="issue"
                style={{ maxWidth: 240, borderRadius: 6, marginTop: 8 }}
              />
            )}
            {issue.volunteerClaim?.status === "submitted" ? (
              <div style={{ marginTop: 8, color: "#ff9800" }}>
                Claim submitted. Awaiting admin review.
              </div>
            ) : issue.status !== "resolved" ? (
              <button
                style={{ marginTop: 8 }}
                onClick={() => submitClaim(issue._id)}
              >
                Submit Resolution Claim
              </button>
            ) : (
              <div style={{ marginTop: 8, color: "#4caf50" }}>
                Issue resolved.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
