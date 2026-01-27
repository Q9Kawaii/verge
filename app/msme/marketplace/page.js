"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";


export default function MSMEMarketplace() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 🔐 Basic auth guard
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

  if (loading) return <p>Loading marketplace...</p>;

  // 🟤 Mock brown energy offers
  const offers = [
    {
      id: "offer1",
      anchor: "ABC Cement Ltd",
      energyMWh: 2000,
      price: 3.1,
      duration: "6 months",
    },
    {
      id: "offer2",
      anchor: "XYZ Steel Corp",
      energyMWh: 1500,
      price: 3.3,
      duration: "3 months",
    },
  ];

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
        All energy listed here is <strong>brown power</strong>.
        Environmental attributes (RECs) have already been claimed upstream.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-5 rounded-lg shadow space-y-3"
          >
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium">{offer.anchor}</p>
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
              onClick={() => alert("Simulated purchase – no real transaction")}
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
