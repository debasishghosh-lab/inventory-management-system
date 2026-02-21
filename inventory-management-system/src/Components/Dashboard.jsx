import { useState, useEffect, useRef } from "react";
import {
  Package,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
  ShoppingCart,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

// ── Demo data (used when no props are passed) ────────────────────────────────

const demoItems = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", quantity: 34, price: 129.99, status: "In Stock" },
  { id: 2, name: "Ergonomic Chair", sku: "EC-042", category: "Furniture", quantity: 5, price: 349.00, status: "Low Stock" },
  { id: 3, name: "USB-C Hub", sku: "UC-019", category: "Electronics", quantity: 0, price: 49.99, status: "Out of Stock" },
  { id: 4, name: "Standing Desk", sku: "SD-088", category: "Furniture", quantity: 12, price: 599.00, status: "In Stock" },
  { id: 5, name: "Mechanical Keyboard", sku: "MK-033", category: "Electronics", quantity: 3, price: 179.99, status: "Low Stock" },
];

const demoOrders = [
  { id: "ORD-1042", item: "Wireless Headphones", qty: 2, total: 259.98, date: "Today, 10:24 AM", status: "Delivered" },
  { id: "ORD-1041", item: "Ergonomic Chair", qty: 1, total: 349.00, date: "Today, 09:10 AM", status: "Pending" },
  { id: "ORD-1040", item: "USB-C Hub", qty: 4, total: 199.96, date: "Yesterday", status: "Delivered" },
  { id: "ORD-1039", item: "Mechanical Keyboard", qty: 1, total: 179.99, date: "Yesterday", status: "Cancelled" },
  { id: "ORD-1038", item: "Standing Desk", qty: 2, total: 1198.00, date: "2 days ago", status: "Delivered" },
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
  { name: "Electronics", inStock: 37, lowStock: 3, outStock: 1 },
  { name: "Furniture", inStock: 12, lowStock: 5, outStock: 0 },
  { name: "Accessories", inStock: 24, lowStock: 2, outStock: 2 },
  { name: "Office", inStock: 18, lowStock: 1, outStock: 0 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 1000 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.floor(value * eased));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
};

