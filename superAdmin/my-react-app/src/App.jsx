import React, { useState } from "react";
import "./App.css";

const dummyUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    city: "Bengaluru",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    city: "Mumbai",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    city: "Delhi",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    city: "Bengaluru",
  },
];

const UserCard = ({ user }) => (
  <div className="admin-card">
    <h3>{user.name}</h3>
    <p>Email: {user.email}</p>
    <p>City: {user.city}</p>
    <button className="delete-btn">Delete Admin</button>
  </div>
);

const App = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    city: "",
    password: "",
  });

  return (
    <div
      className="dashboard-dark-container"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <h2>Super Admin Dashboard</h2>
      <form
        className="form-create-admin"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="form-input-row" style={{ flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{ minWidth: 0 }}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ minWidth: 0 }}
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
            style={{ minWidth: 0 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ minWidth: 0 }}
          />
        </div>
        <button type="submit">Create Admin</button>
      </form>
      <div className="city-nav">
        <button className="active">All</button>
        <button>Bengaluru</button>
        <button>Mumbai</button>
        <button>Delhi</button>
      </div>
      <div className="admin-cards">
        {dummyUsers.map((user, idx) => (
          <UserCard user={user} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default App;
