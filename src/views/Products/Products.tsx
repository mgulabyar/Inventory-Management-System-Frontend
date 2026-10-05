import React, { useState, useEffect } from "react";
import API from "../../services/api";
import type { Product, Category } from "../../types";
import "./Products.css";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Toggle form box visibility visibility controls
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Form input capture elements state buffers
  const [name, setName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        API.get<{ success: boolean; data: Product[] }>("/products"),
        API.get<{ success: boolean; data: Category[] }>("/categories"),
      ]);

      if (productRes.data.success) setProducts(productRes.data.data);
      if (categoryRes.data.success) setCategories(categoryRes.data.data);
    } catch (err: any) {
      setError("Failed to query inventory master records data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const resetFormFields = () => {
    setName("");
    setSku("");
    setCategory("");
    setCostPrice(0);
    setSellingPrice(0);
    setQuantity(0);
    setLowStockThreshold(5);
    setEditMode(false);
    setSelectedProductId("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payloadData = {
      name,
      sku,
      category,
      costPrice,
      sellingPrice,
      quantity,
      lowStockThreshold,
    };

    try {
      if (editMode) {
        const res = await API.put(
          `/products/${selectedProductId}`,
          payloadData,
        );
        if (res.data.success) resetFormFields();
      } else {
        const res = await API.post("/products", payloadData);
        if (res.data.success) resetFormFields();
      }
      setShowForm(false);
      fetchInventoryData(); // Refresh datasets lines view structures
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Transaction validation mismatch.",
      );
    }
  };

  const handleEditTrigger = (p: Product) => {
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category ? p.category._id : "");
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setQuantity(p.quantity);
    setLowStockThreshold(p.lowStockThreshold);
    setSelectedProductId(p._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDeleteTrigger = async (id: string) => {
    if (
      window.confirm(
        "Are you absolutely sure you want to completely purge this item from index?",
      )
    ) {
      try {
        await API.delete(`/products/${id}`);
        fetchInventoryData();
      } catch (err: any) {
        setError("Action denied. Verification dependency restrictions found.");
      }
    }
  };

  const handleCSVDownload = async () => {
    try {
      const response = await API.get("/export/products", {
        responseType: "blob",
      });
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `Inventory_Stock_Report_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Unable to extract CSV file streaming buffers.");
    }
  };

  if (loading)
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
        Populating Inventory Matrix Tables Data Grid...
      </div>
    );

  return (
    <div className="products-view-master-wrapper">
      <div className="products-view-action-header-bar">
        <div>
          <h2>Master Inventory Index</h2>
          <p>
            Manage product profiles pricing controls low stock thresholds
            metrics
          </p>
        </div>
        <div className="products-view-header-buttons-cluster">
          <button
            className="utility-btn-export-csv"
            onClick={handleCSVDownload}
          >
            📥 Download CSV Sheet
          </button>
          <button
            className="primary-action-add-item-btn"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetFormFields();
            }}
          >
            {showForm ? "Close Control Box" : "＋ Add New Stock Item"}
          </button>
        </div>
      </div>

      {error && <div className="products-error-alert-banner">{error}</div>}

      {/* 🚀 TOGGLE BOX DEDICATED SECTION CONTROLLERS FORM */}
      {showForm && (
        <div className="products-dedicated-toggle-form-box">
          <h4>
            {editMode
              ? "⚙️ Edit Product Configuration Ledger"
              : "➕ Register Fresh Stock Record Profile"}
          </h4>
          <form
            onSubmit={handleFormSubmit}
            className="products-form-grid-element"
          >
            <div className="form-input-field-tile">
              <label>Product Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-input-field-tile">
              <label>SKU / Barcode Identifier</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                disabled={editMode}
              />
            </div>
            <div className="form-input-field-tile">
              <label>Category Classification Group</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select active link category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-input-field-tile">
              <label>Cost Price (\$)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-input-field-tile">
              <label>Selling Price (\$)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-input-field-tile">
              <label>Initial Quantity Stock Level</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="form-input-field-tile">
              <label>Low Stock Warning Limit Safety Trigger</label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="form-submit-buttons-strip">
              <button
                type="button"
                className="form-cancel-inner-btn"
                onClick={() => {
                  setShowForm(false);
                  resetFormFields();
                }}
              >
                Dismiss
              </button>
              <button type="submit" className="form-save-inner-btn">
                {editMode ? "Apply Updates" : "Commit Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📊 CORE DATA GRID ROWS MATRIX INDEX VIEW */}
      <div className="products-table-viewport-panel-card">
        <table className="products-custom-data-grid-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>SKU Code</th>
              <th>Category Group</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Available Stock</th>
              <th>Status Alert</th>
              <th style={{ textAlign: "right" }}>Management Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className={p.isLowStock ? "row-alert-danger-highlight" : ""}
              >
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>
                  <code>{p.sku}</code>
                </td>
                <td>
                  <span className="table-badge-category-group">
                    {p.category ? p.category.name : "Unassigned"}
                  </span>
                </td>
                <td>\${p.costPrice.toFixed(2)}</td>
                <td>\${p.sellingPrice.toFixed(2)}</td>
                <td>
                  <strong>{p.quantity} Units</strong>
                </td>
                <td>
                  <span
                    className={`table-status-indicator-badge ${p.isLowStock ? "danger" : "secure"}`}
                  >
                    {p.isLowStock ? "⚠️ LOW STOCK ALERT" : "✅ SECURE"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="table-actions-inline-buttons-cluster">
                    <button
                      className="inline-action-edit-btn"
                      onClick={() => handleEditTrigger(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="inline-action-delete-btn"
                      onClick={() => handleDeleteTrigger(p._id)}
                    >
                      Purge
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
