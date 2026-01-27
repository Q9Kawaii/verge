"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

export default function AnchorRECPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);

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

  // 🔄 Fetch RECs
  useEffect(() => {
    const fetchRECs = async () => {
      const snapshot = await getDocs(collection(db, "recs"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecs(data);
    };

    fetchRECs();
  }, []);

  if (loading) return <p>Loading RECs...</p>;

  const activeRECs = recs.filter((r) => r.status === "active");
  const retiredRECs = recs.filter((r) => r.status === "retired");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Renewable Energy Certificates</h1>

        <Link
          href="/anchor"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Anchor Dashboard
        </Link>
      </div>

      <p className="text-sm text-gray-600">
        RECs represent the environmental attributes of renewable electricity.
        Once retired, they cannot be transferred or resold.
      </p>

      {/* Active RECs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Active RECs</h2>

        {activeRECs.length === 0 ? (
          <p className="text-gray-500">No active RECs.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Generator</th>
                <th>Energy (MWh)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeRECs.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">{r.generator}</td>
                  <td>{r.energyMWh}</td>
                  <td className="text-green-600 font-medium">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Retired RECs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Retired RECs</h2>

        {retiredRECs.length === 0 ? (
          <p className="text-gray-500">No retired RECs.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Generator</th>
                <th>Energy (MWh)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {retiredRECs.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">{r.generator}</td>
                  <td>{r.energyMWh}</td>
                  <td className="text-gray-500 font-medium">Retired</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
