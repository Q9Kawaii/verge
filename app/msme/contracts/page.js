"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

export default function MSMEContractsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      const q = query(
        collection(db, "contracts"),
        where("msmeEmail", "==", u.email)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContracts(data);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading contracts...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Energy Contracts</h1>

        <Link
          href="/msme"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          MSME Dashboard
        </Link>
      </div>

      {contracts.length === 0 ? (
        <p className="text-gray-600">No contracts yet.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Anchor</th>
                <th>Energy (MWh)</th>
                <th>Price (₹/kWh)</th>
                <th>Duration</th>
              </tr>
            </thead>

            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.anchorName}</td>
                  <td>{c.energyMWh}</td>
                  <td>{c.price}</td>
                  <td>{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
