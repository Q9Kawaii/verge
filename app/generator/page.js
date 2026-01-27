"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function GeneratorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);

  // 🔐 Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // 📡 Fetch grid intelligence snapshot
  useEffect(() => {
    const fetchForecast = async () => {
      const snap = await getDoc(doc(db, "forecast_results", "latest"));
      if (snap.exists()) {
        setForecast(snap.data());
      }
    };
    fetchForecast();
  }, []);

  if (loading) return <p>Loading generator dashboard...</p>;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Generator Dashboard</h1>

        <Link
          href="/intelligence"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          View Grid Intelligence
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Green Generation</p>
          <p className="text-xl font-semibold">12,500 MWh</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Sold to Anchors</p>
          <p className="text-xl font-semibold">9,000 MWh</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Available RECs</p>
          <p className="text-xl font-semibold">3,500</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Plant Status</p>
          <p className="text-xl font-semibold text-green-600">Operational</p>
        </div>
      </div>

      {/* Anchor Contracts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Active Anchor Contracts</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Anchor Buyer</th>
              <th>Energy (MWh)</th>
              <th>Duration</th>
              <th>REC Issued</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">ABC Cement Ltd</td>
              <td>3,000</td>
              <td>10 Years</td>
              <td className="text-green-600 font-medium">Yes</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">XYZ Steel Corp</td>
              <td>6,000</td>
              <td>15 Years</td>
              <td className="text-green-600 font-medium">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grid Intelligence Snapshot */}
      <div className="bg-white p-6 rounded-lg shadow space-y-3">
        <h2 className="text-lg font-semibold">
          Grid Intelligence Snapshot
        </h2>

        {forecast ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="font-medium">{forecast.region}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Risk Level</p>
              <p className="font-medium">{forecast.riskLevel}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Congestion Alert</p>
              <p className="font-medium">
                {forecast.congestionAlert ? "⚠️ Possible" : "No"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Forecast data unavailable
          </p>
        )}
      </div>

      {/* Footer Nav */}
      <div className="flex gap-3">
        <Link
          href="/anchor"
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Anchor View
        </Link>

        <Link
          href="/msme"
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          MSME View
        </Link>
      </div>
    </div>
  );
}
