import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { 
  Calendar, 
  Clock, 
  Trash2, 
  Search, 
  MoreHorizontal,
  Plus,
  X,
  FileUp,
  FileText,
  ExternalLink,
  Loader2
} from "lucide-react";

export default function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [isUploading, setIsUploading] = useState(null); // stores app.id being updated
  
  const [newAppointment, setNewAppointment] = useState({
    patient_name: "",
    age: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    doctor_id: ""
  });

  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    API.get("/appointments/")
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    API.get("/doctors").then(res => setDoctors(res.data));
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/appointments/", newAppointment);
      setIsAddingAppointment(false);
      setNewAppointment({
        patient_name: "",
        age: "",
        phone: "",
        address: "",
        date: "",
        time: "",
        doctor_id: ""
      });
      load();
    } catch (err) {
      console.error("Booking failed", err);
      alert("Error booking appointment. Please check if the doctor is available at that time.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportUpload = async (e, appointmentId) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(appointmentId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload the PDF
      const uploadRes = await API.post("/api/upload/pdf", formData);
      const fileName = uploadRes.data.file_url.replace("uploads/", "");
      
      // 2. Patch the appointment record
      await API.patch(`/appointments/${appointmentId}`, { report: fileName });
      
      // 3. Refresh data
      load();
      alert("Medical report uploaded successfully!");
    } catch (err) {
      console.error("Report upload failed", err);
      alert("Failed to upload report.");
    } finally {
      setIsUploading(null);
    }
  };

  const deleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      API.delete(`/appointments/${id}`).then(() => load());
    }
  };

  const filteredData = data.filter(item => 
    item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔝 Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Appointments</h1>
            <p className="text-slate-500 font-medium">Manage and monitor patient schedules</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Find patient..." 
                value={searchTerm}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-600/10 transition-all w-64 font-medium outline-none shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsAddingAppointment(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold text-sm"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="hidden sm:inline">Add New</span>
            </button>
          </div>
        </div>

        {/* 📊 Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold animate-pulse">Syncing Appointments...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="glass rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Clinical Report</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/40">
                  {filteredData.map((a) => (
                    <tr key={a.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm group-hover:scale-110 transition-transform">
                            {a.patient_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{a.patient_name}</p>
                            <p className="text-xs text-slate-400 font-medium">ID: #APT-{a.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className="text-indigo-500" />
                            <span className="text-sm font-bold">{a.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} />
                            <span className="text-xs font-medium">{a.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {a.report ? (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                              <FileText size={16} />
                            </div>
                            <button 
                              onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"}/uploads/${a.report.replace("uploads/", "")}`)}
                              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <span>View PDF</span>
                              <ExternalLink size={10} />
                            </button>
                            <button 
                              onClick={() => {
                                setIsUploading(a.id);
                                fileInputRef.current.click();
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest"
                            >
                              Replace
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button 
                              disabled={isUploading === a.id}
                              onClick={() => {
                                setIsUploading(a.id);
                                fileInputRef.current.click();
                              }}
                              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-[10px] uppercase tracking-wider"
                            >
                              {isUploading === a.id ? <Loader2 className="animate-spin" size={14} /> : <FileUp size={14} />}
                              <span>{isUploading === a.id ? "Uploading..." : "Upload Report"}</span>
                            </button>
                          </div>
                        )}
                        {/* Global hidden file input for reports */}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={(e) => handleReportUpload(e, isUploading)} 
                          className="hidden" 
                          accept="application/pdf" 
                        />
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                          Confirmed
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Options"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          <button 
                            onClick={() => deleteAppointment(a.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Cancel Appointment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass rounded-[3rem] p-24 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200 mb-8 px-4 border border-indigo-100">
              <Calendar size={48} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">No results</h3>
          </div>
        )}

        {/* 🎫 Book Appointment Modal */}
        {isAddingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">New Consultation</h3>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Patient Intake Form</p>
                </div>
                <button onClick={() => setIsAddingAppointment(false)} className="p-3 bg-white hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="p-10">
                {/* Form fields same as before, keeping it simple for brevity but fully functional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Patient Name</label>
                      <input required value={newAppointment.patient_name} onChange={e => setNewAppointment({...newAppointment, patient_name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" placeholder="Ex: Rahul Sharma" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Age</label>
                        <input required type="number" value={newAppointment.age} onChange={e => setNewAppointment({...newAppointment, age: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" placeholder="25" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Phone</label>
                        <input required value={newAppointment.phone} onChange={e => setNewAppointment({...newAppointment, phone: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" placeholder="+91..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Address</label>
                      <input required value={newAppointment.address} onChange={e => setNewAppointment({...newAppointment, address: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" placeholder="City, State" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Select Doctor</label>
                      <select required value={newAppointment.doctor_id} onChange={e => setNewAppointment({...newAppointment, doctor_id: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none appearance-none cursor-pointer">
                        <option value="">Choose a specialist...</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Date</label>
                        <input required type="date" value={newAppointment.date} onChange={e => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Time</label>
                        <input required type="time" value={newAppointment.time} onChange={e => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-bold text-base hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-100 disabled:opacity-50">
                  {loading ? "Processing..." : "Confirm Appointment Booking"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}