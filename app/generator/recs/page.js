"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function GeneratorRECPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [isIssuing, setIsIssuing] = useState(false);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [energyAmount, setEnergyAmount] = useState("");

  // 🔐 Auth guard
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

  // 🔄 Fetch RECs
  const fetchRECs = async () => {
    const snapshot = await getDocs(collection(db, "recs"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecs(data);
  };

  useEffect(() => {
    fetchRECs();
  }, []);

  // ⚡ Function to Issue New REC
  const handleIssueREC = async (e) => {
    e.preventDefault();
    if (!energyAmount || isNaN(energyAmount)) return alert("Please enter a valid MWh amount");

    setIsIssuing(true);
    try {
      await addDoc(collection(db, "recs"), {
        generator: auth.currentUser?.displayName || "Authorized Generator",
        generatorId: auth.currentUser?.uid,
        energyMWh: Number(energyAmount),
        status: "active", // Minted and ready for transfer
        issuedAt: serverTimestamp(),
        anchor: "Unassigned", // Initially unassigned
      });

      setEnergyAmount("");
      setShowForm(false);
      await fetchRECs(); // Refresh list
      alert("REC Successfully Issued to the Ledger!");
    } catch (err) {
      console.error("Error issuing REC:", err);
      alert("Failed to issue REC.");
    } finally {
      setIsIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">REC Management</h1>
          <p className="text-gray-500 text-sm font-medium">Issue and track Renewable Energy Certificates.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all"
          >
            {showForm ? "Cancel" : "+ Issue New RECs"}
          </button>
          <button 
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* NEW: Issuance Form Section */}
      {showForm && (
        <div className="bg-white p-8 rounded-[32px] border-2 border-violet-100 shadow-xl animate-in slide-in-from-top duration-300">
          <form onSubmit={handleIssueREC} className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Energy Generated (MWh)</label>
              <input 
                type="number" 
                value={energyAmount}
                onChange={(e) => setEnergyAmount(e.target.value)}
                placeholder="e.g. 450"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-600 outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isIssuing}
              className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 disabled:bg-gray-300 transition-all"
            >
              {isIssuing ? "Minting on Ledger..." : "Confirm Issuance"}
            </button>
          </form>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total RECs Minted</p>
          <p className="text-2xl font-bold text-gray-900">{recs.length} Certificates</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Market Status</p>
          <p className="text-2xl font-bold text-emerald-600">Live Ledger</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Capacity</p>
          <p className="text-2xl font-bold text-violet-600">Active</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                <th className="px-8 py-5">Certificate ID</th>
                <th className="px-8 py-5">Energy (MWh)</th>
                <th className="px-8 py-5">Assigned To</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-gray-400 italic">No RECs issued yet.</td>
                </tr>
              ) : (
                recs.map((r) => (
                  <tr key={r.id} className="hover:bg-violet-50/30 transition-colors">
                    <td className="px-8 py-6 font-mono text-xs text-violet-600 font-bold">#REC-{r.id.slice(0,6).toUpperCase()}</td>
                    <td className="px-8 py-6 text-gray-700 font-bold">{r.energyMWh} MWh</td>
                    <td className="px-8 py-6 text-gray-600 font-medium">{r.anchor || "Unassigned"}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        r.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}