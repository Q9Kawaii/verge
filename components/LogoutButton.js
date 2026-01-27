"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
  try {
    // 1. Firebase sign out
    await signOut(auth);

    // 2. Clear role cookie
    document.cookie = "role=; Max-Age=0; path=/";

    // 3. Force redirect to login (no history)
    router.replace("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
