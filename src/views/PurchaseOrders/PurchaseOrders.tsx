import React, { useState, useEffect } from "react";
import API from "../../services/api";
import type { Product } from "../../types";
import "./PurchaseOrders.css";

interface Supplier {
  _id: string;
  name: string;
  email: string;
}

interface POItem {
  product: string;
  quantityOrdered: number;
  costPriceAtPurchase: number;
}

interface PurchaseOrder {
  _id: string;
  supplier: { _id: string; name: string; email: string };
  items: Array<{
    product: { _id: string; name: string; sku: string };
    quantityOrdered: number;
    costPriceAtPurchase: number;
  }>;
  totalAmount: number;
  status: "Draft" | "Sent" | "Received" | "Cancelled";
  createdAt: string;
}

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [orderQty, setOrderQty] = useState<number>(1);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);

  const fetchPurchaseWorkspaceData = async () => {
    try {
      setLoading(true);
      const [orderRes, supplierRes, productRes] = await Promise.all([
        API.get<{ success: boolean; data: PurchaseOrder[] }>(
          "/purchase-orders",
        ),
        API.get<{ success: boolean; data: Supplier[] }>("/suppliers"),
        API.get<{ success: boolean; data: Product[] }>("/products"),
      ]);

      if (orderRes.data.success) setOrders(orderRes.data.data);
      if (supplierRes.data.success) setSuppliers(supplierRes.data.data);
      if (productRes.data.success) setProducts(productRes.data.data);
    } catch (err) {
      setError("Unable to fetch inward distribution procurement lines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseWorkspaceData();
  }, []);

  const handleProductSelectionChange = (prodId: string) => {
    setSelectedProduct(prodId);
    const matchedProduct = products.find((p) => p._id === prodId);
    if (matchedProduct) {
      setPurchasePrice(matchedProduct.costPrice);
    }
  };

  const handleCreatePurchaseOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !selectedSupplier ||
      !selectedProduct ||
      orderQty < 1 ||
      purchasePrice <= 0
    ) {
      setError(
        "Please input perfect structural parameters inside invoice blocks.",
      );
      return;
    }

    const payload = {
      supplier: selectedSupplier,
      status: "Draft",
      items: [
        {
          product: selectedProduct,
          quantityOrdered: orderQty,
          costPriceAtPurchase: purchasePrice,
        },
      ],
    };

    try {
      const res = await API.post("/purchase-orders", payload);
      if (res.data.success) {
        setSelectedSupplier("");
        setSelectedProduct("");
        setOrderQty(1);
        setPurchasePrice(0);
        setShowForm(false);
        fetchPurchaseWorkspaceData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Transaction submission error.");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    statusText: string,
  ) => {
    try {
      const res = await API.put(`/purchase-orders/${orderId}`, {
        status: statusText,
      });
      if (res.data.success) {
        fetchPurchaseWorkspaceData();
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Status override exception rejected.",
      );
    }
  };

  if (loading)
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
        Populating Inward Logistics Invoices Streams...
      </div>
    );

  return (
    <div className="purchase-view-master-wrapper">
      <div className="purchase-view-action-header-bar">
        <div>
          <h2>Procurement & Purchase Orders</h2>
          <p>
            Draft incoming warehouse shipments audit supplier intake costs flow
          </p>
        </div>
        <button
          className="primary-action-draft-po-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Control Box" : "＋ Draft Purchase Order"}
        </button>
      </div>

      {error && <div className="purchase-error-alert-banner">{error}</div>}

      {/* 🚀 TOGGLE BOX PROCUREMENT FORM CONTROL LINES */}
      {showForm && (
        <div className="purchase-dedicated-toggle-form-box">
          <h4>📥 Draft New Vendor Procurement Contract Block</h4>
          <form
            onSubmit={handleCreatePurchaseOrder}
            className="purchase-form-grid-element"
          >
            <div className="purchase-form-input-tile">
              <label>Authorized Supplier Vendor</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                required
              >
                <option value="">Select registered trade supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="purchase-form-input-tile">
              <label>Target Inventory Item</label>
              <select
                value={selectedProduct}
                onChange={(e) => handleProductSelectionChange(e.target.value)}
                required
              >
                <option value="">Select inventory target</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (SKU: {p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="purchase-form-input-tile">
              <label>Intake Order Quantity</label>
              <input
                type="number"
                min="1"
                value={orderQty}
                onChange={(e) => setOrderQty(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="purchase-form-input-tile">
              <label>Negotiated Cost Price (\$)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="purchase-form-submit-buttons-strip">
              <button
                type="button"
                className="purchase-form-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Dismiss
              </button>
              <button type="submit" className="purchase-form-save-btn">
                Generate Purchase Sheet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📊 CORE PROCUREMENT LEDGER GRID VIEWS */}
      <div className="purchase-table-viewport-panel-card">
        <table className="purchase-custom-data-grid-table">
          <thead>
            <tr>
              <th>Order ID / Date</th>
              <th>Supplier Node</th>
              <th>Requested Manifest Items</th>
              <th>Total Cost Bill</th>
              <th>Current Shipment Status</th>
              <th style={{ textAlign: "right" }}>Logistics State Controls</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td>
                  <span className="purchase-vendor-name-badge">
                    {order.supplier ? order.supplier.name : "Unknown Vendor"}
                  </span>
                </td>
                <td>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="purchase-inline-item-specifications"
                    >
                      <strong>
                        {item.product ? item.product.name : "Purged Item"}
                      </strong>
                      <span>
                        ({item.quantityOrdered} Units × \$
                        {item.costPriceAtPurchase})
                      </span>
                    </div>
                  ))}
                </td>
                <td>
                  <strong>\${order.totalAmount.toFixed(2)}</strong>
                </td>
                <td>
                  <span
                    className={`purchase-status-badge ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {order.status === "Draft" && (
                    <div className="purchase-workflow-actions-cluster">
                      <button
                        className="po-action-link-send-btn"
                        onClick={() =>
                          handleUpdateOrderStatus(order._id, "Sent")
                        }
                      >
                        Dispatch Vendor PO
                      </button>
                    </div>
                  )}
                  {order.status === "Sent" && (
                    <div className="purchase-workflow-actions-cluster">
                      <button
                        className="po-action-link-receive-btn"
                        onClick={() =>
                          handleUpdateOrderStatus(order._id, "Received")
                        }
                      >
                        Mark Stock Received
                      </button>
                    </div>
                  )}
                  {(order.status === "Received" ||
                    order.status === "Cancelled") && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      Archived Transaction
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;
