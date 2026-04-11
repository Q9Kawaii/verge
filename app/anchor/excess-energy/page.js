"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function AnchorExcessEnergyPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [isListing, setIsListing] = useState(false);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const fetchListings = async () => {
    const q = query(collection(db, "excess_energy"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchListings(); }, []);

  const handleAddListing = async (e) => {
    e.preventDefault();
    if (!amount || !price) return alert("Fill all fields");
    setIsListing(true);
    try {
      await addDoc(collection(db, "excess_energy"), {
        anchorName: auth.currentUser?.displayName || "Anchor Corp",
        energyMWh: Number(amount),
        price: Number(price),
        duration: "6 months",
        status: "listed",
        createdAt: serverTimestamp(),
      });
      setAmount(""); setPrice("");
      await fetchListings();
      alert("Surplus brown power listed for MSMEs.");
    } finally {
      setIsListing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Secondary Energy Market</h1>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white border rounded-xl font-bold text-sm">← Back</button>
      </div>

      {/* Input Form */}
      <div className="bg-white p-8 rounded-[32px] border-2 border-violet-100 shadow-xl">
        <h2 className="text-sm font-bold text-violet-600 uppercase tracking-widest mb-6">Create New Market Listing</h2>
        <form onSubmit={handleAddListing} className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-gray-400">Surplus Energy (MWh)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 ring-violet-400" />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-gray-400">Resale Price (₹/kWh)</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 3.20" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 ring-violet-400" />
          </div>
          <button type="submit" disabled={isListing} className="px-10 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all disabled:bg-gray-300">
            {isListing ? "Processing..." : "List Power"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr><th className="px-8 py-4">Volume (MWh)</th><th className="px-8 py-4">Price (₹/kWh)</th><th className="px-8 py-4">Listed Date</th><th className="px-8 py-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {listings.map((item) => (
              <tr key={item.id} className="hover:bg-amber-50/10 transition-colors">
                <td className="px-8 py-6 font-bold text-gray-800">{item.energyMWh}</td>
                <td className="px-8 py-6 font-mono text-amber-600 font-bold">₹{item.price}</td>
                <td className="px-8 py-6 text-gray-400 text-xs font-medium">
                  {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Pending..."}
                </td>
                <td className="px-8 py-6"><span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}