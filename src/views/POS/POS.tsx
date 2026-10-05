import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import type { Product } from '../../types';
import './POS.css';

interface CartItem {
  product: Product;
  quantitySold: number;
}

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Billing parameters states
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(5); // Default 5% dynamic commercial tax
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'MobileWallet'>('Cash');

  const fetchPOSAvailableStock = async () => {
    try {
      setLoading(true);
      const res = await API.get<{ success: boolean; data: Product[] }>('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      setError('Unable to link cash counter available products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOSAvailableStock();
  }, []);

  const handleAddToCart = (product: Product) => {
    setError('');
    setSuccessMessage('');

    if (product.quantity < 1) {
      setError(`Stock exhausted for ${product.name}. Cannot initialize cart lines.`);
      return;
    }

    const existingCartItem = cart.find(item => item.product._id === product._id);

    if (existingCartItem) {
      if (existingCartItem.quantitySold >= product.quantity) {
        setError(`Insufficient available physical stock limit for ${product.name}.`);
        return;
      }
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantitySold: item.quantitySold + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantitySold: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const handleQuantityCartAdjustment = (productId: string, newQty: number) => {
    setError('');
    const matchedItem = cart.find(item => item.product._id === productId);
    if (!matchedItem) return;

    if (newQty > matchedItem.product.quantity) {
      setError(`Requested volume cross-matches total warehouse limits for ${matchedItem.product.name}.`);
      return;
    }

    if (newQty < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.product._id === productId ? { ...item, quantitySold: newQty } : item
    ));
  };

  // Live financial accounting calculations summary matrix blocks
  const subTotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantitySold), 0);
  const calculatedTax = parseFloat(((subTotal - discount) * (taxRate / 100)).toFixed(2));
  const finalNetTotal = parseFloat((subTotal - discount + calculatedTax).toFixed(2));

  const handleCheckoutPOSInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (cart.length === 0) {
      setError('Billing transaction cart is empty.');
      return;
    }

    const orderPayload = {
      customerName,
      discount,
      taxRate,
      paymentMode,
      items: cart.map(item => ({
        product: item.product._id,
        quantitySold: item.quantitySold
      }))
    };

    try {
      const res = await API.post('/orders', orderPayload);
      if (res.data.success) {
        setSuccessMessage(`POS Sales invoice successfully printed! Bill Total: $${finalNetTotal}`);
        setCart([]);
        setCustomerName('Walk-in Customer');
        setDiscount(0);
        fetchPOSAvailableStock(); // Instantly synchronize physical numbers grid rows displays
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invoice authentication crash.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Mounting Terminal Cash Register Interface Grid Lines...
      </div>
    );
  }

  return (
    <div className="pos-view-master-wrapper">
      <div className="pos-view-action-header-bar">
        <h2>Point of Sale (POS) Cash Terminal Counter</h2>
        <p>Initialize customer billing carts extract real-time inventory deductions logs</p>
      </div>

      {error && <div className="pos-error-alert-banner">{error}</div>}
      {successMessage && <div className="pos-success-alert-banner">{successMessage}</div>}

      <div className="pos-terminal-layout-split-grid">

        {/* LEFT COLUMN: ITEM QUICK-CLICK SELECT TILES */}
        <div className="pos-product-selection-matrix-panel">
          <h4>📦 Available Terminal Catalog Stocks Grid</h4>
          <div className="pos-catalog-cards-responsive-grid">
            {products.map(p => (
              <div
                key={p._id}
                className={`pos-product-tile-card ${p.quantity < 1 ? 'out-of-stock-blur' : ''}`}
                onClick={() => p.quantity > 0 && handleAddToCart(p)}
              >
                <div className="pos-tile-sku-badge"><code>{p.sku}</code></div>
                <h5>{p.name}</h5>
                <div className="pos-tile-pricing-row">
                  <span className="pos-tile-sell-price">${p.sellingPrice.toFixed(2)}</span>
                  <span className={`pos-tile-stock-count ${p.isLowStock ? 'warn' : 'ok'}`}>
                    {p.quantity > 0 ? `${p.quantity} Left` : 'SOLD OUT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CART & INVOICING LEDGER */}
        <div className="pos-billing-invoice-ledger-panel">
          <h4>🛒 Active Sales Transaction Checkout Cart</h4>

          <form onSubmit={handleCheckoutPOSInvoiceSubmit} className="pos-billing-master-form">
            <div className="pos-form-header-inputs-strip">
              <div className="pos-form-input-tile">
                <label>Customer Reference Identity</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              </div>
              <div className="pos-form-input-tile">
                <label>Counter Payment Method</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)}>
                  <option value="Cash">Cash Drawer</option>
                  <option value="Card">Bank Terminal Card</option>
                  <option value="MobileWallet">Corporate Mobile Wallet</option>
                </select>
              </div>
            </div>

            {/* LIVE CART ROWS */}
            <div className="pos-cart-items-scroller-viewport">
              {cart.length === 0 ? (
                <div className="pos-empty-cart-state-notice">
                  ⚡ Terminal Cart is clear. Tap catalog items left grid lines to stack items invoice.
                </div>
              ) : (
                <div className="pos-cart-rows-container">
                  {cart.map(item => (
                    <div key={item.product._id} className="pos-cart-item-row-strip">
                      <div className="pos-cart-item-info">
                        <h6>{item.product.name}</h6>
                        <span>${item.product.sellingPrice.toFixed(2)} each</span>
                      </div>
                      <div className="pos-cart-qty-counter-mechanics">
                        <button type="button" onClick={() => handleQuantityCartAdjustment(item.product._id, item.quantitySold - 1)}>－</button>
                        <input type="number" readOnly value={item.quantitySold} />
                        <button type="button" onClick={() => handleQuantityCartAdjustment(item.product._id, item.quantitySold + 1)}>＋</button>
                      </div>
                      <div className="pos-cart-item-subtotal-price">
                        <strong>${(item.product.sellingPrice * item.quantitySold).toFixed(2)}</strong>
                      </div>
                      <button type="button" className="pos-cart-row-remove-btn" onClick={() => handleRemoveFromCart(item.product._id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAX & BALANCING LEDGER FOOTER */}
            <div className="pos-accounting-ledger-breakdown-box">
              <div className="pos-ledger-math-row">
                <span>Cart Subtotal Volume:</span>
                <strong>${subTotal.toFixed(2)}</strong>
              </div>

              <div className="pos-ledger-inputs-math-row">
                <div className="inline-ledger-input-group">
                  <span>Flat Discount Allowed ($):</span>
                  <input type="number" min="0" max={subTotal} value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="inline-ledger-input-group">
                  <span>Dynamic Tax Rate (%):</span>
                  <input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div className="pos-ledger-math-row dynamic-tax-row">
                <span>Calculated Commercial Tax:</span>
                <span>+${calculatedTax.toFixed(2)}</span>
              </div>

              <div className="pos-ledger-math-row net-grand-total-row-highlight">
                <span>Final Payable Amount Due:</span>
                <strong>${finalNetTotal > 0 ? finalNetTotal.toFixed(2) : '0.00'}</strong>
              </div>
            </div>

            <button type="submit" className="pos-master-checkout-submit-btn" disabled={cart.length === 0}>
              🖨️ Commit Sale & Print Invoice Voucher
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default POS;