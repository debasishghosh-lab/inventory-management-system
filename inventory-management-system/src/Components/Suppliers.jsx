import { useState } from "react";
import {
  Users, Star, Phone, Mail, MapPin, Package,
  Search, Plus, ExternalLink, TrendingUp,
  CheckCircle, Clock, XCircle, ChevronRight,
  Building2, ArrowUpRight
} from "lucide-react";

// ── Demo data ─────────────────────────────────────────────────────────────────

const demoSuppliers = [
  {
    id: 1,
    name: "TechSupply Co.",
    contact: "Sarah Johnson",
    email: "sarah@techsupply.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    category: "Electronics",
    rating: 4.8,
    status: "Active",
    totalOrders: 142,
    totalValue: 284000,
    leadTime: "3–5 days",
    avatar: "TS",
    avatarBg: "bg-indigo-100",
    avatarText: "text-indigo-600",
  },
  {
    id: 2,
    name: "FurniturePlus",
    contact: "Mark Williams",
    email: "mark@furnitureplus.com",
    phone: "+1 (555) 234-5678",
    location: "Austin, TX",
    category: "Furniture",
    rating: 4.3,
    status: "Active",
    totalOrders: 87,
    totalValue: 196500,
    leadTime: "7–10 days",
    avatar: "FP",
    avatarBg: "bg-sky-100",
    avatarText: "text-sky-600",
  },
  {
    id: 3,
    name: "OfficeWorld",
    contact: "Lisa Chen",
    email: "lisa@officeworld.com",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    category: "Office",
    rating: 3.9,
    status: "On Hold",
    totalOrders: 54,
    totalValue: 67800,
    leadTime: "5–7 days",
    avatar: "OW",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-600",
  },
  {
    id: 4,
    name: "AccessoriesHub",
    contact: "James Patel",
    email: "james@accessorieshub.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    category: "Accessories",
    rating: 4.6,
    status: "Active",
    totalOrders: 211,
    totalValue: 128400,
    leadTime: "2–4 days",
    avatar: "AH",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-600",
  },
  {
    id: 5,
    name: "GlobalParts Ltd.",
    contact: "Emma Davis",
    email: "emma@globalparts.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    category: "Electronics",
    rating: 4.1,
    status: "Inactive",
    totalOrders: 29,
    totalValue: 43200,
    leadTime: "10–14 days",
    avatar: "GP",
    avatarBg: "bg-purple-100",
    avatarText: "text-purple-600",
  },
  {
    id: 6,
    name: "QuickShip Co.",
    contact: "Ryan Torres",
    email: "ryan@quickship.com",
    phone: "+1 (555) 678-9012",
    location: "Miami, FL",
    category: "Accessories",
    rating: 4.9,
    status: "Active",
    totalOrders: 318,
    totalValue: 521000,
    leadTime: "1–2 days",
    avatar: "QS",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-600",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusConfig = {
  "Active":   { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
  "On Hold":  { text: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  icon: Clock },
  "Inactive": { text: "text-gray-500",    bg: "bg-gray-50",    border: "border-gray-200",    icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig["Inactive"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${cfg.text} ${cfg.bg} ${cfg.border}`}
      style={{ fontFamily: "'DM Mono', monospace" }}>
      <Icon size={10} />
      {status}
    </span>
  );
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const frac = rating - full;
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= full ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
      <span className="text-xs font-bold text-gray-700 ml-1" style={{ fontFamily: "'DM Mono', monospace" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────

const Suppliers = ({ suppliers = demoSuppliers }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = suppliers.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total Suppliers", value: suppliers.length,                                          color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active",          value: suppliers.filter(s => s.status === "Active").length,       color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "On Hold",         value: suppliers.filter(s => s.status === "On Hold").length,      color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Total Spend",     value: `$${(suppliers.reduce((s,x) => s + (x.totalValue||0), 0)/1000).toFixed(0)}k`, color: "text-sky-600", bg: "bg-sky-50" },
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: "#f5f6fa", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Suppliers</h2>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
            Manage your supplier relationships
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm">
          <Plus size={14} /> Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Building2 size={16} className={color} />
            </div>
            <div>
              <div className={`text-xl font-extrabold tracking-tight ${color}`}>{value}</div>
              <div className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-5 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers, contacts, categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-gray-400"
            style={{ fontFamily: "'Syne', sans-serif" }}
          />
        </div>
        <div className="flex gap-2">
          {["All", "Active", "On Hold", "Inactive"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                ${statusFilter === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
                }`}
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-3">
            <Users size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-700">No suppliers found</p>
          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(supplier => (
            <div
              key={supplier.id}
              onClick={() => setSelected(selected?.id === supplier.id ? null : supplier)}
              className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all duration-200 group
                ${selected?.id === supplier.id
                  ? "border-indigo-300 ring-2 ring-indigo-100"
                  : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
                }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${supplier.avatarBg || "bg-gray-100"} ${supplier.avatarText || "text-gray-600"}`}>
                    {supplier.avatar || supplier.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">{supplier.name}</h3>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {supplier.category}
                    </p>
                  </div>
                </div>
                <StatusBadge status={supplier.status} />
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={supplier.rating} />
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User size={11} className="flex-shrink-0" />
                  <span>{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={11} className="flex-shrink-0" />
                  <span style={{ fontFamily: "'DM Mono', monospace" }}>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={11} className="flex-shrink-0" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={11} className="flex-shrink-0" />
                  <span>{supplier.location}</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm font-extrabold text-gray-800">{supplier.totalOrders}</div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-extrabold text-gray-800">
                    ${(supplier.totalValue / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Spend</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-extrabold text-gray-800">{supplier.leadTime}</div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Lead</div>
                </div>
              </div>

              {/* Expand CTA */}
              <div className={`mt-3 pt-3 border-t border-gray-100 flex items-center justify-between transition-opacity ${selected?.id === supplier.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                <span className="text-xs font-semibold text-indigo-500" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {selected?.id === supplier.id ? "Selected" : "View details"}
                </span>
                <ChevronRight size={13} className="text-indigo-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected detail panel */}
      {selected && (
        <div className="mt-5 bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm ring-1 ring-indigo-50">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${selected.avatarBg} ${selected.avatarText}`}>
                {selected.avatar}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">{selected.name}</h3>
                <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {selected.category} · {selected.location}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                <Mail size={12} /> Email
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">
                <Package size={12} /> New Order
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: selected.totalOrders },
              { label: "Total Spend",  value: `$${selected.totalValue.toLocaleString()}` },
              { label: "Lead Time",    value: selected.leadTime },
              { label: "Rating",       value: `${selected.rating}/5.0` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="text-lg font-extrabold text-gray-900 tracking-tight">{value}</div>
                <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Missing import fix
const User = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default Suppliers;