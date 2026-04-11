"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const WINDOW_SIZE = 12; // 60 minutes of history

export default function IntelligencePage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [snapshots, setSnapshots] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.replace("/login"); return; }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  const fetchIntelligence = async () => {
    const q = query(collection(db, "grid_intelligence"), orderBy("timestamp", "desc"), limit(WINDOW_SIZE));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => d.data()).reverse();
    setSnapshots(data);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchIntelligence();
    const interval = setInterval(fetchIntelligence, 10000);
    return () => clearInterval(interval);
  }, []);

  if (authLoading || !snapshots.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const latest = snapshots[snapshots.length - 1];
  const riskColor = latest?.risk_level === "HIGH" ? "text-red-600 bg-red-50" : latest?.risk_level === "MEDIUM" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* HEADER & NAV */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 italic uppercase tracking-tight">Grid Intelligence <span className="text-violet-600">Pro</span></h1>
          <p className="text-sm text-gray-500 font-medium">Real-time Decision Support Layer • Eastern Regional Grid [cite: 1471]</p>
        </div>
        <div className="flex gap-2">
          <Link href="/intelligence/model" className="px-4 py-2 bg-white border border-violet-200 text-violet-600 rounded-lg text-sm font-bold hover:bg-violet-50 transition-all">View Architecture</Link>
          <Link href="/intelligence/forecast" className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all">Deep Forecast</Link>
          <button onClick={() => router.back()} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200">Back</button>
        </div>
      </div>

      {/* LIVE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Stability Status", val: latest?.risk_level, color: riskColor, desc: "Regional Risk Index" },
          { label: "Congestion Probability", val: `${(latest?.congestion_probability * 100).toFixed(1)}%`, desc: "Line flow limits [cite: 986]" },
          { label: "Load Shedding Risk", val: `${(latest?.load_shedding_risk * 100).toFixed(1)}%`, desc: "Probabilistic estimation" },
          { label: "System Risk Score", val: latest?.grid_risk_index?.toFixed(2), desc: "Uncertainty-based index" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color || 'text-gray-900'}`}>{stat.val}</p>
            <p className="text-[10px] text-gray-400 mt-2 font-medium italic">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">System-Level Risk Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={snapshots.map(s => ({ time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), risk: s.grid_risk_index }))}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Area type="monotone" dataKey="risk" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Node-Level Stress Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={snapshots.map(s => ({ time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), DVC: s.node_risk?.DVC, BSEB: s.node_risk?.BSEB, WBSEB: s.node_risk?.WBSEB }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip />
              <Line type="monotone" dataKey="DVC" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="BSEB" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="WBSEB" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADVISORY SECTION */}
      <div className="bg-violet-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-violet-200">
        <div className="relative z-10 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-violet-300">AI System Recommendation [cite: 1883]</h2>
          <p className="text-2xl font-light italic leading-relaxed">"{latest?.recommendation || "System stable. Monitoring 5-minute resolution patterns."}"</p>
          <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-violet-400 uppercase tracking-tighter">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Disclaimer: Non-intrusive decision support. No automated market execution. [cite: 847, 1188]
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
      </div>
    </div>
  );
}