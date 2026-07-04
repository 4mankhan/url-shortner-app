"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";

export default function Header() {
  const { user, loggedIn, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const t = toast.loading("Logging out...");
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    await checkAuth();
    toast.success("Logged out", { id: t });
    router.push("/");
    setMobileOpen(false);
  }

  const navLink =
    "text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors">
              <Link2 size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              TinerURL
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={navLink}>
              Home
            </Link>

            {!loading && loggedIn ? (
              <>
                <Link href="/profile" className={`${navLink} flex items-center gap-1.5`}>
                  <User size={16} />
                  Profile
                </Link>
                <span className="text-xs text-slate-400 hidden lg:inline">
                  {user?.name}
                </span>
                <button onClick={handleLogout} className="saas-btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className={navLink}>
                  Login
                </Link>
                <Link href="/signup" className="saas-btn-primary">
                  Sign Up
                </Link>
              </>
            ) : null}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-3 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            {!loading && loggedIn ? (
              <>
                <Link href="/profile" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
