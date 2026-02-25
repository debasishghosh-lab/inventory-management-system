import { useState } from "react";
import {
  FileText, CheckCircle, Truck, Clock,
  Package, Search, Download,
  ChevronUp, ChevronDown, ChevronsUpDown,
  AlertCircle
} from "lucide-react";

/* ───────── Demo Data ───────── */

const demoOrders = [
  { id: 1, orderNumber: "PO-2024-001", supplier: "TechSupply Co.", items: 12, total: 4820.00, status: "Delivered", date: "Feb 18, 2025" },
  { id: 2, orderNumber: "PO-2024-002", supplier: "FurniturePlus", items: 4, total: 9240.50, status: "In Transit", date: "Feb 19, 2025" },
];

/* ───────── Status Badge ───────── */

const statusConfig = {
  Delivered:  { icon: CheckCircle, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  "In Transit": { icon: Truck, text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  Processing: { icon: Clock, text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || {
    icon: AlertCircle,
    text: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  };

  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border font-mono ${cfg.text} ${cfg.bg} ${cfg.border}`}>
      <Icon size={11} />
      {status}
    </span>
  );
};

/* ───────── Sort Icon ───────── */

const SortIcon = ({ col, sortCol, sortDir }) => {
  if (sortCol !== col) return <ChevronsUpDown size={12} className="text-gray-300" />;
  return sortDir === "asc"
    ? <ChevronUp size={12} className="text-indigo-500" />
    : <ChevronDown size={12} className="text-indigo-500" />;
};

/* ───────── Main ───────── */

const Orders = ({ orders = demoOrders }) => {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filtered = [...orders]
    .filter(o => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.supplier.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" || o.status === statusFilter;
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
    { label: "Total Orders", value: orders.length, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Delivered", value: orders.filter(o => o.status==="Delivered").length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Transit", value: orders.filter(o => o.status==="In Transit").length, icon: Truck, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Processing", value: orders.filter(o => o.status==="Processing").length, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const cols = [
    { key: "orderNumber", label: "Order #" },
    { key: "supplier", label: "Supplier" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total" },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">

      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Purchase Orders
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-mono">
            Track and manage all supplier orders
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition shadow-sm">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="text-2xl font-extrabold">{value}</div>
              <div className="text-xs text-gray-500 font-mono">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border rounded-2xl px-5 py-4 mb-5 flex items-center gap-3 flex-wrap shadow-sm">

        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders or suppliers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-400 focus:bg-white transition"
          />
        </div>

        {["All","Delivered","In Transit","Processing"].map(s => (
          <button
            key={s}
            onClick={()=>setStatusFilter(s)}
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

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {cols.map(({key,label})=>(
                  <th
                    key={key}
                    onClick={()=>handleSort(key)}
                    className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-400 cursor-pointer font-mono hover:text-indigo-500"
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      <SortIcon col={key} sortCol={sortCol} sortDir={sortDir}/>
                    </div>
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-mono">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length===0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Package size={28} className="mx-auto text-gray-400 mb-3"/>
                    <p className="font-semibold text-gray-700">No orders found</p>
                    <p className="text-xs text-gray-400 font-mono">Try adjusting your search or filter</p>
                  </td>
                </tr>
              ) : filtered.map(order=>(
                <tr key={order.id} className="border-b last:border-none hover:bg-indigo-50/30">
                  <td className="px-5 py-4 font-bold">{order.orderNumber}</td>
                  <td className="px-5 py-4 font-semibold">{order.supplier}</td>
                  <td className="px-5 py-4 font-mono text-gray-500">{order.items} items</td>
                  <td className="px-5 py-4 font-mono font-bold">
                    ${order.total.toLocaleString(undefined,{minimumFractionDigits:2})}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{order.date}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-gray-50 flex justify-between text-xs font-mono text-gray-500">
          <span>Showing {filtered.length} of {orders.length} orders</span>
          <span className="font-semibold text-gray-600">
            Total: ${totalValue.toLocaleString(undefined,{minimumFractionDigits:2})}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Orders;