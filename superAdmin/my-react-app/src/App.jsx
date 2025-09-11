import React, { useEffect, useState } from "react";
import "./App.css";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ email: "", fullName: "", city: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterCity, setFilterCity] = useState("All");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/superadmin", { credentials: "include" });
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/superadmin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setAdmins((prev) => [data.admin, ...prev]);
      setForm({ email: "", fullName: "", city: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/superadmin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const cities = ["All", ...new Set(admins.map((a) => a.city))];
  const filteredAdmins = filterCity === "All" ? admins : admins.filter((a) => a.city === filterCity);

  return (
    <div className="dashboard-dark-container">
      <h2>Super Admin Dashboard</h2>

      <form onSubmit={handleCreate} className="form-create-admin">
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <nav className="city-nav">
        {cities.map((c) => (
          <button
            key={c}
            className={filterCity === c ? "active" : ""}
            onClick={() => setFilterCity(c)}
          >
            {c}
          </button>
        ))}
      </nav>

      <div className="admin-cards">
        {filteredAdmins.map((admin) => (
          <div className="admin-card" key={admin._id}>
            <h3>{admin.fullName}</h3>
            <p>{admin.email}</p>
            <p>City: {admin.city}</p>
            <button className="delete-btn" onClick={() => handleDelete(admin._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
