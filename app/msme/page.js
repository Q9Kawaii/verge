"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MSMEDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/login");
      } else {
        // Fetch only contracts belonging to this MSME
        const q = query(collection(db, "contracts"), where("msmeEmail", "==", u.email));
        const snap = await getDocs(q);
        setContracts(snap.docs.map(doc => doc.data()));
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // Calculations for summary cards
  const totalEnergy = contracts.reduce((acc, c) => acc + (c.energyMWh || 0), 0);
  const avgCost = contracts.length > 0 
    ? (contracts.reduce((acc, c) => acc + (c.price || 0), 0) / contracts.length).toFixed(2) 
    : 0;
  // Estimated savings: assuming grid price is ₹8.5
  const savings = totalEnergy * (8.5 - avgCost) * 1000; 

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex w-full min-h-[calc(100vh-73px)] bg-[#F0F7FF]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-blue-100 flex flex-col sticky top-[73px] h-[calc(100vh-73px)] shrink-0">
        <div className="p-6 border-b border-gray-50">
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">VERGE</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-medium">
          <Link href="/msme" className="flex items-center space-x-3 p-3 rounded-lg bg-violet-50 text-violet-700"><span>Overview</span></Link>
          <Link href="/msme/marketplace" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"><span>Marketplace</span></Link>
          <Link href="/msme/contracts" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"><span>My Contracts</span></Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">MSME Dashboard</h1>
            <p className="text-gray-500 text-sm italic">Procuring affordable Brown Power from secondary markets.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Procurement</p>
            <p className="text-2xl font-bold text-gray-900">{totalEnergy.toLocaleString()} MWh</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Avg. Cost Basis</p>
            <p className="text-2xl font-bold text-violet-600">₹{avgCost}/kWh</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Projected Savings</p>
            <p className="text-2xl font-bold text-emerald-600">₹{(savings/100000).toFixed(2)} Lakh</p>
          </div>
        </div>

        {/* Active Energy Contracts */}
        <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">My Energy Pacts</h2>
            <Link href="/msme/marketplace" className="text-xs font-bold text-violet-600 hover:underline">Find cheaper power →</Link>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr><th className="px-8 py-4">Supplier (Anchor)</th><th className="px-8 py-4">Volume</th><th className="px-8 py-4">Price</th><th className="px-8 py-4">Type</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contracts.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">No active energy contracts.</td></tr>
              ) : (
                contracts.map((c, i) => (
                  <tr key={i} className="hover:bg-violet-50/30 transition-colors">
                    <td className="px-8 py-6 font-semibold">{c.anchorName}</td>
                    <td className="px-8 py-6 font-mono">{c.energyMWh} MWh</td>
                    <td className="px-8 py-6 font-bold text-violet-600 font-mono">₹{c.price}/kWh</td>
                    <td className="px-8 py-6"><span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Brown Power</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}