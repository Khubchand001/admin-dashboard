import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  LogOut, 
  PlusCircle, 
  Stethoscope,
  Settings,
  ChevronRight
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  const nav = useNavigate();

  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleLogout = () => {
    onLogout();
    // App.jsx will handle navigation reactively
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col justify-between p-6 sticky top-0">
      
      {/* 🔝 TOP */}
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Stethoscope size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Medi<span className="text-indigo-600">Sync</span>
          </h2>
        </div>

        <div className="space-y-1.5 font-medium">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
          
          <NavLink to="/" className={linkClass}>
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} strokeWidth={2} />
              <span>Dashboard</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>

          <NavLink to="/doctors" className={linkClass}>
            <div className="flex items-center gap-3">
              <Users size={20} strokeWidth={2} />
              <span>Doctors</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>

          <NavLink to="/appointments" className={linkClass}>
            <div className="flex items-center gap-3">
              <CalendarDays size={20} strokeWidth={2} />
              <span>Appointments</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        </div>

        <div className="mt-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Settings</p>
          <div className="space-y-1.5 font-medium">
            <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300">
              <Settings size={20} strokeWidth={2} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔻 LOGOUT */}
      <div className="pt-6 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all duration-300 font-bold"
        >
          <LogOut size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}