"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AnchorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ energy: 0, recs: 0, excess: 0 });
  const [activeContracts, setActiveContracts] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        await fetchData();
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const fetchData = async () => {
    // 1. Fetch Contracts
    const contractSnap = await getDocs(collection(db, "contracts"));
    const contractList = contractSnap.docs.map(d => d.data());
    setActiveContracts(contractList);

    // 2. Fetch Excess Energy
    const excessSnap = await getDocs(collection(db, "excess_energy"));
    const totalExcess = excessSnap.docs.reduce((acc, doc) => acc + (doc.data().energyMWh || 0), 0);

    // 3. Fetch RECs
    const recSnap = await getDocs(collection(db, "recs"));
    const retiredCount = recSnap.docs.filter(d => d.data().status === "retired").length;

    setStats({
      energy: contractList.reduce((acc, curr) => acc + (curr.energyMWh || 0), 0),
      recs: retiredCount,
      excess: totalExcess
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex w-full min-h-[calc(100vh-73px)] bg-[#F0F7FF]">
      <aside className="w-64 bg-white border-r border-blue-100 flex flex-col sticky top-[73px] h-[calc(100vh-73px)] shrink-0">
        <div className="p-6 border-b border-gray-50"><span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">VERGE</span></div>
        <nav className="flex-1 p-4 space-y-2 font-medium">
          <Link href="/anchor" className="flex items-center space-x-3 p-3 rounded-lg bg-violet-50 text-violet-700"><span>Overview</span></Link>
          <Link href="/anchor/contracts" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"><span>VPPA Contracts</span></Link>
          <Link href="/anchor/recs" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"><span>RECs & Offsets</span></Link>
          <Link href="/anchor/excess-energy" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"><span>Secondary Market</span></Link>
          <Link href="/anchor/esg" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"><span>ESG Reporting</span></Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#1E293B]">Anchor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Energy Purchased" val={`${stats.energy} MWh`} color="text-gray-900" />
          <StatCard label="RECs Retired" val={stats.recs} color="text-violet-600" />
          <StatCard label="CO₂ Offset" val={`${(stats.energy * 0.8).toFixed(0)} t`} color="text-emerald-600" />
          <StatCard label="Excess for Resale" val={`${stats.excess} MWh`} color="text-amber-600" />
        </div>

        <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50"><h2 className="text-lg font-bold text-gray-800">Live VPPA Contracts</h2></div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr><th className="px-8 py-4">Generator</th><th className="px-8 py-4">Volume</th><th className="px-8 py-4">Price</th><th className="px-8 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeContracts.map((c, i) => (
                <tr key={i} className="hover:bg-violet-50/30 transition-colors">
                  <td className="px-8 py-6 font-semibold text-gray-700">{c.anchorName || "Active Project"}</td>
                  <td className="px-8 py-6">{c.energyMWh} MWh</td>
                  <td className="px-8 py-6 font-mono">₹{c.price}/kWh</td>
                  <td className="px-8 py-6"><span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase">Contracted</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, val, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{val}</p>
    </div>
  );
}