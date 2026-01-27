"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function GeneratorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Basic auth check
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
      <h1 className="text-2xl font-bold">Generator Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Generation</p>
          <p className="text-xl font-semibold">12,500 MWh</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">RECs Issued</p>
          <p className="text-xl font-semibold">12,500</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Active Offers</p>
          <p className="text-xl font-semibold">3</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Projects</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Project</th>
              <th>Technology</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Solar Park A</td>
              <td>Solar</td>
              <td>50 MW</td>
              <td className="text-green-600">Active</td>
            </tr>

            <tr>
              <td className="py-2">Wind Farm B</td>
              <td>Wind</td>
              <td>30 MW</td>
              <td className="text-green-600">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
