"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function MSMEContracts() {
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "contracts"), where("msmeEmail", "==", auth.currentUser.email));
        const snap = await getDocs(q);
        setContracts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  if (loading) return <div className="p-10 text-center text-violet-600 font-bold">Loading Ledger...</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Active Power Pacts</h1>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white border rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">← Back</button>
      </div>

      <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr><th className="px-8 py-5">Agreement ID</th><th className="px-8 py-5">Supplier</th><th className="px-8 py-5">Volume</th><th className="px-8 py-5">Rate</th><th className="px-8 py-5 text-right">Documents</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {contracts.map((c) => (
              <tr key={c.id} className="hover:bg-violet-50/20">
                <td className="px-8 py-6 font-mono text-xs text-gray-400">#CFD-{c.id.slice(0,6).toUpperCase()}</td>
                <td className="px-8 py-6 font-bold text-gray-800">{c.anchorName}</td>
                <td className="px-8 py-6 font-medium">{c.energyMWh} MWh</td>
                <td className="px-8 py-6 font-black text-violet-600">₹{c.price}</td>
                <td className="px-8 py-6 text-right">
                  <button className="text-violet-600 font-bold hover:underline">Download Pact</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-xs text-blue-700 leading-relaxed italic">
          <strong>MSME Notice:</strong> These contracts represent a financial claim to grid electricity at a fixed rate. 
          The price advantage exists because the environmental attributes have been decoupled and claimed by the Anchor Buyer.
        </p>
      </div>
    </div>
  );
}