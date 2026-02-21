import { useState, useEffect, useRef } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Users, Eye,
  ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight,
  Calendar, RefreshCw, Download, Filter, ChevronDown
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ── Data ────────────────────────────────────────────────────────────────────

const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 60000) + 20000,
    users: Math.floor(Math.random() * 4000) + 1000,
    orders: Math.floor(Math.random() * 800) + 200,
    pageViews: Math.floor(Math.random() * 50000) + 10000,
  }));
};

const trafficData = [
  { name: "Organic", value: 42, color: "#0891b2" },
  { name: "Direct", value: 28, color: "#6366f1" },
  { name: "Referral", value: 18, color: "#059669" },
  { name: "Social", value: 12, color: "#ea580c" },
];

const topPages = [
  { page: "/home", views: 48200, change: +12.4 },
  { page: "/products", views: 31500, change: +5.7 },
  { page: "/pricing", views: 22100, change: -2.3 },
  { page: "/blog", views: 18900, change: +18.9 },
  { page: "/about", views: 9400, change: +0.4 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
  : n.toString();

const fmtUSD = (n) => `$${fmt(n)}`;

// ── Sub-components ───────────────────────────────────────────────────────────

const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.floor(from + (value - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
};

const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const StatCard = ({ icon: Icon, label, value, prefix = "", change, color, sparkData }) => {
  const up = change >= 0;
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <div className="stat-top">
        <div className="stat-icon-wrap">
          <Icon size={18} />
        </div>
        <span className={`stat-badge ${up ? "up" : "down"}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </span>
      </div>
      <div className="stat-value">
        <AnimatedNumber value={value} prefix={prefix} />
      </div>
      <div className="stat-label">{label}</div>
      {sparkData && (
        <div className="stat-spark">
          <Sparkline data={sparkData} color={color} />
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.name === "revenue" ? fmtUSD(p.value) : fmt(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

const RANGES = ["7D", "30D", "90D", "1Y"];

// ── Main ─────────────────────────────────────────────────────────────────────

const Analytics = () => {
  const [data, setData] = useState(() => generateMonthlyData());
  const [range, setRange] = useState("1Y");
  const [activeChart, setActiveChart] = useState("revenue");
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateMonthlyData());
      setRefreshing(false);
    }, 800);
  };

  const totals = data.reduce(
    (acc, d) => ({
      revenue: acc.revenue + d.revenue,
      users: acc.users + d.users,
      orders: acc.orders + d.orders,
      pageViews: acc.pageViews + d.pageViews,
    }),
    { revenue: 0, users: 0, orders: 0, pageViews: 0 }
  );

  const sparkFor = (key) =>
    data.slice(-8).map((d) => ({ value: d[key] }));

  const chartData = data.map((d) => ({ ...d, name: d.month }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .analytics-root {
          --bg: #f5f6fa;
          --surface: #ffffff;
          --surface2: #f0f1f5;
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
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .analytics-root.mounted { opacity: 1; transform: translateY(0); }

        /* Header */
        .ana-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .ana-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .ana-subtitle { color: var(--muted); font-size: 13px; margin-top: 4px; font-family: 'DM Mono', monospace; }
        .ana-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

        .range-tabs {
          display: flex;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }
        .range-tab {
          padding: 7px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
          transition: all 0.2s;
        }
        .range-tab.active { background: var(--indigo); color: #ffffff; }

        .btn-icon {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          font-size: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon:hover { border-color: var(--cyan); color: var(--cyan); }
        .btn-icon.spin svg { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          opacity: 0.7;
        }
        .stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }

        .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .stat-icon-wrap {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          color: var(--accent);
          display: flex; align-items: center; justify-content: center;
        }
        .stat-badge {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 600; padding: 3px 8px;
          border-radius: 6px; font-family: 'DM Mono', monospace;
        }
        .stat-badge.up { background: rgba(52,211,153,0.12); color: var(--green); }
        .stat-badge.down { background: rgba(248,113,113,0.12); color: var(--red); }

        .stat-value { font-size: 30px; font-weight: 800; letter-spacing: -1px; margin-bottom: 4px; }
        .stat-label { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; }
        .stat-spark { margin-top: 12px; opacity: 0.7; }

        /* Charts row */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) { .charts-row { grid-template-columns: 1fr; } }

        .chart-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .chart-card-title { font-size: 15px; font-weight: 700; }
        .chart-card-sub { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; margin-top: 2px; }

        .metric-tabs { display: flex; gap: 6px; }
        .metric-tab {
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: none;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .metric-tab.active { border-color: var(--cyan); color: var(--cyan); background: rgba(8,145,178,0.08); }

        .custom-tooltip {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          color: var(--text);
        }
        .tooltip-label { color: var(--muted); margin-bottom: 6px; font-size: 11px; }

        /* Pie chart */
        .traffic-list { margin-top: 8px; display: flex; flex-direction: column; gap: 10px; }
        .traffic-item {
          display: flex; align-items: center; gap: 10px; font-size: 12px;
        }
        .traffic-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .traffic-name { flex: 1; color: var(--muted); font-family: 'DM Mono', monospace; }
        .traffic-val { font-weight: 700; }
        .traffic-bar-wrap { width: 80px; height: 4px; background: var(--border); border-radius: 2px; }
        .traffic-bar { height: 100%; border-radius: 2px; }

        /* Bottom row */
        .bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }

        /* Top pages table */
        .pages-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        .pages-table th {
          text-align: left; font-size: 10px; color: var(--muted);
          font-family: 'DM Mono', monospace; padding: 8px 0; border-bottom: 1px solid var(--border);
          font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .pages-table td {
          padding: 12px 0; font-size: 12px; border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        .pages-table tr:last-child td { border-bottom: none; }
        .page-name { font-family: 'DM Mono', monospace; color: var(--cyan); }
        .page-views { font-weight: 700; }
        .page-change { font-size: 11px; display: flex; align-items: center; gap: 2px; font-family: 'DM Mono', monospace; }
        .page-change.up { color: var(--green); }
        .page-change.down { color: var(--red); }

        /* Bar chart */
        .orders-chart { margin-top: 4px; }
      `}</style>

      <div className={`analytics-root${mounted ? " mounted" : ""}`}>
        {/* Header */}
        <div className="ana-header">
          <div>
            <h1 className="ana-title">Analytics</h1>
            <p className="ana-subtitle">Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          <div className="ana-actions">
            <div className="range-tabs">
              {RANGES.map((r) => (
                <button key={r} className={`range-tab${range === r ? " active" : ""}`} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
            <button className={`btn-icon${refreshing ? " spin" : ""}`} onClick={handleRefresh}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="btn-icon">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard icon={DollarSign} label="Total Revenue" value={totals.revenue} prefix="$" change={14.2} color="var(--cyan)" sparkData={sparkFor("revenue")} />
          <StatCard icon={Users} label="Active Users" value={totals.users} change={8.7} color="var(--indigo)" sparkData={sparkFor("users")} />
          <StatCard icon={ShoppingCart} label="Orders" value={totals.orders} change={-3.1} color="var(--orange)" sparkData={sparkFor("orders")} />
          <StatCard icon={Eye} label="Page Views" value={totals.pageViews} change={22.5} color="var(--green)" sparkData={sparkFor("pageViews")} />
        </div>

        {/* Main Chart + Traffic */}
        <div className="charts-row">
          {/* Area / Line chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Performance Overview</div>
                <div className="chart-card-sub">Monthly breakdown</div>
              </div>
              <div className="metric-tabs">
                {["revenue", "users", "pageViews", "orders"].map((m) => (
                  <button key={m} className={`metric-tab${activeChart === m ? " active" : ""}`} onClick={() => setActiveChart(m)}>
                    {m === "pageViews" ? "views" : m}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey={activeChart} stroke="#0891b2" strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: "#0891b2" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Traffic Sources</div>
                <div className="chart-card-sub">By channel</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
                  {trafficData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, fontSize: 12, color: "#111827" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="traffic-list">
              {trafficData.map((t) => (
                <div key={t.name} className="traffic-item">
                  <div className="traffic-dot" style={{ background: t.color }} />
                  <span className="traffic-name">{t.name}</span>
                  <div className="traffic-bar-wrap">
                    <div className="traffic-bar" style={{ width: `${t.value}%`, background: t.color }} />
                  </div>
                  <span className="traffic-val">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="bottom-row">
          {/* Top pages */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Top Pages</div>
                <div className="chart-card-sub">By page views</div>
              </div>
            </div>
            <table className="pages-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.page}>
                    <td className="page-name">{p.page}</td>
                    <td className="page-views">{p.views.toLocaleString()}</td>
                    <td>
                      <span className={`page-change ${p.change >= 0 ? "up" : "down"}`}>
                        {p.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(p.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Orders bar chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Monthly Orders</div>
                <div className="chart-card-sub">Volume by month</div>
              </div>
            </div>
            <div className="orders-chart">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;