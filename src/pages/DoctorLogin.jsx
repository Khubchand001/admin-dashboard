import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.access_token);

      const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));

      if (payload.role === "doctor") {
        nav("/doctor");
      } else {
        alert("Not a doctor account");
      }

    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="p-6 bg-white shadow w-80">
        <h2 className="text-xl mb-4">Doctor Login</h2>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-2"
          onChange={e => setForm({...form, username: e.target.value})}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-2"
          onChange={e => setForm({...form, password: e.target.value})}
        />

        <button onClick={handleLogin} className="bg-green-500 text-white w-full p-2">
          Login
        </button>
      </div>
    </div>
  );
}