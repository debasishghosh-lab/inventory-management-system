import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, Filter,
  ChevronUp, ChevronDown, ChevronsUpDown,
  Package, CheckCircle2, AlertTriangle, XCircle,
  Download, SlidersHorizontal
} from "lucide-react";

// ── Demo data ────────────────────────────────────────────────────────────────

const demoItems = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", quantity: 34, price: 129.99, reorderPoint: 10 },
  { id: 2, name: "Ergonomic Chair", sku: "EC-042", category: "Furniture", quantity: 5, price: 349.00, reorderPoint: 8 },
  { id: 3, name: "USB-C Hub", sku: "UC-019", category: "Electronics", quantity: 0, price: 49.99, reorderPoint: 15 },
  { id: 4, name: "Standing Desk", sku: "SD-088", category: "Furniture", quantity: 12, price: 599.00, reorderPoint: 5 },
  { id: 5, name: "Mechanical Keyboard", sku: "MK-033", category: "Electronics", quantity: 3, price: 179.99, reorderPoint: 10 },
  { id: 6, name: "Monitor Stand", sku: "MS-017", category: "Accessories", quantity: 22, price: 59.99, reorderPoint: 6 },
  { id: 7, name: "Webcam HD", sku: "WC-004", category: "Electronics", quantity: 7, price: 89.99, reorderPoint: 8 },
  { id: 8, name: "Desk Lamp", sku: "DL-061", category: "Accessories", quantity: 0, price: 44.99, reorderPoint: 5 },
];

const demoCategories = ["All Categories", "Electronics", "Furniture", "Accessories", "Office"];

const defaultGetStatus = (qty, reorderPoint = 10) => {
  if (qty === 0) return "Out of Stock";
  if (qty <= reorderPoint * 0.5) return "Low Stock";
  return "In Stock";
};

// ── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  "In Stock":     { color: "#059669", bg: "rgba(5,150,105,0.09)",  icon: CheckCircle2 },
  "Low Stock":    { color: "#ea580c", bg: "rgba(234,88,12,0.09)",  icon: AlertTriangle },
  "Out of Stock": { color: "#dc2626", bg: "rgba(220,38,38,0.09)",  icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig["In Stock"];
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, padding: "4px 10px",
      borderRadius: 6, fontFamily: "'DM Mono', monospace",
      whiteSpace: "nowrap", border: `1px solid ${cfg.color}22`,
    }}>
      <Icon size={11} />
      {status}
    </span>
  );
};

// ── Sort icon ────────────────────────────────────────────────────────────────

const SortIcon = ({ col, sortCol, sortDir }) => {
  if (sortCol !== col) return <ChevronsUpDown size={13} style={{ opacity: 0.3 }} />;
  return sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
};

