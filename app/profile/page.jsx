"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchWithAuth } from "@/backend/lib/refereshToken";
import { ProfileLoader } from "@/components/loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Shield,
  User,
  Mail,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  async function fetchDetails() {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/profile", { 
        method: "GET"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      setUser({ name: data.user.name, email: data.user.email });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  async function changePassword(e) {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setChanging(true);
    const loadingToast = toast.loading("Updating password...");

    try {
      const res = await fetchWithAuth("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      toast.success("Password updated successfully", { id: loadingToast });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: loadingToast });
    } finally {
      setChanging(false);
    }
  }

  const router = useRouter();

  async function handleLogout() {
    const loadingToast = toast.loading("Logging out...");
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/");
    toast.success("Logged out", { id: loadingToast });
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account settings and security preferences.
        </p>
      </div>

      {loading ? (
        <div className="saas-card">
          <ProfileLoader />
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {/* Profile card */}
          <div className="saas-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xl font-bold shadow-md shadow-indigo-200">
                {getInitials(user.name)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="saas-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Account Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  <User size={12} />
                  Full Name
                </label>
                <div className="saas-input bg-slate-50 cursor-default">{user.name}</div>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  <Mail size={12} />
                  Email Address
                </label>
                <div className="saas-input bg-slate-50 cursor-default">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="saas-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Security</h2>
            </div>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600">
                  <Lock size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Change Password</p>
                  <p className="text-xs text-slate-500">Update your account password</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <form
                    onSubmit={changePassword}
                    className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100"
                  >
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        className="saas-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        className="saas-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter new password"
                        className="saas-input"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={changing}
                      className="saas-btn-primary w-full sm:w-auto"
                    >
                      {changing ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Danger zone */}
          <div className="saas-card overflow-hidden border-red-200/60">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2">
              <LogOut size={18} className="text-red-500" />
              <h2 className="text-base font-semibold text-slate-900">Session</h2>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Sign out</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  End your current session on this device.
                </p>
              </div>
              <button onClick={handleLogout} className="saas-btn-danger shrink-0">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
