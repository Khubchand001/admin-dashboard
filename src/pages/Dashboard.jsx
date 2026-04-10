import { useEffect, useState } from "react";
import API from "../api/axios";
import Card from "../components/Card";
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Area, 
  AreaChart 
} from "recharts";
import { 
  Users, 
  CalendarCheck, 
  Wallet, 
  Star, 
  Search, 
  Bell, 
  Plus,
  TrendingUp,
  FilterX
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [chart, setChart] = useState([]);
  const [activities, setActivities] = useState({
    patient_inflow: 0,
    doctor_availability: 0,
    resource_usage: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState("Last 7 Days");

  useEffect(() => {
    API.get("/analytics/dashboard").then(res => setData(res.data));
    API.get("/analytics/appointments-per-day").then(res => setChart(res.data));
    API.get("/analytics/activities").then(res => setActivities(res.data));
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing Analytics...</p>
      </div>
    </div>
  );

  const stats = [
    { 
      title: "Total Doctors", 
      value: data.overview.total_doctors, 
      icon: Users, 
      color: "from-indigo-600 to-indigo-400", 
      trend: "up", 
      trendValue: "12"
    },
    { 
      title: "Appointments", 
      value: data.overview.total_appointments, 
      icon: CalendarCheck, 
      color: "from-emerald-600 to-emerald-400", 
      trend: "up", 
      trendValue: "8.4"
    },
    { 
      title: "Total Revenue", 
      value: `₹${data.overview.revenue}`, 
      icon: Wallet, 
      color: "from-amber-500 to-amber-300", 
      trend: "down", 
      trendValue: "2.1"
    },
    { 
      title: "Average Rating", 
      value: data.ratings.average_rating, 
      icon: Star, 
      color: "from-rose-500 to-rose-300", 
      trend: "up", 
      trendValue: "4.5"
    }
  ];

  const filteredStats = stats.filter(stat => 
    stat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock filtering chart data based on period
  const filteredChart = period === "Last 7 Days" ? chart.slice(-7) : chart;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen overflow-y-auto">
      {/* 🔝 Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 py-5 sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Welcome back, Administrator
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={18} />
            <input 
              type="text" 
              placeholder="Search metrics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-4 focus:ring-indigo-600/10 transition-all w-72 font-medium"
            />
          </div>
          <div className="flex items-center gap-3 border-l border-slate-100 pl-6 ml-2">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden cursor-pointer hover:border-indigo-200 transition-all">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto">
        {/* 📈 Stats Grid with Search Filtering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStats.length > 0 ? (
            filteredStats.map((stat, idx) => (
              <Card key={idx} {...stat} />
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem]">
              <FilterX size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-400 font-bold tracking-tight">No metrics matching "{searchQuery}"</p>
              <button onClick={() => setSearchQuery("")} className="mt-2 text-indigo-600 font-bold text-sm hover:underline">Clear search</button>
            </div>
          )}
        </div>

        {/* 📊 Charts Section - Premium Designed Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Appointment Dynamics</h3>
                  <div className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    <TrendingUp size={10} />
                    <span>+2.4%</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium">Visualizing flow and scheduling patterns</p>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-slate-100/80 backdrop-blur-sm border-none rounded-xl text-xs font-bold px-4 py-2.5 text-slate-600 outline-none focus:ring-4 focus:ring-indigo-600/10 cursor-pointer transition-all"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
                <button className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            
            <div className="h-[380px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCountPremium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <filter id="shadow" height="200%">
                      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#4f46e5" floodOpacity="0.2"/>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                              <p className="text-sm font-bold tracking-tight">
                                {payload[0].value} <span className="text-slate-400 font-medium ml-1">Appointments</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4f46e5" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCountPremium)" 
                    filter="url(#shadow)"
                    activeDot={{ 
                      r: 8, 
                      fill: '#fff', 
                      stroke: '#4f46e5', 
                      strokeWidth: 4,
                      className: 'drop-shadow-lg'
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Background pattern */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />
          </div>

          <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-between shadow-xl shadow-slate-200/50">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sync Health</h3>
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <TrendingUp size={16} />
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-8">Real-time resource utilization</p>
              
              <div className="space-y-8">
                {[
                  { label: 'Patient Inflow', value: activities.patient_inflow || 85, color: 'from-indigo-600 to-indigo-400' },
                  { label: 'Doctor Availability', value: activities.doctor_availability || 62, color: 'from-emerald-600 to-emerald-400' },
                  { label: 'Resource Usage', value: activities.resource_usage || 44, color: 'from-amber-500 to-amber-300' },
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                      <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">{item.value}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-lg`} 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 mt-10 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-indigo-200">
              <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
                <Plus size={160} strokeWidth={2.5} />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Unlock Pro Tools</h4>
                <p className="text-indigo-100 text-[10px] leading-relaxed font-medium opacity-80 mb-6 max-w-[180px]">Access advanced medical forecasting and custom patient cohorts tracking features.</p>
                <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:shadow-white/20 transition-all hover:scale-105 active:scale-95">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}