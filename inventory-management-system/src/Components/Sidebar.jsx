import { useState } from "react";
import {
  Package, Home, Box, ShoppingCart,
  Truck, BarChart3, Settings, AlertTriangle,
  ChevronRight, User, LogOut
} from "lucide-react";

/* ───────── Nav Config ───────── */

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/inventory", label: "Inventory", icon: Box },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/suppliers", label: "Suppliers", icon: Truck },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

/* ───────── Main Sidebar ───────── */

const Sidebar = ({
  currentPath = "/",
  lowStockItems = 4,
  navigate,
  user = { name: "Alex Morgan", role: "Admin" },
}) => {

  const [hoveredPath, setHoveredPath] = useState(null);

  const handleNav = (e, path) => {
    if (navigate) {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <aside className="w-64 flex flex-col h-screen sticky top-0 border-r border-gray-100 bg-white">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
            <Package size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
              InventOpredict
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              v2.4.1
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2 font-mono">
          Menu
        </p>

        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = currentPath === path;
          const isHovered = hoveredPath === path;

          return (
            <a
              key={path}
              href={`#${path}`}
              onClick={(e) => handleNav(e, path)}
              onMouseEnter={() => setHoveredPath(path)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-150 relative
                ${isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/40 rounded-r-full" />
              )}

              <Icon
                size={17}
                className={`shrink-0 transition-transform duration-150 ${
                  isHovered && !isActive ? "scale-110" : ""
                }`}
              />

              <span className="flex-1">{label}</span>

              {isActive && (
                <ChevronRight size={14} className="opacity-60" />
              )}
            </a>
          );
        })}
      </nav>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <div className="px-3 pb-3">
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={15} className="text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-orange-700">
                Low Stock Alert
              </p>
              <p className="text-xs text-orange-500 font-mono">
                {lowStockItems} item{lowStockItems !== 1 ? "s" : ""} need restocking
              </p>
            </div>
            <span className="text-xl font-extrabold text-orange-600 tracking-tight">
              {lowStockItems}
            </span>
          </div>
        </div>
      )}

      {/* User Footer */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <User size={15} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate font-mono">
              {user.role}
            </p>
          </div>
          <LogOut
            size={14}
            className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0"
          />
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
