"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function GeneratorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);

  // 🔐 Auth guard to ensure only logged-in users access the dashboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // 📡 Fetch the latest AI Grid Intelligence snapshot [cite: 839, 847]
  useEffect(() => {
    const fetchForecast = async () => {
      const snap = await getDoc(doc(db, "forecast_results", "latest"));
      if (snap.exists()) {
        setForecast(snap.data());
      }
    };
    fetchForecast();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-[calc(100vh-73px)] bg-[#F0F7FF]">
      
      {/* --- SIDEBAR --- 
          Pinned to the left, fixed width, and occupies full height below the header
      */}
      <aside className="w-64 bg-white border-r border-blue-100 flex flex-col sticky top-[73px] h-[calc(100vh-73px)] shrink-0">
        <div className="p-6 border-b border-gray-50">
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            VERGE
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/generator" className="flex items-center space-x-3 p-3 rounded-lg bg-violet-50 text-violet-700 font-semibold transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Overview</span>
          </Link>
          <Link href="/intelligence" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>Grid Intelligence</span>
          </Link>
          <Link href="/generator/contracts" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>VPPA Contracts</span>
          </Link>
          <Link href="/generator/recs" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>REC Inventory</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-600">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">YD</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Yash Dingar</p>
              <p className="text-xs text-gray-400 truncate">Generator Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- 
          Occupies all remaining width
      */}
      <main className="flex-1 p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Generator Overview</h1>
            <p className="text-gray-500 text-sm">Real-time production and contractual status[cite: 1042].</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Time</p>
            <p className="text-sm font-mono text-gray-600">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Summary Metric Cards [cite: 1043, 1044, 1045, 1046] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm transition-hover hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Green Generation</p>
            <p className="text-2xl font-bold text-gray-900">12,500 <span className="text-sm font-medium text-gray-500">MWh</span></p>
            <p className="text-xs text-emerald-500 mt-2 font-medium">↑ 12% increase</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm transition-hover hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sold to Anchors</p>
            <p className="text-2xl font-bold text-gray-900">9,000 <span className="text-sm font-medium text-gray-500">MWh</span></p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
              <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm transition-hover hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available RECs</p>
            <p className="text-2xl font-bold text-gray-900">3,500</p>
            <p className="text-xs text-gray-400 mt-2 italic">Ready for issuance [cite: 1045]</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm flex flex-col justify-between transition-hover hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Plant Status</p>
            <div className="flex items-center text-emerald-600">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <p className="text-xl font-bold uppercase tracking-tight italic">Operational [cite: 1046]</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid for Tables and Intelligence Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active VPPA Contracts Table [cite: 1047] */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Active Anchor Contracts</h2>
              <button className="text-violet-600 text-sm font-bold hover:underline">View Ledger</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Anchor Buyer</th>
                    <th className="px-6 py-4">Energy (MWh)</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-center">REC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-700 underline decoration-violet-200">ABC Cement Ltd</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">3,000</td>
                    <td className="px-6 py-4 text-gray-600">10 Years</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">ISSUED</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-700 underline decoration-violet-200">XYZ Steel Corp</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">6,000</td>
                    <td className="px-6 py-4 text-gray-600">15 Years</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">ISSUED</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Grid Health Monitoring Snapshot [cite: 1048] */}
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Grid Health Awareness
              </h2>
              
              {forecast ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Stability Risk</p>
                    <p className={`text-2xl font-black ${forecast.riskLevel === 'Low' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {forecast.riskLevel.toUpperCase()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                      <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Region</p>
                      <p className="text-sm font-bold text-violet-900">{forecast.region}</p>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                      <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Congestion</p>
                      <p className="text-sm font-bold text-violet-900">{forecast.congestionAlert ? 'ACTIVE' : 'NONE'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400 italic text-sm">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-violet-400 rounded-full animate-spin mb-2"></div>
                  Syncing grid intelligence...
                </div>
              )}
            </div>
            
            <Link href="/intelligence" className="mt-8 w-full py-3 bg-violet-600 text-white text-center rounded-xl font-bold text-sm shadow-lg shadow-violet-100 hover:bg-violet-700 transition-all transform active:scale-95">
              Launch Smart Grid Pro
            </Link>
          </div>
        </div>

        {/* Informational Note for Generators [cite: 1049] */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
          <p className="text-xs text-blue-700 flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Grid intelligence data is provided for planning awareness and situational decision support. Market transactions and automated dispatch remain isolated within their respective functional modules to ensure regulatory safety[cite: 1049, 1050].
          </p>
        </div>
      </main>
    </div>
  );
}