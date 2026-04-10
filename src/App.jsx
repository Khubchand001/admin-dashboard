import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import DoctorLogin from "./pages/DoctorLogin";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";

function App() {
  const token = localStorage.getItem("token");

  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch {
      localStorage.removeItem("token");
    }
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ LOGIN ROUTES (OUTSIDE LAYOUT) */}
       
        <Route path="/doctor-login" element={<DoctorLogin />} />
         <Route
           path="/login"
           element={
             localStorage.getItem("token") ? <Navigate to="/" /> : <Login />
           }
         />
        {/* ✅ ADMIN LAYOUT */}
        <Route
          path="/*"
          element={
            token && role === "admin" ? (
              <div className="flex">
                <Sidebar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/appointments" element={<Appointments />} />
                </Routes>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ DOCTOR ROUTE */}
        <Route
          path="/doctor"
          element={
            token && role === "doctor" ? (
              <DoctorDashboard />
            ) : (
              <Navigate to="/doctor-login" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;