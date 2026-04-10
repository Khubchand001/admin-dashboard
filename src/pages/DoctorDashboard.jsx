import { useEffect, useState } from "react";
import API from "../api/axios";
import { LogOut, Heart, Calendar, User, Clock, ChevronRight } from "lucide-react";

export default function DoctorDashboard({ onLogout }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", specialization: "", experience: "" });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch stats and appointments
    API.get("/appointments/my").then(res => setPatients(res.data));
    
    // Fetch profile
    API.get("/auth/me").then(res => {
      // Assuming 'me' structure includes doctor details if linked
      if (res.data.doctor_id) {
         API.get(`/doctors/${res.data.doctor_id}`).then(docRes => setProfile(docRes.data));
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await API.patch("/doctors/profile", profile);
      setIsSettingsOpen(false);
      alert("Settings saved!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 🔝 Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 py-5 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
            <Heart size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doctor Portal</h1>
            <p className="text-slate-500 text-xs font-medium">MediSync Health Systems</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all font-bold text-sm"
          >
            <User size={18} />
            <span>Profile Settings</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="p-10 max-w-6xl mx-auto w-full flex-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">My Appointments</h2>
          <p className="text-slate-500 font-medium">You have {patients.length} scheduled consultations for today.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="glass rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Name</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length > 0 ? patients.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <User size={20} />
                        </div>
                        <span className="font-bold text-slate-700">{p.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {p.date}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {p.time}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Confirmed
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-medium italic">No appointments found for today.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="p-10 text-center border-t border-slate-100 bg-white">
        <p className="text-slate-400 text-xs font-medium">
          &copy; 2026 MediSync Systems • Doctor Portal v2.0
        </p>
      </footer>

      {/* ⚙️ Profile Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Account Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronRight size={20} className="rotate-90 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-5">
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                <input required value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Specialization</label>
                <input required value={profile.specialization} onChange={e => setProfile({...profile, specialization: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Experience</label>
                <input required value={profile.experience} onChange={e => setProfile({...profile, experience: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
              </div>
              
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Update Professional Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}