import { useState } from "react";
import {
  X, Package, Tag, Hash, Layers,
  DollarSign, AlertTriangle, CheckCircle
} from "lucide-react";

/* ───────── Demo Categories ───────── */

const demoCategories = ["Electronics", "Furniture", "Accessories", "Office"];

/* ───────── Field Component ───────── */

const Field = ({ label, icon: Icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
      {label}
    </label>

    <div
      className={`flex items-center gap-2.5 px-3.5 py-2.5 border rounded-xl bg-gray-50
      focus-within:bg-white focus-within:border-indigo-400 transition-all
      ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
    >
      <Icon size={14} className={`${error ? "text-red-400" : "text-gray-400"} flex-shrink-0`} />
      {children}
    </div>

    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 font-mono">
        <AlertTriangle size={10} />
        {error}
      </p>
    )}
  </div>
);

const inputClass =
  "flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400 min-w-0";

/* ───────── Main Modal ───────── */

const ProductModal = ({
  showAddModal,
  editingItem,
  formData: externalFormData,
  setFormData: externalSetFormData,
  handleAddItem,
  handleEditItem,
  setShowAddModal,
  setEditingItem,
  resetForm,
  categories = demoCategories,
}) => {

  const [localForm, setLocalForm] = useState({
    name: "",
    sku: "",
    category: demoCategories[0],
    quantity: "",
    price: "",
    reorderPoint: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const formData = externalFormData ?? localForm;
  const setFormData = externalSetFormData ?? setLocalForm;

  const isOpen = showAddModal || !!editingItem;

  const validate = () => {
    const e = {};
    if (!formData.name?.trim()) e.name = "Product name is required";
    if (!formData.sku?.trim()) e.sku = "SKU is required";
    if (formData.quantity === "" || isNaN(Number(formData.quantity)))
      e.quantity = "Enter a valid quantity";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      e.price = "Enter a valid price";
    return e;
  };

  const handleClose = () => {
    setShowAddModal?.(false);
    setEditingItem?.(null);
    resetForm?.();
    setLocalForm({
      name: "",
      sku: "",
      category: demoCategories[0],
      quantity: "",
      price: "",
      reorderPoint: "",
    });
    setErrors({});
    setSaved(false);
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setSaving(true);

    await new Promise(r => setTimeout(r, 600));

    editingItem
      ? handleEditItem?.()
      : handleAddItem?.();

    setSaving(false);
    setSaved(true);

    setTimeout(handleClose, 800);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-[modalIn_0.2s_ease]"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
              <Package size={16} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                {editingItem ? "Edit Product" : "Add Product"}
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {editingItem
                  ? `Editing ${editingItem.sku}`
                  : "Fill in the product details"}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          <Field label="Product Name" icon={Package} error={errors.name}>
            <input
              className={inputClass}
              placeholder="e.g. Wireless Headphones"
              value={formData.name || ""}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="SKU" icon={Hash} error={errors.sku}>
              <input
                className={`${inputClass} font-mono`}
                placeholder="e.g. WH-001"
                value={formData.sku || ""}
                onChange={e =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </Field>

            <Field label="Category" icon={Tag}>
              <select
                className={`${inputClass} cursor-pointer`}
                value={formData.category || categories[0]}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity" icon={Layers} error={errors.quantity}>
              <input
                type="number"
                min="0"
                className={`${inputClass} font-mono`}
                placeholder="0"
                value={formData.quantity ?? ""}
                onChange={e =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </Field>

            <Field label="Price (USD)" icon={DollarSign} error={errors.price}>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`${inputClass} font-mono`}
                placeholder="0.00"
                value={formData.price ?? ""}
                onChange={e =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Field>
          </div>

          <Field label="Reorder Point" icon={AlertTriangle}>
            <input
              type="number"
              min="0"
              className={`${inputClass} font-mono`}
              placeholder="e.g. 10"
              value={formData.reorderPoint ?? ""}
              onChange={e =>
                setFormData({ ...formData, reorderPoint: e.target.value })
              }
            />
          </Field>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center gap-2 min-w-24 justify-center
              ${saved
                ? "bg-emerald-500"
                : saving
                ? "bg-indigo-400 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
          >
            {saved ? (
              <>
                <CheckCircle size={14} />
                Saved!
              </>
            ) : saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : editingItem ? (
              "Save Changes"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;