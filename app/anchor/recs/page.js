"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AnchorRECs() {
  const router = useRouter();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRECs = async () => {
    const snapshot = await getDocs(collection(db, "recs"));
    setRecs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchRECs(); }, []);

  const handleRetire = async (id) => {
    if (!confirm("Retiring this REC will permanently claim its environmental attributes. Continue?")) return;
    await updateDoc(doc(db, "recs", id), { status: "retired" });
    fetchRECs();
  };

  if (loading) return <div className="p-10 text-center text-violet-600 font-bold">Synchronizing REC Ledger...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">REC Inventory & Offsets</h1>
        <button onClick={() => router.back()} className="px-6 py-2 bg-gray-100 rounded-xl font-bold text-sm">← Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ACTIVE SECTION */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span> Available for Retirement
          </h2>
          <div className="space-y-3">
            {recs.filter(r => r.status === 'active').map(r => (
              <div key={r.id} className="bg-white p-6 rounded-[24px] border border-blue-50 shadow-sm flex justify-between items-center hover:border-violet-200 transition-all">
                <div>
                  <p className="text-lg font-bold text-gray-800">{r.energyMWh} MWh</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{r.generator || "Solar Project"}</p>
                </div>
                <button onClick={() => handleRetire(r.id)} className="px-4 py-2 bg-violet-600 text-white text-[10px] font-black rounded-lg uppercase shadow-lg shadow-violet-100">Retire Now</button>
              </div>
            ))}
          </div>
        </div>

        {/* RETIRED SECTION */}
        <div className="space-y-4 opacity-70">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Retired Pool (Legally Claimed)</h2>
          <div className="space-y-3">
            {recs.filter(r => r.status === 'retired').map(r => (
              <div key={r.id} className="bg-gray-50 p-6 rounded-[24px] border border-gray-200 flex justify-between items-center grayscale">
                <div>
                  <p className="text-lg font-bold text-gray-400 line-through">{r.energyMWh} MWh</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase italic">Offset Verified</p>
                </div>
                <span className="text-emerald-600 font-black text-[10px] uppercase">Claimed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}