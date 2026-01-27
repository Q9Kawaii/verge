"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async () => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role,
        createdAt: new Date(),
      });

      // Redirect based on role
      if (role === "generator") router.push("/generator");
      if (role === "anchor") router.push("/anchor");
      if (role === "msme") router.push("/msme");
    } catch (err) {
      console.error(err);
      alert("Failed to save role");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Select your role
      </h1>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="role"
            value="generator"
            onChange={(e) => setRole(e.target.value)}
          />
          <span>
            <strong>Green Power Generator</strong>
            <br />
            <span className="text-sm text-gray-500">
              Renewable energy producer / Discom
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="role"
            value="anchor"
            onChange={(e) => setRole(e.target.value)}
          />
          <span>
            <strong>Anchor Buyer</strong>
            <br />
            <span className="text-sm text-gray-500">
              First-hand buyer (receives energy + REC)
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="role"
            value="msme"
            onChange={(e) => setRole(e.target.value)}
          />
          <span>
            <strong>MSME / 3rd-Party Buyer</strong>
            <br />
            <span className="text-sm text-gray-500">
              Buys brown energy only
            </span>
          </span>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
      >
        Continue
      </button>
    </div>
  );
}
