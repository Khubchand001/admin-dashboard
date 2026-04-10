import { useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { 
  User, 
  Lock, 
  ArrowRight, 
  Stethoscope, 
  ShieldCheck,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams();
      params.append("username", form.username);
      params.append("password", form.password);
      
      const res = await API.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const token = res.data.access_token;
      
      onLogin(token);
    } catch (err) {
      let message = "Invalid credentials. Please try again.";
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail[0]?.msg) {
        message = detail[0].msg;
      } else if (detail && typeof detail === "object" && detail.msg) {
        message = detail.msg;
      }
      
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 mb-6 group transition-transform hover:scale-105">
            <Stethoscope size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Admin Control Panel Access</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  required
                  placeholder="Enter admin username"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 transition-all outline-none"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 transition-all outline-none"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100/50">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <ShieldCheck size={14} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Secure Access Point</span>
              </div>
              
              <p className="text-slate-400 text-sm font-medium">
                Not an admin? {" "}
                <Link to="/doctor-login" className="text-indigo-600 font-bold hover:underline">Doctor Portal</Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          &copy; 2026 MediSync Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
}