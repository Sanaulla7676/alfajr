import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if it's the admin email
      if (email.toLowerCase() !== "sanaullaa19@gmail.com") {
        throw new Error("Only admin can access this page.");
      }

      // Ensure the session persists locally (stay logged in)
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 font-inter">
      <Head>
        <title>Alfajr Admin Portal</title>
        <link rel="manifest" href="/manifest-admin.json" />
      </Head>
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-black tracking-tighter text-violet-600 mb-2 cursor-pointer inline-block">Alfajr Super Mart</h1>
          </Link>
          <p className="text-outline font-body-md">Admin Dashboard Portal</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="text-body-sm font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Admin Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">alternate_email</span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-surface-container-low border-none rounded-2xl px-12 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">lock_open</span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-2xl px-12 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined">login</span>
                SIGN IN AS ADMIN
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link href="/">
            <span className="text-outline hover:text-primary font-bold text-body-sm cursor-pointer transition-colors">← Back to Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
