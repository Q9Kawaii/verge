"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // After login → onboarding (role selection later)
      router.push("/onboarding");
    } catch (error) {
      console.error("Login error:", error);
      alert("Google sign-in failed");
    }
  };

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

        <p className="text-sm text-gray-500">
          No passwords. Secure Google authentication.
        </p>
      </div>
    </div>
  );
}
