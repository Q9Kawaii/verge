"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function AnchorExcessEnergyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading excess energy...</p>;

  // 🟤 Mock excess energy listings
  const listings = [
    {
      id: "ex1",
      energyMWh: 3000,
      price: 3.1,
      duration: "6 months",
      status: "Listed",
    },
    {
      id: "ex2",
      energyMWh: 1500,
      price: 3.3,
      duration: "3 months",
      status: "Listed",
    },
  ];

  return (
    <div className="space-y-6">

        <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold">Excess Energy Listings</h1>

  <Link
    href="/anchor"
    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
  >
    Anchor Buyer Dashboard
  </Link>
</div>

      <p className="text-sm text-gray-600">
        Energy listed here is <strong>brown power</strong>.  
        Renewable attributes (RECs) have already been claimed and cannot be resold.
      </p>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Your Listings</h2>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Energy (MWh)</th>
              <th>Price (₹/kWh)</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {listings.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.energyMWh}</td>
                <td>{item.price}</td>
                <td>{item.duration}</td>
                <td className="text-yellow-600 font-medium">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new listing (simulation only) */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">Add New Listing</h2>

        <p className="text-sm text-gray-500">
          This is a simulated action for the prototype.
        </p>

        <button
          onClick={() =>
            alert("Simulated listing created (Firestore coming next)")
          }
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Add Excess Energy
        </button>
      </div>
    </div>
  );
}
