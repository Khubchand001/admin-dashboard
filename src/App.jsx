import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import DoctorLogin from "./pages/DoctorLogin";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: null,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAuth({ token, role: payload.role, loading: false });
      } catch {
        localStorage.removeItem("token");
        setAuth({ token: null, role: null, loading: false });
      }
    } else {
      setAuth({ token: null, role: null, loading: false });
    }
  }, []);

  const handleLogin = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      setAuth({ token, role: payload.role, loading: false });
    } catch {
      console.error("Invalid token during login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, role: null, loading: false });
  };

  if (auth.loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        
        {/* ✅ PUBLIC ROUTES */}
        <Route 
          path="/login" 
          element={
            auth.token ? <Navigate to={auth.role === "admin" ? "/" : "/doctor"} replace /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/doctor-login" 
          element={
            auth.token ? <Navigate to={auth.role === "doctor" ? "/doctor" : "/"} replace /> : <DoctorLogin onLogin={handleLogin} />
          } 
        />

        {/* ✅ ADMIN ROUTES */}
        <Route
          path="/*"
          element={
            auth.token && auth.role === "admin" ? (
              <div className="flex bg-slate-50 min-h-screen">
                <Sidebar onLogout={handleLogout} />
                <div className="flex-1 overflow-x-hidden">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ✅ DOCTOR ROUTES */}
        <Route
          path="/doctor"
          element={
            auth.token && auth.role === "doctor" ? (
              <DoctorDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/doctor-login" replace />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;