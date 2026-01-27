"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      // Logged in → check if role exists
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const role = snap.data().role;
        document.cookie = `role=${role}; path=/`;

        if (role === "generator") router.replace("/generator");
        if (role === "anchor") router.replace("/anchor");
        if (role === "msme") router.replace("/msme");
      } else {
        router.replace("/onboarding");
      }
    });

    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // redirect handled by onAuthStateChanged
    } catch (err) {
      alert("Google sign-in failed");
      console.error(err);
    }
  };

  if (checking) return <p>Checking account...</p>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Login to VERGE</h1>

        <button
          onClick={handleGoogleLogin}
          className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
