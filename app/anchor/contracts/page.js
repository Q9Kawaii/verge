"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AnchorContracts() {
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      const snap = await getDocs(collection(db, "contracts"));
      setContracts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchContracts();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">VPPA Portfolio</h1>
          <p className="text-gray-500 text-sm font-medium">Manage long-term virtual energy procurement.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 shadow-sm transition-all"
        >
          ← Back
        </button>
      </div>

      {/* Portfolio Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contracted Capacity</p>
          <p className="text-2xl font-bold text-gray-900">
            {contracts.reduce((acc, curr) => acc + (curr.energyMWh || 0), 0).toLocaleString()} MWh
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Pacts</p>
          <p className="text-2xl font-bold text-violet-600">{contracts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Audit Status</p>
          <p className="text-2xl font-bold text-emerald-500">Verified</p>
        </div>
      </div>

      {/* Contracts Data Table */}
      <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Generator / Project</th>
              <th className="px-8 py-5">Allocated Volume</th>
              <th className="px-8 py-5">Strike Price</th>
              <th className="px-8 py-5">Duration</th>
              <th className="px-8 py-5 text-right">Agreement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contracts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center text-gray-400 italic">No active contracts found in portfolio.</td>
              </tr>
            ) : (
              contracts.map((vppa) => (
                <tr key={vppa.id} className="hover:bg-violet-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900">{vppa.anchorName || "Renewable Project"}</p>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {vppa.id.toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-gray-700">{vppa.energyMWh.toLocaleString()} MWh</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-violet-600 font-mono">₹{vppa.price}/kWh</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-semibold text-gray-500 uppercase tracking-tighter">
                    {vppa.duration || "N/A"}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-xs font-black text-violet-600 border border-violet-100 px-4 py-2 rounded-lg hover:bg-violet-600 hover:text-white transition-all">
                      View Ledger
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Helpful Tip for Anchors */}
      <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100">
        <h4 className="text-violet-900 font-bold text-sm mb-2">Portfolio Management Tip</h4>
        <p className="text-xs text-violet-700 leading-relaxed">
          Virtual Power Purchase Agreements (VPPAs) are structured as <strong>Contracts-for-Difference (CfD)</strong>. 
          While you do not receive physical electrons, the platform settles the price difference between your agreed strike price 
          and the spot market rate, providing a financial hedge for your energy portfolio.
        </p>
      </div>
    </div>
  );
}