"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function MSMEDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
  setLoading(false);
  router.replace("/login");
  return;
}
 else {
        setUser(u);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold">MSME Dashboard</h1>
  
    <div className="flex gap-4">  
        <Link
            href="/msme/contracts"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
            My Contracts
        </Link>


        <Link
            href="/msme/marketplace"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
            Browse Marketplace
        </Link>
    </div>
</div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Energy Consumed</p>
          <p className="text-xl font-semibold">4,200 MWh</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Avg. Energy Cost</p>
          <p className="text-xl font-semibold">₹3.2 / kWh</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Cost Savings</p>
          <p className="text-xl font-semibold">₹18.5 Lakh</p>
        </div>
      </div>

      {/* Current Energy Contracts */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Active Energy Contracts</h2>

        <p className="text-sm text-gray-500 mb-4">
          Energy supplied as brown power. Environmental benefits already claimed upstream.
        </p>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Supplier</th>
              <th>Energy</th>
              <th>Price</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Anchor Buyer A</td>
              <td>2,000 MWh</td>
              <td>₹3.1 / kWh</td>
              <td className="text-yellow-600 font-medium">Brown</td>
            </tr>

            <tr>
              <td className="py-2">Anchor Buyer B</td>
              <td>2,200 MWh</td>
              <td>₹3.3 / kWh</td>
              <td className="text-yellow-600 font-medium">Brown</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