const statusConfig = {
  "In Stock":    { color: "#059669", bg: "rgba(5,150,105,0.08)",  icon: CheckCircle2 },
  "Low Stock":   { color: "#ea580c", bg: "rgba(234,88,12,0.08)",  icon: AlertTriangle },
  "Out of Stock":{ color: "#dc2626", bg: "rgba(220,38,38,0.08)",  icon: XCircle },
  "Delivered":   { color: "#059669", bg: "rgba(5,150,105,0.08)",  icon: CheckCircle2 },
  "Pending":     { color: "#0891b2", bg: "rgba(8,145,178,0.08)",  icon: Clock },
  "Cancelled":   { color: "#dc2626", bg: "rgba(220,38,38,0.08)",  icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { color: "#6b7280", bg: "rgba(107,114,128,0.08)", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 6, fontFamily: "'DM Mono', monospace",
      whiteSpace: "nowrap",
    }}>
      <Icon size={10} />
      {status}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
      fontFamily: "'DM Mono', monospace", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      color: "#111827",
    }}>
      <p style={{ color: "#6b7280", marginBottom: 4, fontSize: 11 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>${p.value?.toLocaleString?.() ?? p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────

const Dashboard = ({
  items = demoItems,
  orders = demoOrders,
  totalItems,
  totalValue,
  lowStockItems,
  getStatus,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const computedTotalItems = totalItems ?? items.length;
  const computedTotalValue = totalValue ?? items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
  const computedLowStock = lowStockItems ?? items.filter(i => i.status === "Low Stock" || i.quantity <= 5).length;
  const outOfStock = items.filter(i => i.status === "Out of Stock" || i.quantity === 0).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          --bg: #f5f6fa;
          --surface: #ffffff;
          --border: rgba(0,0,0,0.07);
          --text: #111827;
          --muted: #6b7280;
          --cyan: #0891b2;
          --indigo: #6366f1;
          --green: #059669;
          --orange: #ea580c;
          --red: #dc2626;

          font-family: 'Syne', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          padding: 32px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .dash-root.mounted { opacity: 1; transform: translateY(0); }

        /* Header */
        .dash-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
        }
        .dash-title { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
        .dash-sub { color: var(--muted); font-size: 13px; margin-top: 4px; font-family: 'DM Mono', monospace; }
        .dash-date {
          display: flex; align-items: center; gap: 8px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 8px 14px;
          font-size: 12px; font-family: 'DM Mono', monospace; color: var(--muted);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        /* Stat cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
          opacity: 0.8;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09); }

        .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .stat-icon {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
        }
        .stat-delta {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 600;
          padding: 3px 8px; border-radius: 6px;
          font-family: 'DM Mono', monospace;
        }
        .stat-delta.up { background: rgba(5,150,105,0.1); color: var(--green); }
        .stat-delta.down { background: rgba(220,38,38,0.1); color: var(--red); }

        .stat-label { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; margin-bottom: 6px; }
        .stat-value { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: var(--text); }

        /* Cards */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .card-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .card-title { font-size: 15px; font-weight: 700; }
        .card-sub { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; margin-top: 2px; }
        .card-link {
          font-size: 12px; color: var(--cyan); font-weight: 600;
          cursor: pointer; text-decoration: none; font-family: 'DM Mono', monospace;
          display: flex; align-items: center; gap: 4px;
        }
        .card-link:hover { opacity: 0.75; }

        /* Charts row */
        .charts-row {
          display: grid; grid-template-columns: 3fr 2fr;
          gap: 16px; margin-bottom: 24px;
        }
        @media (max-width: 900px) { .charts-row { grid-template-columns: 1fr; } }

        /* Table */
        .inv-table { width: 100%; border-collapse: collapse; }
        .inv-table th {
          text-align: left; font-size: 10px; color: var(--muted);
          font-family: 'DM Mono', monospace; padding: 8px 0;
          border-bottom: 1px solid var(--border); font-weight: 500;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .inv-table td {
          padding: 12px 0; font-size: 13px;
          border-bottom: 1px solid var(--border); vertical-align: middle;
        }
        .inv-table tr:last-child td { border-bottom: none; }
        .inv-table tr { transition: background 0.15s; }
        .inv-table tbody tr:hover td { background: rgba(0,0,0,0.015); }

        .item-name { font-weight: 600; color: var(--text); }
        .item-sku { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; margin-top: 2px; }
        .item-qty { font-family: 'DM Mono', monospace; font-weight: 600; }
        .item-price { font-family: 'DM Mono', monospace; }

        /* Orders table */
        .bottom-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }

        /* Quick stats row */
        .quick-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 10px;
        }
        .quick-chip {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 14px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .quick-chip-label { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.05em; }
        .quick-chip-val { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }

        /* Staggered animation */
        .fade-up {
          opacity: 0; transform: translateY(10px);
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className={`dash-root${mounted ? " mounted" : ""}`}>

        {/* Header */}
        <div className="dash-header">
          <div>
            <h2 className="dash-title">Dashboard</h2>
            <p className="dash-sub">Welcome back! Here's your inventory overview.</p>
          </div>
          <div className="dash-date">
            <Clock size={13} />
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          {[
            { icon: Package, bg: "#0891b2", label: "Total Items", value: computedTotalItems, accent: "#0891b2", delta: "+4", up: true },
            { icon: DollarSign, bg: "#6366f1", label: "Total Value", value: Math.round(computedTotalValue), prefix: "$", accent: "#6366f1", delta: "+12.4%", up: true },
            { icon: AlertTriangle, bg: "#ea580c", label: "Low Stock", value: computedLowStock, accent: "#ea580c", delta: "+2", up: false },
            { icon: XCircle, bg: "#dc2626", label: "Out of Stock", value: outOfStock, accent: "#dc2626", delta: "-1", up: true },
          ].map(({ icon: Icon, bg, label, value, prefix = "", accent, delta, up }, i) => (
            <div
              key={label}
              className="stat-card fade-up"
              style={{ "--accent": accent, animationDelay: `${i * 80}ms` }}
            >
              <div className="stat-top">
                <div className="stat-icon" style={{ background: bg }}>
                  <Icon size={18} />
                </div>
                <span className={`stat-delta ${up ? "up" : "down"}`}>
                  {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {delta}
                </span>
              </div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">
                <AnimatedNumber value={value} prefix={prefix} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="charts-row fade-up" style={{ animationDelay: "200ms" }}>
          {/* Revenue trend */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Revenue Trend</div>
                <div className="card-sub">Last 7 days</div>
              </div>
              <span className="card-link"><TrendingUp size={12} /> This week</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stock breakdown */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Stock by Category</div>
                <div className="card-sub">In stock vs low</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="inStock" name="inStock" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lowStock" name="lowStock" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row fade-up" style={{ animationDelay: "300ms" }}>
          {/* Inventory table */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Inventory</div>
                <div className="card-sub">{items.length} items total</div>
              </div>
              <a className="card-link">View all <ArrowUpRight size={12} /></a>
            </div>
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-name">{item.name}</div>
                      <div className="item-sku">{item.sku}</div>
                    </td>
                    <td className="item-qty">{item.quantity}</td>
                    <td className="item-price">${item.price.toFixed(2)}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent orders */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Recent Orders</div>
                <div className="card-sub">{orders.length} orders today</div>
              </div>
              <a className="card-link">View all <ArrowUpRight size={12} /></a>
            </div>
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="item-name" style={{ fontSize: 12 }}>{order.item}</div>
                      <div className="item-sku">{order.id} · {order.date}</div>
                    </td>
                    <td className="item-price">${order.total.toFixed(2)}</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;