import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", form);

      alert("Signup successful");

      // Redirect to marketplace after signup
      navigate("/marketplace");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "250px" }}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "250px" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "250px" }}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "265px" }}
        >
          <option value="customer">Customer</option>
          <option value="brand">Brand</option>
        </select>

        <button type="submit" style={{ padding: "8px 20px" }}>
          Signup
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}