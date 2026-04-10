import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-blue-500 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-200"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="w-64 h-screen bg-white shadow-xl flex flex-col justify-between p-5">

      {/* 🔝 TOP */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-blue-600">
          🏥 Admin Panel
        </h2>

        <nav className="space-y-3">

          <NavLink to="/" className={linkClass}>
            📊 <span>Dashboard</span>
          </NavLink>

          <NavLink to="/doctors" className={linkClass}>
            👨‍⚕️ <span>Doctors</span>
          </NavLink>

          <NavLink to="/appointments" className={linkClass}>
            📅 <span>Appointments</span>
          </NavLink>

        </nav>
      </div>

      {/* 🔻 LOGOUT */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-200"
        >
          🚪 Logout
        </button>
      </div>

    </div>
  );
}