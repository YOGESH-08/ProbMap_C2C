import React, { useEffect, useState } from "react";
import "./App.css";

const SuperAdminDashboard = () => {
  // ---------------- Authentication ----------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const superAdminEmail = "vit@gmail.com";
    const superAdminPassword = "vit123";

    if (loginForm.email === superAdminEmail && loginForm.password === superAdminPassword) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "" });
  };

  // ---------------- Admin Dashboard ----------------
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ email: "", fullName: "", city: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterCity, setFilterCity] = useState("All");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/superadmin", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchAdmins();
  }, [isAuthenticated]);

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
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`http://localhost:5000/superadmin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete admin");
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const cities = ["All", ...new Set(admins.map((a) => a.city))];
  const filteredAdmins = filterCity === "All" ? admins : admins.filter((a) => a.city === filterCity);

  // ---------------- Render ----------------
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>Super Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
        {authError && <p className="error-message">{authError}</p>}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header>
        <h2>Super Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* Create Admin Form */}
      <form onSubmit={handleCreate} className="form-create-admin">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* City Filter */}
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

      {/* Admin Cards */}
      <div className="admin-cards">
        {filteredAdmins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          filteredAdmins.map((admin) => (
            <div className="admin-card" key={admin._id}>
              <h3>{admin.fullName}</h3>
              <p>Email: {admin.email}</p>
              <p>City: {admin.city}</p>
              <button className="delete-btn" onClick={() => handleDelete(admin._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
