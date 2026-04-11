"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function MSMEMarketplace() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [isBuying, setIsBuying] = useState(null); // Track which item is being bought

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const fetchOffers = async () => {
      const snapshot = await getDocs(collection(db, "excess_energy"));
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOffers();
  }, []);

  const handleBuyEnergy = async (offer) => {
    setIsBuying(offer.id);
    try {
      await addDoc(collection(db, "contracts"), {
        msmeEmail: auth.currentUser.email,
        anchorName: offer.anchorName,
        energyMWh: offer.energyMWh,
        price: offer.price,
        duration: offer.duration,
        createdAt: serverTimestamp(),
      });
      alert(`Success! Purchased ${offer.energyMWh} MWh from ${offer.anchorName}`);
      router.push("/msme/contracts");
    } catch (e) {
      alert("Error processing purchase.");
    } finally {
      setIsBuying(null);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-violet-600">Accessing Market...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Brown Power Marketplace</h1>
          <p className="text-gray-500 text-sm">Secondary listings of energy without environmental credits.</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white border rounded-xl font-bold text-sm">← Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm hover:border-violet-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Available</span>
                <p className="text-2xl font-black text-violet-600">₹{offer.price}<span className="text-xs font-normal text-gray-400">/kWh</span></p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Supplier</p>
                <p className="font-bold text-gray-800">{offer.anchorName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Volume</p>
                  <p className="font-bold">{offer.energyMWh} MWh</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Term</p>
                  <p className="font-bold">{offer.duration}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBuyEnergy(offer)}
              disabled={isBuying === offer.id}
              className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-violet-700 transition-all active:scale-95 disabled:bg-gray-300"
            >
              {isBuying === offer.id ? "Processing..." : "Sign Energy Pact"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}