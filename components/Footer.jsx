"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function Footer() {
  const { loggedIn, loading } = useAuth();

  return (
    <footer className="border-t border-slate-200/80 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
                <Link2 size={15} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-slate-900">TinerURL</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Shorten links, track clicks, and manage your URLs — all in one place.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Navigation
            </p>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Home</Link></li>
              {!loading && loggedIn && (
                <li><Link href="/profile" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Profile</Link></li>
              )}
              {!loading && !loggedIn && (
                <>
                  <li><Link href="/login" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Login</Link></li>
                  <li><Link href="/signup" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Features
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Instant URL shortening</li>
              <li>Click analytics</li>
              <li>Secure link management</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} TinerURL. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
