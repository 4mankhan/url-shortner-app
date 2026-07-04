"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { DotsLoader } from "@/components/loading";
import { fetchWithAuth } from "@/backend/lib/refereshToken";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import {
  Copy,
  Link2,
  MousePointerClick,
  Trash2,
  ExternalLink,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant shortening",
    desc: "Paste any long URL and get a clean short link in seconds.",
  },
  {
    icon: BarChart3,
    title: "Click analytics",
    desc: "Track how many times each link has been visited.",
  },
  {
    icon: Shield,
    title: "Secure & private",
    desc: "Your links are tied to your account and fully manageable.",
  },
];

export default function HomePage() {
  const { loggedIn, loading: authLoading, checkAuth } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [urls, setUrls] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      fetchUrls();
    } else {
      setUrls([]);
    }
  }, [loggedIn]);

  async function fetchUrls() {
    setFetching(true);
    try {
      const res = await fetchWithAuth("/api/url/allurls", {}, { redirectOnFail: false });
      if (res.status === 401) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch URLs");
      setUrls(data.urls || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFetching(false);
    }
  }

  async function deleteUrl(shortId) {
    if (!loggedIn) {
      toast.error("Login required to manage links");
      return;
    }
    try {
      const res = await fetchWithAuth(`/api/url/allurls?shortId=${shortId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete URL");
      setUrls((prev) => prev.filter((u) => u.shortId !== shortId));
      toast.success("Link deleted");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleShorten(e) {
    e?.preventDefault();

    if (!urlInput.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!loggedIn) {
      toast.error("Login required to shorten URLs", {
        duration: 4000,
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchWithAuth("/api/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to shorten URL");

      setUrls((prev) => [
        ...prev,
        { shortId: data.shortId, redirectURL: urlInput, visitHistory: [] },
      ]);
      setUrlInput("");
      toast.success("Link created successfully");
      checkAuth();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const handleCopy = async (id) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${id}`);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const totalClicks = urls.reduce(
    (sum, u) => sum + (u.visitHistory?.length || 0),
    0
  );

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="hero-gradient border-b border-indigo-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
              <Zap size={12} />
              Free URL shortener
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Shorten your links.
              <span className="text-indigo-600"> Track every click.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Transform long URLs into shareable short links. Sign in to create,
              manage, and analyze your links.
            </p>
          </div>

          {/* Shorten form */}
          <div className="max-w-2xl mx-auto">
            <div className="saas-card hero-glow p-2 sm:p-3">
              <form
                onSubmit={handleShorten}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="url"
                  placeholder="Paste your long URL here..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="saas-input flex-1 border-0 focus:ring-0 bg-transparent"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="saas-btn-primary shrink-0 px-6"
                >
                  {submitting ? "Creating..." : "Shorten URL"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {!authLoading && !loggedIn && (
              <p className="mt-3 text-center text-sm text-slate-500 flex items-center justify-center gap-1.5">
                <Lock size={14} className="text-slate-400" />
                <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                  Login
                </Link>
                {" or "}
                <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
                  Sign up
                </Link>
                {" "}to shorten URLs
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Logged-in: stats + links */}
        {loggedIn && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="saas-card p-5 flex items-center gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600">
                  <Link2 size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Your Links</p>
                  <p className="text-2xl font-bold text-slate-900">{urls.length}</p>
                </div>
              </div>
              <div className="saas-card p-5 flex items-center gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">
                  <MousePointerClick size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Clicks</p>
                  <p className="text-2xl font-bold text-slate-900">{totalClicks}</p>
                </div>
              </div>
            </div>

            <div className="saas-card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Your links</h2>
                {!fetching && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {urls.length} {urls.length === 1 ? "link" : "links"}
                  </span>
                )}
              </div>

              {fetching ? (
                <div className="flex justify-center py-16">
                  <DotsLoader />
                </div>
              ) : urls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Link2 size={24} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No links yet</p>
                  <p className="text-xs text-slate-500 mt-1">Shorten your first URL above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Short Link
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Clicks
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {urls.map((u) => (
                        <tr key={u.shortId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <a
                                href={`/${u.shortId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setTimeout(fetchUrls, 500)}
                                className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-700"
                              >
                                /{u.shortId}
                                <ExternalLink size={13} className="opacity-60" />
                              </a>
                              <button
                                onClick={() => handleCopy(u.shortId)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Copy link"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <p className="md:hidden mt-1 text-xs text-slate-500 truncate max-w-[200px]">
                              {u.redirectURL}
                            </p>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className="text-slate-600 truncate max-w-xs" title={u.redirectURL}>
                              {u.redirectURL}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full">
                              {u.visitHistory?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteUrl(u.shortId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Guest: features + CTA */}
        {!authLoading && !loggedIn && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="saas-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="saas-card p-8 sm:p-10 text-center bg-gradient-to-br from-indigo-600 to-indigo-700 border-0 text-white">
              <h2 className="text-2xl font-bold">Ready to get started?</h2>
              <p className="mt-2 text-indigo-100 text-sm max-w-md mx-auto">
                Create a free account to shorten URLs, track clicks, and manage all your links.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Create free account
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white border border-indigo-400 rounded-lg hover:bg-indigo-500/50 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
