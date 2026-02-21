import React, { useState } from "react";

import {
  Router,
  Sidebar,
  Dashboard,
  Inventory,
  Orders,
  Suppliers,
  Analytics,
 
  ProductModal,
} from "../Components";

import {
  Bell, Moon, Sun, Globe, Shield, Database,
  Save, User, Mail, Phone, Building2, CheckCircle
} from "lucide-react";

/* ── Initial data ─────────────────────────────────────────────────────────── */

const INITIAL_ITEMS = [
  { id: 1, name: "Laptop - Dell XPS 15", sku: "LAP-001", quantity: 45, reorderPoint: 20, category: "Electronics", price: 1299.99, supplier: "Tech Direct",  lastOrdered: "2024-01-15" },
  { id: 2, name: "Wireless Mouse",        sku: "ACC-002", quantity: 15, reorderPoint: 25, category: "Accessories", price: 29.99,   supplier: "Office Plus",  lastOrdered: "2024-02-01" },
  { id: 3, name: "Monitor 27\" 4K",       sku: "MON-001", quantity: 0,  reorderPoint: 15, category: "Electronics", price: 449.99,  supplier: "Tech Direct",  lastOrdered: "2024-01-05" },
  { id: 4, name: "Ergonomic Chair",        sku: "EC-042",  quantity: 5,  reorderPoint: 8,  category: "Furniture",   price: 349.00,  supplier: "FurniturePlus", lastOrdered: "2024-02-10" },
  { id: 5, name: "USB-C Hub",              sku: "UC-019",  quantity: 0,  reorderPoint: 15, category: "Electronics", price: 49.99,   supplier: "Tech Direct",  lastOrdered: "2024-01-20" },
];

const INITIAL_ORDERS = [
  { id: 1, orderNumber: "PO-2024-001", supplier: "Tech Direct",  items: 3, total: 3599.97, status: "Delivered",  date: "Feb 01, 2024" },
  { id: 2, orderNumber: "PO-2024-002", supplier: "Office Plus",  items: 5, total: 849.50,  status: "In Transit", date: "Feb 15, 2024" },
  { id: 3, orderNumber: "PO-2024-003", supplier: "FurniturePlus",items: 2, total: 1240.00, status: "Processing", date: "Feb 20, 2024" },
];

const INITIAL_SUPPLIERS = [
  { id: 1, name: "Tech Direct",   contact: "John Smith",   email: "john@techdirect.com",    phone: "+1 (555) 010-1010", location: "San Francisco, CA", category: "Electronics", rating: 4.8, status: "Active",   totalOrders: 142, totalValue: 284000, leadTime: "3–5 days",  avatar: "TD", avatarBg: "bg-indigo-100", avatarText: "text-indigo-600" },
  { id: 2, name: "Office Plus",   contact: "Amy Lee",      email: "amy@officeplus.com",      phone: "+1 (555) 020-2020", location: "Austin, TX",        category: "Accessories", rating: 4.3, status: "Active",   totalOrders: 87,  totalValue: 96500,  leadTime: "2–4 days",  avatar: "OP", avatarBg: "bg-sky-100",    avatarText: "text-sky-600" },
  { id: 3, name: "FurniturePlus", contact: "Mark Williams",email: "mark@furnitureplus.com",  phone: "+1 (555) 030-3030", location: "Chicago, IL",       category: "Furniture",   rating: 4.1, status: "On Hold", totalOrders: 54,  totalValue: 67800,  leadTime: "7–10 days", avatar: "FP", avatarBg: "bg-orange-100", avatarText: "text-orange-600" },
];

const CATEGORIES = ["All", "Electronics", "Accessories", "Furniture", "Office"];

