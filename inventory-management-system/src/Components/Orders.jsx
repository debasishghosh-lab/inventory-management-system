import { useState } from "react";
import {
  FileText, CheckCircle, Truck, Clock,
  Package, ArrowUpRight, ArrowDownRight,
  Search, Filter, Download, ChevronUp, ChevronDown, ChevronsUpDown,
  AlertCircle
} from "lucide-react";

// ── Demo data ────────────────────────────────────────────────────────────────

const demoOrders = [
  { id: 1, orderNumber: "PO-2024-001", supplier: "TechSupply Co.", items: 12, total: 4820.00, status: "Delivered", date: "Feb 18, 2025" },
  { id: 2, orderNumber: "PO-2024-002", supplier: "FurniturePlus", items: 4, total: 9240.50, status: "In Transit", date: "Feb 19, 2025" },
  { id: 3, orderNumber: "PO-2024-003", supplier: "OfficeWorld", items: 7, total: 1340.00, status: "Processing", date: "Feb 20, 2025" },
  { id: 4, orderNumber: "PO-2024-004", supplier: "TechSupply Co.", items: 2, total: 599.99, status: "Delivered", date: "Feb 15, 2025" },
  { id: 5, orderNumber: "PO-2024-005", supplier: "AccessoriesHub", items: 9, total: 2780.00, status: "In Transit", date: "Feb 21, 2025" },
  { id: 6, orderNumber: "PO-2024-006", supplier: "FurniturePlus", items: 1, total: 349.00, status: "Processing", date: "Feb 21, 2025" },
  { id: 7, orderNumber: "PO-2024-007", supplier: "OfficeWorld", items: 15, total: 6120.75, status: "Delivered", date: "Feb 10, 2025" },
];

// ── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  "Delivered":  { icon: CheckCircle, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  "In Transit": { icon: Truck,        text: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-200" },
  "Processing": { icon: Clock,        text: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { icon: AlertCircle, text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border font-mono ${cfg.text} ${cfg.bg} ${cfg.border}`}>
      <Icon size={11} />
      {status}
    </span>
  );
};

// ── Sort icon ────────────────────────────────────────────────────────────────

const SortIcon = ({ col, sortCol, sortDir }) => {
  if (sortCol !== col) return <ChevronsUpDown size={12} className="text-gray-300" />;
  return sortDir === "asc"
    ? <ChevronUp size={12} className="text-indigo-500" />
    : <ChevronDown size={12} className="text-indigo-500" />;
};

// ── Main ─────────────────────────────────────────────────────────────────────

const Orders = ({ orders = demoOrders }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = [...orders]
    .filter(o => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.supplier.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const totalValue = filtered.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total Orders",  value: orders.length,                                         icon: FileText,    color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-100" },
    { label: "Delivered",     value: orders.filter(o => o.status === "Delivered").length,   icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "In Transit",    value: orders.filter(o => o.status === "In Transit").length,  icon: Truck,       color: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-100" },
    { label: "Processing",    value: orders.filter(o => o.status === "Processing").length,  icon: Clock,       color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-100" },
  ];

  const cols = [
    { key: "orderNumber", label: "Order #" },
    { key: "supplier",    label: "Supplier" },
    { key: "items",       label: "Items" },
    { key: "total",       label: "Total" },
    { key: "date",        label: "Date" },
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: "#f5f6fa", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Purchase Orders</h2>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
            Track and manage all supplier orders
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-all shadow-sm">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3 flex-wrap shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders or suppliers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-gray-400"
            style={{ fontFamily: "'Syne', sans-serif" }}
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Delivered", "In Transit", "Processing"].map(s => (
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

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {cols.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-500 transition-colors"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      <SortIcon col={key} sortCol={sortCol} sortDir={sortDir} />
                    </div>
                  </th>
                ))}
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                        <Package size={22} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-700">No orders found</p>
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-50 hover:bg-indigo-50/30 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-5 py-4">
                    <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700 font-semibold">{order.supplier}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {order.items} items
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-gray-900" style={{ fontFamily: "'DM Mono', monospace" }}>
                      ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{order.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
            Showing {filtered.length} of {orders.length} orders
          </span>
          <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: "'DM Mono', monospace" }}>
            Total: ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Orders;