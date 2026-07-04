"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Link2 } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
];

function NavLink({ href, label, icon: Icon, isActive, mobile }) {
  const base =
    "flex items-center gap-3 font-medium transition-all duration-200";
  const desktop = isActive
    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent";
  const mobileActive = isActive ? "text-indigo-600" : "text-slate-500";

  if (mobile) {
    return (
      <Link href={href} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 ${mobileActive}`}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-xs">{label}</span>
        {isActive && (
          <span className="absolute top-0 h-0.5 w-12 bg-indigo-600 rounded-full" />
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} px-3 py-2.5 rounded-lg border ${desktop}`}
    >
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[var(--sidebar-width)] bg-white border-r border-slate-200/80 z-40">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-200/80">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white">
            <Link2 size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight">TinerURL</p>
            <p className="text-[11px] text-slate-500 -mt-0.5">Link management</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200/80">
          <div className="px-3 py-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <p className="text-xs font-medium text-slate-700">Pro tip</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Copy short links instantly with the clipboard icon.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-40">
        <div className="flex h-16 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              mobile
            />
          ))}
        </div>
      </nav>
    </>
  );
}
