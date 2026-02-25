import { useState } from "react";
import {
  Users, Star, Phone, Mail, MapPin, Package,
  Search, Plus, CheckCircle, Clock, XCircle,
  ChevronRight, Building2
} from "lucide-react";

/* ───────── Demo Data ───────── */

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
];

/* ───────── Status Badge ───────── */

const statusConfig = {
  Active:   { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
  "On Hold":{ text: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  icon: Clock },
  Inactive: { text: "text-gray-500",    bg: "bg-gray-50",    border: "border-gray-200",    icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Inactive;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border font-mono ${cfg.text} ${cfg.bg} ${cfg.border}`}>
      <Icon size={10} />
      {status}
    </span>
  );
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= full ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
      <span className="text-xs font-bold text-gray-700 ml-1 font-mono">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

/* ───────── Main ───────── */

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
    { label: "Total Suppliers", value: suppliers.length, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active", value: suppliers.filter(s => s.status==="Active").length, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">

      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Suppliers</h2>
          <p className="text-sm text-gray-500 mt-1 font-mono">
            Manage your supplier relationships
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
          <Plus size={14} /> Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
              <Building2 size={16} className={color} />
            </div>
            <div>
              <div className={`text-xl font-extrabold ${color}`}>{value}</div>
              <div className="text-xs text-gray-400 font-mono">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-5 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-400 focus:bg-white transition"
          />
        </div>

        {["All","Active","On Hold","Inactive"].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border font-mono transition
              ${statusFilter===s
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(supplier => (
          <div
            key={supplier.id}
            onClick={() => setSelected(selected?.id===supplier.id?null:supplier)}
            className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition
              ${selected?.id===supplier.id
                ? "border-indigo-300 ring-2 ring-indigo-100"
                : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
              }`}
          >
            <div className="flex justify-between mb-4">
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${supplier.avatarBg} ${supplier.avatarText}`}>
                  {supplier.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">{supplier.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{supplier.category}</p>
                </div>
              </div>
              <StatusBadge status={supplier.status}/>
            </div>

            <StarRating rating={supplier.rating}/>

            <div className="mt-4 grid grid-cols-3 text-center border-t pt-3">
              <div>
                <div className="font-extrabold">{supplier.totalOrders}</div>
                <div className="text-xs text-gray-400 font-mono">Orders</div>
              </div>
              <div>
                <div className="font-extrabold">${(supplier.totalValue/1000).toFixed(0)}k</div>
                <div className="text-xs text-gray-400 font-mono">Spend</div>
              </div>
              <div>
                <div className="font-extrabold">{supplier.leadTime}</div>
                <div className="text-xs text-gray-400 font-mono">Lead</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Suppliers;