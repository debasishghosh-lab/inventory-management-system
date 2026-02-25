import { useState, useEffect, useRef } from "react";
import {
  Package,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

/* ───────── Demo Data ───────── */

const demoItems = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", quantity: 34, price: 129.99, status: "In Stock" },
  { id: 2, name: "Ergonomic Chair", sku: "EC-042", quantity: 5, price: 349.00, status: "Low Stock" },
  { id: 3, name: "USB-C Hub", sku: "UC-019", quantity: 0, price: 49.99, status: "Out of Stock" },
  { id: 4, name: "Standing Desk", sku: "SD-088", quantity: 12, price: 599.00, status: "In Stock" },
  { id: 5, name: "Mechanical Keyboard", sku: "MK-033", quantity: 3, price: 179.99, status: "Low Stock" },
];

const demoOrders = [
  { id: "ORD-1042", item: "Wireless Headphones", total: 259.98, date: "Today", status: "Delivered" },
  { id: "ORD-1041", item: "Ergonomic Chair", total: 349.00, date: "Today", status: "Pending" },
  { id: "ORD-1040", item: "USB-C Hub", total: 199.96, date: "Yesterday", status: "Delivered" },
];

const trendData = [
  { day: "Mon", value: 4200 },
  { day: "Tue", value: 6800 },
  { day: "Wed", value: 5100 },
  { day: "Thu", value: 7400 },
  { day: "Fri", value: 6200 },
  { day: "Sat", value: 8900 },
  { day: "Sun", value: 7100 },
];

const stockData = [
  { name: "Electronics", inStock: 37, lowStock: 3 },
  { name: "Furniture", inStock: 12, lowStock: 5 },
  { name: "Accessories", inStock: 24, lowStock: 2 },
];

/* ───────── Animated Number ───────── */

const AnimatedNumber = ({ value, prefix = "", duration = 1000 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(value * eased));

      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString()}</span>;
};

/* ───────── Status Badge ───────── */

const StatusBadge = ({ status }) => {
  const styles = {
    "In Stock": "bg-green-50 text-green-600",
    "Low Stock": "bg-orange-50 text-orange-600",
    "Out of Stock": "bg-red-50 text-red-600",
    "Delivered": "bg-green-50 text-green-600",
    "Pending": "bg-cyan-50 text-cyan-600",
    "Cancelled": "bg-red-50 text-red-600",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold font-mono ${styles[status] || "bg-gray-50 text-gray-600"}`}>
      {status}
    </span>
  );
};

/* ───────── Custom Tooltip ───────── */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-xs font-mono">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>${p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ───────── Dashboard ───────── */

const Dashboard = ({
  items = demoItems,
  orders = demoOrders,
  totalItems,
  totalValue,
  lowStockItems,
}) => {

  const computedTotalItems = totalItems ?? items.length;
  const computedTotalValue = totalValue ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  const computedLowStock = lowStockItems ?? items.filter(i => i.quantity <= 5).length;
  const outOfStock = items.filter(i => i.quantity === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold">Dashboard</h2>
          <p className="text-gray-500 text-sm font-mono mt-1">
            Welcome back! Here's your inventory overview.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-mono text-gray-500 shadow-sm">
          <Clock size={14} />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Package, label: "Total Items", value: computedTotalItems, color: "bg-cyan-600" },
          { icon: DollarSign, label: "Total Value", value: Math.round(computedTotalValue), prefix: "$", color: "bg-indigo-600" },
          { icon: AlertTriangle, label: "Low Stock", value: computedLowStock, color: "bg-orange-600" },
          { icon: XCircle, label: "Out of Stock", value: outOfStock, color: "bg-red-600" },
        ].map(({ icon: Icon, label, value, prefix = "", color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4" style={{ background: color }}>
              <Icon size={18} />
            </div>
            <p className="text-xs text-gray-500 font-mono">{label}</p>
            <h3 className="text-3xl font-extrabold mt-1">
              <AnimatedNumber value={value} prefix={prefix} />
            </h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f122" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Stock by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inStock" fill="#059669" />
              <Bar dataKey="lowStock" fill="#ea580c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Inventory</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 font-mono border-b">
              <tr>
                <th className="text-left py-2">Item</th>
                <th className="text-left py-2">Qty</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Recent Orders</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 font-mono border-b">
              <tr>
                <th className="text-left py-2">Order</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3">
                    <p className="font-semibold">{order.item}</p>
                    <p className="text-xs text-gray-500 font-mono">{order.id} · {order.date}</p>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;