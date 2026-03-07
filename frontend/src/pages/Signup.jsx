import { useState } from "react";
import API from "../api/axios";

export default function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    await API.post("/auth/signup", form);

    alert("Signup successful");

  };

  return (
    <form onSubmit={handleSubmit}>

      <input placeholder="Name"
      onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input placeholder="Email"
      onChange={(e)=>setForm({...form,email:e.target.value})} />

      <input placeholder="Password"
      type="password"
      onChange={(e)=>setForm({...form,password:e.target.value})} />

      <select
      onChange={(e)=>setForm({...form,role:e.target.value})}>

        <option value="customer">Customer</option>
        <option value="brand">Brand</option>

      </select>

      <button>Signup</button>

    </form>
  );
}