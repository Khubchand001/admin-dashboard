import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Card({ title, value, icon: Icon, color, trend, trendValue }) {
  return (
    <div className="glass group p-6 rounded-3xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 bg-gradient-to-br ${color}`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-medium text-sm tracking-wide">{title}</span>
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
              }`}>
                {trend === 'up' ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
                {trendValue}%
              </span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 bg-gradient-to-br ${color} text-white`}>
          {Icon && <Icon size={24} strokeWidth={2.5} />}
        </div>
      </div>
      
      {/* Decorative pulse indicator */}
      <div className="absolute bottom-4 right-6 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
      </div>
    </div>
  );
}