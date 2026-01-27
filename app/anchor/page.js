"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AnchorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Anchor Buyer Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Energy Purchased</p>
          <p className="text-xl font-semibold">20,000 MWh</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">RECs Retired</p>
          <p className="text-xl font-semibold">20,000</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">CO₂ Offset</p>
          <p className="text-xl font-semibold">18,000 t</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Excess Energy</p>
          <p className="text-xl font-semibold">6,000 MWh</p>
        </div>
      </div>

      {/* Active Contracts */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Active Green Energy Contracts</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Generator</th>
              <th>Energy</th>
              <th>Price</th>
              <th>REC Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Solar Park A</td>
              <td>10,000 MWh</td>
              <td>₹4.2 / kWh</td>
              <td className="text-green-600 font-medium">Retired</td>
            </tr>

            <tr>
              <td className="py-2">Wind Farm B</td>
              <td>10,000 MWh</td>
              <td>₹3.9 / kWh</td>
              <td className="text-green-600 font-medium">Retired</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Excess Energy (Brown) */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          Excess Energy (Brown Power)
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Environmental attributes already claimed. Energy resold as brown power.
        </p>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Available</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">6,000 MWh</td>
              <td>₹3.1 / kWh</td>
              <td className="text-yellow-600 font-medium">Listed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