// ── Main ─────────────────────────────────────────────────────────────────────

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
  // Local state for demo / standalone use
  const [localSearch, setLocalSearch] = useState("");
  const [localCategory, setLocalCategory] = useState("All Categories");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const search = searchTerm ?? localSearch;
  const setSearch = setSearchTerm ?? setLocalSearch;
  const category = filterCategory ?? localCategory;
  const setCategory = setFilterCategory ?? setLocalCategory;

  // Compute items
  let items = filteredItems ?? demoItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All Categories" || item.category === category;
    return matchSearch && matchCat;
  });

  // Sort
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

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      handleDeleteItem?.(id);
      setDeletingId(null);
    }, 300);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .inv-root {
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
        }

        /* Header */
        .inv-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
        }
        .inv-title { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; }
        .inv-sub { color: var(--muted); font-size: 13px; margin-top: 4px; font-family: 'DM Mono', monospace; }

        /* Summary chips */
        .summary-row {
          display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .summary-chip {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 10px 16px;
          font-size: 12px; font-family: 'DM Mono', monospace;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex; align-items: center; gap: 8px;
        }
        .chip-val { font-size: 16px; font-weight: 800; font-family: 'Syne', sans-serif; color: var(--text); }
        .chip-label { color: var(--muted); }

        /* Toolbar */
        .toolbar {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 16px 20px;
          margin-bottom: 16px; display: flex; gap: 12px;
          align-items: center; flex-wrap: wrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .search-wrap {
          position: relative; flex: 1; min-width: 200px;
        }
        .search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .search-input {
          width: 100%; padding: 10px 14px 10px 40px;
          border: 1.5px solid var(--border); border-radius: 10px;
          font-size: 13px; font-family: 'Syne', sans-serif;
          background: var(--bg); color: var(--text);
          outline: none; transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--indigo); background: var(--surface); }
        .search-input::placeholder { color: var(--muted); }

        .cat-select {
          padding: 10px 14px; border: 1.5px solid var(--border);
          border-radius: 10px; font-size: 13px; font-family: 'Syne', sans-serif;
          background: var(--bg); color: var(--text); outline: none;
          cursor: pointer; transition: border-color 0.2s;
          min-width: 160px;
        }
        .cat-select:focus { border-color: var(--indigo); }

        .btn-add {
          display: flex; align-items: center; gap: 7px;
          background: var(--indigo); color: #fff;
          border: none; border-radius: 10px; padding: 10px 18px;
          font-size: 13px; font-family: 'Syne', sans-serif; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-add:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-add:active { transform: translateY(0); }

        .btn-export {
          display: flex; align-items: center; gap: 7px;
          background: var(--surface); color: var(--muted);
          border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 16px;
          font-size: 13px; font-family: 'Syne', sans-serif; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-export:hover { border-color: var(--indigo); color: var(--indigo); }

        /* Table card */
        .table-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .table-scroll { overflow-x: auto; }

        table { width: 100%; border-collapse: collapse; }
        thead { background: var(--bg); }
        thead tr { border-bottom: 1px solid var(--border); }
        th {
          padding: 12px 16px; text-align: left;
          font-size: 10px; color: var(--muted);
          font-family: 'DM Mono', monospace; font-weight: 500;
          letter-spacing: 0.07em; text-transform: uppercase;
          white-space: nowrap; user-select: none;
        }
        th.sortable { cursor: pointer; }
        th.sortable:hover { color: var(--indigo); }
        .th-inner { display: flex; align-items: center; gap: 5px; }

        tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background 0.15s, opacity 0.3s, transform 0.3s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr.deleting { opacity: 0; transform: translateX(20px); }
        tbody tr.hovered { background: rgba(99,102,241,0.03); }

        td { padding: 14px 16px; vertical-align: middle; font-size: 13px; }

        .td-name { font-weight: 700; color: var(--text); }
        .td-sku {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--muted); margin-top: 2px;
        }
        .td-cat {
          display: inline-flex; align-items: center;
          background: rgba(99,102,241,0.07); color: var(--indigo);
          font-size: 11px; font-weight: 600; padding: 3px 9px;
          border-radius: 6px; font-family: 'DM Mono', monospace;
        }
        .td-qty {
          font-family: 'DM Mono', monospace; font-weight: 700;
          font-size: 14px;
        }
        .td-qty.low { color: var(--orange); }
        .td-qty.out { color: var(--red); }
        .td-price { font-family: 'DM Mono', monospace; font-weight: 600; }

        /* Action buttons */
        .actions { display: flex; gap: 6px; }
        .btn-action {
          width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border);
          background: var(--bg); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s; color: var(--muted);
        }
        .btn-action.edit:hover { border-color: var(--indigo); color: var(--indigo); background: rgba(99,102,241,0.07); }
        .btn-action.del:hover { border-color: var(--red); color: var(--red); background: rgba(220,38,38,0.07); }

        /* Empty state */
        .empty-state {
          padding: 64px 24px; text-align: center; color: var(--muted);
        }
        .empty-icon {
          width: 56px; height: 56px; margin: 0 auto 16px;
          background: var(--bg); border-radius: 16px; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
        }
        .empty-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .empty-sub { font-size: 13px; font-family: 'DM Mono', monospace; }

        /* Footer */
        .table-footer {
          padding: 12px 20px; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace;
          background: var(--bg);
        }
      `}</style>

      <div className="inv-root">
        {/* Header */}
        <div className="inv-header">
          <div>
            <h2 className="inv-title">Inventory</h2>
            <p className="inv-sub">Manage your complete product catalog</p>
          </div>
        </div>

        {/* Summary chips */}
        <div className="summary-row">
          {[
            { label: "Total Products", val: (filteredItems ?? demoItems).length, color: "#6366f1" },
            { label: "Total Value", val: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "#0891b2" },
            { label: "Low Stock", val: items.filter(i => getStatus(i.quantity, i.reorderPoint) === "Low Stock").length, color: "#ea580c" },
            { label: "Out of Stock", val: items.filter(i => getStatus(i.quantity, i.reorderPoint) === "Out of Stock").length, color: "#dc2626" },
          ].map(({ label, val, color }) => (
            <div className="summary-chip" key={label}>
              <span className="chip-val" style={{ color }}>{val}</span>
              <span className="chip-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or SKU…"
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="cat-select" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <button className="btn-export">
            <Download size={13} /> Export
          </button>
          <button className="btn-add" onClick={() => setShowAddModal?.(true)}>
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {cols.map(({ key, label }) => (
                    <th key={key} className="sortable" onClick={() => handleSort(key)}>
                      <div className="th-inner">
                        {label}
                        <SortIcon col={key} sortCol={sortCol} sortDir={sortDir} />
                      </div>
                    </th>
                  ))}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-icon"><Package size={24} /></div>
                        <div className="empty-title">No products found</div>
                        <div className="empty-sub">Try adjusting your search or filter</div>
                      </div>
                    </td>
                  </tr>
                ) : items.map(item => {
                  const status = getStatus(item.quantity, item.reorderPoint);
                  const isDeleting = deletingId === item.id;
                  const qtyClass = status === "Out of Stock" ? "out" : status === "Low Stock" ? "low" : "";
                  return (
                    <tr
                      key={item.id}
                      className={`${isDeleting ? "deleting" : ""} ${hoveredRow === item.id ? "hovered" : ""}`}
                      onMouseEnter={() => setHoveredRow(item.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td>
                        <div className="td-name">{item.name}</div>
                        <div className="td-sku">{item.sku}</div>
                      </td>
                      <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--muted)" }}>{item.sku}</span></td>
                      <td><span className="td-cat">{item.category}</span></td>
                      <td><span className={`td-qty ${qtyClass}`}>{item.quantity}</span></td>
                      <td className="td-price">${item.price.toFixed(2)}</td>
                      <td><StatusBadge status={status} /></td>
                      <td>
                        <div className="actions">
                          <button className="btn-action edit" onClick={() => openEditModal?.(item)} title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button className="btn-action del" onClick={() => handleDelete(item.id)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Showing {items.length} product{items.length !== 1 ? "s" : ""}</span>
            <span>Total value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;