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
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      // Logged in → check if role exists in Firestore [cite: 1344]
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const role = snap.data().role;
        // Setting cookie for server-side role protection if needed [cite: 905]
        document.cookie = `role=${role}; path=/`;

        if (role === "generator") router.replace("/generator");
        else if (role === "anchor") router.replace("/anchor");
        else if (role === "msme") router.replace("/msme");
      } else {
        // No role found? Send to role selection [cite: 772, 1281]
        router.replace("/onboarding");
      }
    });

    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Success redirection is handled by the onAuthStateChanged listener above
    } catch (err) {
      alert("Google sign-in failed. Please try again.");
      console.error(err);
      setIsLoggingIn(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-violet-900 font-medium">Verifying account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6 border border-blue-50">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to VERGE</h1>
          <p className="text-gray-500">Log in to manage your clean energy marketplace</p>
        </div>

        <div className="py-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 border-2 border-violet-100 rounded-xl transition-all font-semibold
              ${isLoggingIn 
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-violet-50 hover:border-violet-200 active:scale-95'
              }`}
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            <span>{isLoggingIn ? "Signing in..." : "Continue with Google"}</span>
          </button>
        </div>

        <p className="text-xs text-gray-400">
          By continuing, you agree to VERGE&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}