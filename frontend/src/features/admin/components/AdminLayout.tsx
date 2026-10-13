import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Package, ShoppingBag, Store, X } from "lucide-react";
import { useAuth } from "@/shared/store";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true, ready: true },
  { label: "Products", to: "/admin/products", icon: Package, end: false, ready: true },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag, end: false, ready: false },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <nav className="flex h-full flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-lg font-bold tracking-wide text-white">Shopora Admin</span>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <ul className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end, ready }) => (
          <li key={label}>
            {ready ? (
              <NavLink
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-white/15 text-white" : "hover:bg-white/10"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ) : (
              <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium opacity-50">
                <Icon size={18} />
                {label}
                <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">
                  Soon
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10"
        >
          <Store size={18} />
          View store
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 w-64">{sidebar}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={() => void logout()}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}