/* ── Settings page ────────────────────────────────────────────────────────── */

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: "Alex Morgan", email: "alex@stockflow.com", phone: "+1 (555) 000-0000", company: "StockFlow Inc." });
  const [prefs, setPrefs] = useState({ notifications: true, darkMode: false, language: "English", autoReorder: false });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: "#f5f6fa", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div className="mb-7">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Profile */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center"><User size={15} className="text-indigo-600" /></div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Profile</h3>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Your personal information</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { key: "name", label: "Full Name", icon: User },
              { key: "email", label: "Email", icon: Mail },
              { key: "phone", label: "Phone", icon: Phone },
              { key: "company", label: "Company", icon: Building2 },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-indigo-400 transition-all">
                  <Icon size={13} className="text-gray-400 flex-shrink-0" />
                  <input
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none"
                    value={profile[key]}
                    onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center"><Shield size={15} className="text-indigo-600" /></div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Preferences</h3>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>App behaviour & notifications</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { key: "notifications", label: "Email Notifications", sub: "Receive low stock and order alerts", icon: Bell },
              { key: "autoReorder",   label: "Auto Reorder",        sub: "Automatically create orders at reorder point", icon: Database },
            ].map(({ key, label, sub, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <Icon size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{sub}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
                  className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${prefs[key] ? "bg-indigo-600" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs[key] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block" style={{ fontFamily: "'DM Mono', monospace" }}>Language</label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-indigo-400 transition-all">
                <Globe size={13} className="text-gray-400" />
                <select
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none cursor-pointer"
                  value={prefs.language}
                  onChange={e => setPrefs({ ...prefs, language: e.target.value })}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {["English", "Spanish", "French", "German", "Japanese"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"><Shield size={15} className="text-red-500" /></div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Danger Zone</h3>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Irreversible actions — proceed with caution</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2.5 rounded-xl text-xs font-bold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all">
              Clear All Orders
            </button>
            <button className="px-4 py-2.5 rounded-xl text-xs font-bold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all">
              Reset Inventory
            </button>
            <button className="px-4 py-2.5 rounded-xl text-xs font-bold border border-red-300 bg-red-600 text-white hover:bg-red-700 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-sm
            ${saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
};

/* ── Root ─────────────────────────────────────────────────────────────────── */

const InventoryManagementSystem = () => {

  /* State */
  const [items, setItems]               = useState(INITIAL_ITEMS);
  const [orders]                        = useState(INITIAL_ORDERS);
  const [suppliers]                     = useState(INITIAL_SUPPLIERS);
  const [searchTerm, setSearchTerm]     = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem]   = useState(null);
  const [formData, setFormData]         = useState({ name: "", sku: "", quantity: "", reorderPoint: "", category: "Electronics", price: "", supplier: "" });

  /* Helpers */
  const getStatus = (qty, reorder) => {
    if (qty === 0)        return "Out of Stock";
    if (qty <= reorder)   return "Low Stock";
    return "In Stock";
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const totalItems    = items.reduce((s, i) => s + i.quantity, 0);
  const totalValue    = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const lowStockItems = items.filter(i => getStatus(i.quantity, i.reorderPoint) !== "In Stock").length;

  /* CRUD */
  const resetForm = () => setFormData({ name: "", sku: "", quantity: "", reorderPoint: "", category: "Electronics", price: "", supplier: "" });

  const handleAddItem = () => {
    setItems(prev => [...prev, { id: Date.now(), ...formData, quantity: Number(formData.quantity), reorderPoint: Number(formData.reorderPoint), price: Number(formData.price) }]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditItem = () => {
    setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData, quantity: Number(formData.quantity), reorderPoint: Number(formData.reorderPoint), price: Number(formData.price) } : i));
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const openEditModal = (item) => { setEditingItem(item); setFormData(item); };

  /* Render */
  return (
    <Router
      validPaths={["/", "/inventory", "/orders", "/suppliers", "/analytics", "/settings"]}
      onNavigate={() => window.scrollTo(0, 0)}
    >
      {({ currentPath, navigate }) => (
        <div className="flex min-h-screen" style={{ background: "#f5f6fa" }}>

          <Sidebar
            currentPath={currentPath}
            navigate={navigate}
            lowStockItems={lowStockItems}
            user={{ name: "Alex Morgan", role: "Admin" }}
          />

          <main className="flex-1 min-w-0">
            {currentPath === "/"           && <Dashboard items={items} orders={orders} totalItems={totalItems} totalValue={totalValue} lowStockItems={lowStockItems} getStatus={getStatus} />}
            {currentPath === "/inventory"  && <Inventory filteredItems={filteredItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterCategory={filterCategory} setFilterCategory={setFilterCategory} categories={CATEGORIES} openEditModal={openEditModal} handleDeleteItem={handleDeleteItem} getStatus={getStatus} setShowAddModal={setShowAddModal} />}
            {currentPath === "/orders"     && <Orders orders={orders} />}
            {currentPath === "/suppliers"  && <Suppliers suppliers={suppliers} />}
            {currentPath === "/analytics"  && <Analytics />}
            {currentPath === "/settings"   && <Settings />}
          </main>

          <ProductModal
            showAddModal={showAddModal}
            editingItem={editingItem}
            formData={formData}
            setFormData={setFormData}
            handleAddItem={handleAddItem}
            handleEditItem={handleEditItem}
            setShowAddModal={setShowAddModal}
            setEditingItem={setEditingItem}
            resetForm={resetForm}
            categories={CATEGORIES.filter(c => c !== "All")}
          />

        </div>
      )}
    </Router>
  );
};

export default InventoryManagementSystem;