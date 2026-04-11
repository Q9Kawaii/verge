"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setLoading(false);
        router.replace("/login");
      } else {
        setUser(u);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async () => {
    if (!role) {
      alert("Please select a role to continue");
      return;
    }

    setIsSaving(true);
    try {
      // Save specialized user profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "New Member",
        email: user.email,
        role: role,
        onboardingComplete: true,
        createdAt: serverTimestamp(),
      });

      // Update cookie for middleware/server-side protection
      document.cookie = `role=${role}; path=/; max-age=31536000`; // 1 year expiry

      // Immediate redirect to relevant dashboard
      router.push(`/${role}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save your profile. Please try again.");
      setIsSaving(false);
    }
  };

  const roles = [
    {
      id: "generator",
      title: "Green Power Generator",
      desc: "Renewable energy producer, Developer, or Discom. Manage VPPAs and REC issuance[cite: 853].",
      icon: "☀️",
    },
    {
      id: "anchor",
      title: "Anchor Buyer",
      desc: "Large Enterprise. Off-take high volumes, retire RECs, and resell excess brown power[cite: 852].",
      icon: "🏗️",
    },
    {
      id: "msme",
      title: "MSME / 3rd-Party",
      desc: "Small-scale manufacturer. Procure affordable brown energy and access green finance[cite: 851].",
      icon: "🏭",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-50 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">Define Your Role</h1>
          <p className="text-gray-500">How will you be participating in the VERGE marketplace? [cite: 849]</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((item) => (
            <button
              key={item.id}
              onClick={() => setRole(item.id)}
              className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all text-center space-y-3 
                ${role === item.id 
                  ? "bg-violet-50 border-violet-600 ring-4 ring-violet-100" 
                  : "bg-white border-gray-100 hover:border-violet-200 hover:bg-violet-50/30"
                }`}
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h3 className={`font-bold ${role === item.id ? "text-violet-900" : "text-gray-800"}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
              {role === item.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!role || isSaving}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg
            ${!role || isSaving 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-violet-600 hover:bg-violet-700 shadow-violet-200"
            }`}
        >
          {isSaving ? "Finalizing Profile..." : "Complete Setup"}
        </button>

        <p className="text-center text-xs text-gray-400">
          You can change your role later in the organization settings.
        </p>
      </div>
    </div>
  );
}