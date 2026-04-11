import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import {
  Stethoscope,
  Award,
  ExternalLink,
  Search,
  MoreVertical,
  Plus,
  User,
  X,
  Calendar,
  FileText,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings
} from "lucide-react";

export default function Doctors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile, availability, reports
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Management Data
  const [appointments, setAppointments] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "", experience: "", image: "" });
  const [editForm, setEditForm] = useState({ name: "", specialization: "", experience: "" });

  const fileInputRef = useRef(null);

  const loadDoctors = () => {
    setLoading(true);
    API.get("/doctors")
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching doctors", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const openManager = (doctor) => {
    setSelectedDoctor(doctor);
    setEditForm({ name: doctor.name, specialization: doctor.specialization, experience: doctor.experience });
    setIsModalOpen(true);
    // Fetch doctor-specific details
    API.get(`/doctors/${doctor.id}`).then(res => {
      // Assuming backend returns appointments in a full profile or we fetch them separately
      // For now, let's fetch associated data
      API.get("/appointments/").then(appRes => {
        const filtered = appRes.data.filter(a => a.doctor_id === doctor.id);
        setAppointments(filtered);
      });
      // Mocking availability for now, ideally fetch from /availability/my or similar
    });
  };

  const handleUpdateDoctor = async () => {
    setIsUpdating(true);
    try {
      await API.patch(`/doctors/${selectedDoctor.id}`, editForm);
      alert("Profile updated successfully!");
      loadDoctors();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await API.post("/doctors", newDoctor);
      setIsAddingDoctor(false);
      setNewDoctor({ name: "", specialization: "", experience: "", image: "" });
      loadDoctors();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const closeManager = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setAppointments([]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdating(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await API.post("/api/upload/image", formData);
      const imageUrl = uploadRes.data.image_url.replace("", "");

      // Update doctor record
      await API.patch(`/doctors/${selectedDoctor.id}`, { image: imageUrl });

      // Refresh
      loadDoctors();
      setSelectedDoctor({ ...selectedDoctor, image: imageUrl });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      doctor_id: selectedDoctor.id,
      date: formData.get("date"),
      start_time: formData.get("start"),
      end_time: formData.get("end")
    };

    setIsUpdating(true);
    try {
      await API.post("/availability/", payload);
      alert("Availability added!");
      e.target.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredDoctors = data.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* 🔝 Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Doctors</h1>
            <p className="text-slate-500 font-medium">Coordinate and manage healthcare providers</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-600/10 transition-all w-72 font-medium outline-none shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsAddingDoctor(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-100 font-bold text-sm"
            >
              <Plus size={18} strokeWidth={3} />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* 📊 Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold animate-pulse">Syncing Staff Records...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((d) => (
              <div key={d.id} className="glass p-8 rounded-[2.5rem] relative group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-10 -mt-10 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      {d.image ? (
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL || ""}/uploads/${d.image.replace("uploads/", "")}`}
                          alt={`Dr. ${d.name}`}
                          className="w-20 h-20 rounded-3xl object-cover shadow-lg border-4 border-white"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-3xl bg-indigo-50 border-4 border-white flex items-center justify-center text-indigo-600 shadow-lg font-bold">
                          {d.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <button
                      onClick={() => openManager(d)}
                      className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{d.name}</h3>
                    <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg w-fit">
                      <Stethoscope size={12} />
                      <span>{d.specialization}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-8 border-t border-slate-100 pt-6">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Experience</p>
                      <div className="flex items-center gap-1.5">
                        <Award size={14} className="text-amber-500" />
                        <span className="text-sm font-bold text-slate-700">{d.experience}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openManager(d)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    <Settings size={14} />
                    <span>Manage Doctor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-[3rem] p-24 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-200 mb-8 px-4 border border-rose-100">
              <Stethoscope size={48} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">No results</h3>
          </div>
        )}

        {/* 🛠️ Doctor Management Modal */}
        {isModalOpen && selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

              {/* Header */}
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 font-bold text-xl">
                    {selectedDoctor.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${selectedDoctor.image.replace("uploads/", "")}`}
                        alt={selectedDoctor.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : selectedDoctor.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedDoctor.name}</h2>
                    <p className="text-sm text-slate-500 font-medium">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <button onClick={closeManager} className="p-3 bg-white hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors shadow-sm">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-10 py-4 flex items-center gap-8 border-b border-slate-100 overflow-x-auto no-scrollbar">
                {[
                  { id: "profile", label: "Profile Settings", icon: User },
                  { id: "availability", label: "Availability Slots", icon: Calendar },
                  { id: "reports", label: "Reports & Records", icon: FileText }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-4 pt-2 font-bold text-sm transition-all relative ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">

                {activeTab === "profile" && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">Profile Image</h3>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        disabled={isUpdating}
                        className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                        <span>Change Photo</span>
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Experience</label>
                        <input
                          value={editForm.experience}
                          onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleUpdateDoctor}
                        disabled={isUpdating}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
                      >
                        {isUpdating ? "Saving Changes..." : "Save Profile Updates"}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "availability" && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    <form onSubmit={handleAddAvailability} className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Plus size={20} strokeWidth={3} />
                        <span>Add New Slot</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Date</label>
                          <input name="date" type="date" required className="w-full px-4 py-3 bg-indigo-500/50 border border-indigo-400/30 rounded-xl text-white outline-none focus:ring-4 focus:ring-white/10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Start Time</label>
                          <input name="start" type="time" required className="w-full px-4 py-3 bg-indigo-500/50 border border-indigo-400/30 rounded-xl text-white outline-none focus:ring-4 focus:ring-white/10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">End Time</label>
                          <input name="end" type="time" required className="w-full px-4 py-3 bg-indigo-500/50 border border-indigo-400/30 rounded-xl text-white outline-none focus:ring-4 focus:ring-white/10" />
                        </div>
                      </div>
                      <button type="submit" disabled={isUpdating} className="mt-8 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95 disabled:opacity-50">
                        {isUpdating ? "Adding..." : "Add Time Slot"}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    {appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map(app => (
                          <div key={app.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-600/30 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <FileText size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{app.patient_name}</p>
                                <p className="text-xs text-slate-400 font-medium">{app.date} • {app.time}</p>
                              </div>
                            </div>

                            {app.report ? (
                              <button
                                onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"}/uploads/${app.report.replace("uploads/", "")}`)}
                                className="flex items-center gap-2 text-indigo-600 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                              >
                                <ExternalLink size={14} />
                                <span>Open Report</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Report</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-slate-400 italic font-medium">
                        <AlertCircle size={32} className="mb-2 opacity-30" />
                        <p>No appointments found for this doctor.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <p>Doctor ID: #{selectedDoctor.id.toString().padStart(4, '0')}</p>
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  <span>Verified Practitioner</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ➕ Add Doctor Modal */}
        {isAddingDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Add New Doctor</h3>
                <button onClick={() => setIsAddingDoctor(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddDoctor} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input
                    required
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    placeholder="Dr. John Smith"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Specialization</label>
                  <input
                    required
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    placeholder="Cardiologist"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Experience (Years)</label>
                  <input
                    required
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    placeholder="12+ Years"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {isUpdating ? "Registering..." : "Complete Registration"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}