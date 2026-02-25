import { useState, useEffect, useRef } from "react";
import {
  Users, Eye, ShoppingCart, DollarSign,
  ArrowUpRight, ArrowDownRight,
  RefreshCw, Download
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ───────── Data ───────── */

const generateMonthlyData = () => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random()*60000)+20000,
    users: Math.floor(Math.random()*4000)+1000,
    orders: Math.floor(Math.random()*800)+200,
    pageViews: Math.floor(Math.random()*50000)+10000,
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
];

/* ───────── Helpers ───────── */

const fmt = (n) =>
  n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n/1_000).toFixed(1)}K`
  : n.toString();

const AnimatedNumber = ({ value, prefix="", duration=1000 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now-start)/duration,1);
      const eased = 1 - Math.pow(1-t,3);
      setDisplay(Math.floor(value*eased));
      if (t<1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  },[value,duration]);

  return <span>{prefix}{display.toLocaleString()}</span>;
};

const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false}/>
    </LineChart>
  </ResponsiveContainer>
);

/* ───────── Main ───────── */

const Analytics = () => {

  const [data, setData] = useState(() => generateMonthlyData());
  const [activeChart, setActiveChart] = useState("revenue");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(()=>{
      setData(generateMonthlyData());
      setRefreshing(false);
    },800);
  };

  const totals = data.reduce((acc,d)=>({
    revenue: acc.revenue+d.revenue,
    users: acc.users+d.users,
    orders: acc.orders+d.orders,
    pageViews: acc.pageViews+d.pageViews,
  }),{ revenue:0, users:0, orders:0, pageViews:0 });

  const sparkFor = key => data.slice(-8).map(d=>({ value:d[key] }));
  const chartData = data.map(d=>({ ...d, name:d.month }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm bg-white hover:border-cyan-500 hover:text-cyan-600 ${refreshing && "animate-spin"}`}
          >
            <RefreshCw size={14}/> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm bg-white hover:border-indigo-500 hover:text-indigo-600">
            <Download size={14}/> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {icon:DollarSign,label:"Revenue",value:totals.revenue,prefix:"$",color:"#0891b2"},
          {icon:Users,label:"Users",value:totals.users,color:"#6366f1"},
          {icon:ShoppingCart,label:"Orders",value:totals.orders,color:"#ea580c"},
          {icon:Eye,label:"Page Views",value:totals.pageViews,color:"#059669"},
        ].map(({icon:Icon,label,value,prefix="",color})=>(
          <div key={label} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4" style={{background:color}}>
              <Icon size={18}/>
            </div>
            <div className="text-3xl font-extrabold">
              <AnimatedNumber value={value} prefix={prefix}/>
            </div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
            <div className="mt-3">
              <Sparkline data={sparkFor(label.toLowerCase().replace(" ",""))} color={color}/>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Performance Overview</h3>
            <div className="flex gap-2 text-xs">
              {["revenue","users","pageViews","orders"].map(m=>(
                <button
                  key={m}
                  onClick={()=>setActiveChart(m)}
                  className={`px-3 py-1 rounded-md border ${activeChart===m ? "border-cyan-500 text-cyan-600 bg-cyan-50":"border-gray-200 text-gray-500"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis tickFormatter={fmt}/>
              <Tooltip/>
              <Area type="monotone" dataKey={activeChart} stroke="#0891b2" fill="#0891b222"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={trafficData} dataKey="value" innerRadius={50} outerRadius={70}>
                {trafficData.map(t=>(
                  <Cell key={t.name} fill={t.color}/>
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Pages */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Top Pages</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="text-left py-2">Page</th>
                <th className="text-left py-2">Views</th>
                <th className="text-left py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map(p=>(
                <tr key={p.page} className="border-b last:border-none">
                  <td className="py-3 text-cyan-600 font-mono">{p.page}</td>
                  <td className="font-semibold">{p.views.toLocaleString()}</td>
                  <td className={`flex items-center gap-1 text-xs ${p.change>=0?"text-green-600":"text-red-600"}`}>
                    {p.change>=0?<ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                    {Math.abs(p.change)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="orders" fill="#6366f1" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default Analytics;