"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { addDoc } from "firebase/firestore";


export default function MSMEMarketplace() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  // 🔐 Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setLoading(false);
        router.replace("/login");
        return;
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // 🔄 Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      const snapshot = await getDocs(collection(db, "excess_energy"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(data);
    };

    fetchOffers();
  }, []);

  if (loading) return <p>Loading marketplace...</p>;

  const handleBuyEnergy = async (offer) => {
  await addDoc(collection(db, "contracts"), {
    msmeEmail: auth.currentUser.email,
    anchorName: offer.anchorName,
    energyMWh: offer.energyMWh,
    price: offer.price,
    duration: offer.duration,
    createdAt: new Date(),
  });

  alert("Energy purchased successfully (simulated)");
};


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brown Energy Marketplace</h1>

        <Link
          href="/msme"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          MSME Dashboard
        </Link>
      </div>

      <p className="text-sm text-gray-600">
        All energy listed here is <strong>brown power</strong>. Environmental
        attributes (RECs) have already been claimed upstream.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-5 rounded-lg shadow space-y-3"
          >
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium">{offer.anchorName}</p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Energy</p>
                <p className="font-medium">{offer.energyMWh} MWh</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">₹{offer.price} / kWh</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contract Duration</p>
              <p className="font-medium">{offer.duration}</p>
            </div>

            <button
              onClick={() => handleBuyEnergy(offer)}
              className="w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              Buy Energy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
