import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2,
  ChevronUp, ChevronDown, ChevronsUpDown,
  Package, CheckCircle2, AlertTriangle, XCircle,
  Download
} from "lucide-react";

/* ───────── Demo Data ───────── */

const demoItems = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", quantity: 34, price: 129.99, reorderPoint: 10 },
  { id: 2, name: "Ergonomic Chair", sku: "EC-042", category: "Furniture", quantity: 5, price: 349.00, reorderPoint: 8 },
  { id: 3, name: "USB-C Hub", sku: "UC-019", category: "Electronics", quantity: 0, price: 49.99, reorderPoint: 15 },
  { id: 4, name: "Standing Desk", sku: "SD-088", category: "Furniture", quantity: 12, price: 599.00, reorderPoint: 5 },
  { id: 5, name: "Mechanical Keyboard", sku: "MK-033", category: "Electronics", quantity: 3, price: 179.99, reorderPoint: 10 },
];

const demoCategories = ["All Categories", "Electronics", "Furniture", "Accessories", "Office"];

const defaultGetStatus = (qty, reorderPoint = 10) => {
  if (qty === 0) return "Out of Stock";
  if (qty <= reorderPoint * 0.5) return "Low Stock";
  return "In Stock";
};

/* ───────── Status Badge ───────── */

const StatusBadge = ({ status }) => {
  const styles = {
    "In Stock": "bg-green-50 text-green-600 border-green-200",
    "Low Stock": "bg-orange-50 text-orange-600 border-orange-200",
    "Out of Stock": "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md border ${styles[status]}`}>
      {status}
    </span>
  );
};

/* ───────── Sort Icon ───────── */

const SortIcon = ({ col, sortCol, sortDir }) => {
  if (sortCol !== col) return <ChevronsUpDown size={14} className="opacity-40" />;
  return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
};

/* ───────── Main ───────── */

const Inventory = ({
  filteredItems,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories = demoCategories,
  openEditModal,
  handleDeleteItem,
  getStatus = defaultGetStatus,
  setShowAddModal,
}) => {

  const [localSearch, setLocalSearch] = useState("");
  const [localCategory, setLocalCategory] = useState("All Categories");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const search = searchTerm ?? localSearch;
  const setSearch = setSearchTerm ?? setLocalSearch;
  const category = filterCategory ?? localCategory;
  const setCategory = setFilterCategory ?? setLocalCategory;

  let items = filteredItems ?? demoItems.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All Categories" || item.category === category;
    return matchSearch && matchCat;
  });

  items = [...items].sort((a, b) => {
    let av = a[sortCol], bv = b[sortCol];
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const totalValue = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const cols = [
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Qty" },
    { key: "price", label: "Price" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold">Inventory</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your complete product catalog
        </p>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm">
          <span className="font-bold text-indigo-600 mr-2">{items.length}</span>
          Total Products
        </div>
        <div className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm">
          <span className="font-bold text-cyan-600 mr-2">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          Total Value
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">

        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU…"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>

        <button className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:border-indigo-500 hover:text-indigo-600">
          <Download size={14} /> Export
        </button>

        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
          onClick={() => setShowAddModal?.(true)}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              {cols.map(({ key, label }) => (
                <th
                  key={key}
                  className="text-left px-4 py-3 cursor-pointer select-none"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} sortCol={sortCol} sortDir={sortDir} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-500">
                  <Package size={40} className="mx-auto mb-4 opacity-40" />
                  No products found
                </td>
              </tr>
            ) : items.map(item => {
              const status = getStatus(item.quantity, item.reorderPoint);
              return (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-4 py-3">{item.sku}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">{item.quantity}</td>
                  <td className="px-4 py-3 font-mono">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="p-2 border rounded-md hover:border-indigo-500 hover:text-indigo-600"
                        onClick={() => openEditModal?.(item)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="p-2 border rounded-md hover:border-red-500 hover:text-red-600"
                        onClick={() => handleDeleteItem?.(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-4 py-3 border-t text-xs text-gray-500">
          <span>Showing {items.length} products</span>
          <span>Total value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

    </div>
  );
};

export default Inventory;