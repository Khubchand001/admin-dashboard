import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.access_token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      // ✅ ROLE BASED REDIRECT
      if (payload.role === "admin") {
        nav("/", { replace: true });
      } else if (payload.role === "doctor") {
        nav("/doctor", { replace: true });
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 shadow w-80">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}