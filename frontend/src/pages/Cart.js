import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../App";
import { useCart } from "../App";
import { productAPI } from "../services/api";

export default function Cart({ user }) {
  const { showToast } = useNotification();
  const { refreshCartCount } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1); // 1: View Cart, 2: Checkout
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [slipImage, setSlipImage] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await productAPI.getProducts();
      const allProducts = response.data;
      setCartItems(allProducts.filter(p => p.inCart && p.cartOwner === user.username));
      setPurchasedItems(allProducts.filter(p => p.sold && p.buyer === user.username));
    } catch (error) {
      console.error("Failed to fetch cart data", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleRemove = async (id) => {
    try {
      await productAPI.toggleCart(id);
      showToast("Item removed from cart", "info");
      fetchData();
      refreshCartCount();
    } catch (error) {
      showToast("Failed to remove item", "error");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizePurchase = async () => {
    setIsProcessing(true);
    try {
      const productIds = cartItems.map(item => item._id);
      await productAPI.checkout(productIds);
      
      showToast("Payment Successful! Your order is being processed.");
      fetchData();
      refreshCartCount();
      setStep(1);
    } catch (error) {
      showToast(error.response?.data?.message || "Payment failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Loading Cart...</p>;

  const EmptyCartView = () => (
    <div style={{ textAlign: "center", padding: "40px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px dashed var(--border-color)", marginBottom: "40px" }}>
      <span style={{ fontSize: "5rem" }}>🛒</span>
      <h2 style={{ color: "var(--text-primary)", marginTop: "20px" }}>Your cart is empty</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>Looks like you haven't added anything to your cart yet.</p>
      <Link to="/view-products">
        <button className="btn-primary" style={{ padding: "12px 30px" }}>Start Shopping</button>
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <h2 style={{ color: "var(--text-primary)", margin: 0 }}>{step === 1 ? "Shopping Cart" : "Checkout"}</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: step >= 1 ? "var(--accent-primary)" : "var(--bg-tertiary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold" }}>1</span>
          <div style={{ width: "40px", height: "2px", background: step >= 2 ? "var(--accent-primary)" : "var(--bg-tertiary)" }}></div>
          <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: step >= 2 ? "var(--accent-primary)" : "var(--bg-tertiary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold" }}>2</span>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-main">
          {cartItems.length > 0 ? (
            step === 1 ? (
              cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div style={{ width: "100px", height: "100px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "2rem" }}>🏷️</span>
                    )}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h3 style={{ margin: "0 0 5px 0", color: "var(--text-primary)" }}>{item.title}</h3>
                      <span style={{ fontWeight: "bold", color: "var(--accent-primary)", fontSize: "1.1rem" }}>Rs. {item.price.toLocaleString()}</span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 15px 0" }}>Seller: {item.owner}</p>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <Link to={`/product/${item._id}`} style={{ textDecoration: "none", color: "var(--accent-primary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "5px" }}>
                        <span>👁️</span> View Details
                      </Link>
                      <button 
                        onClick={() => handleRemove(item._id)}
                        style={{ background: "transparent", border: "none", color: "var(--error-color)", cursor: "pointer", padding: 0, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "5px" }}
                      >
                        <span>🗑️</span> Remove Item
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ padding: "30px" }}>
                {/* ... existing payment method selection and forms ... */}
                <h3 style={{ marginBottom: "20px", color: "var(--text-primary)" }}>Select Payment Method</h3>
                
                <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                  <div 
                    className={`payment-option ${paymentMethod === "card" ? "active" : ""}`} 
                    onClick={() => setPaymentMethod("card")}
                    style={{ flex: 1 }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>💳</span>
                    <div>
                      <strong style={{ display: "block", color: "var(--text-primary)" }}>Credit/Debit Card</strong>
                      <small style={{ color: "var(--text-secondary)" }}>Instant verification</small>
                    </div>
                  </div>
                  
                  <div 
                    className={`payment-option ${paymentMethod === "slip" ? "active" : ""}`} 
                    onClick={() => setPaymentMethod("slip")}
                    style={{ flex: 1 }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🏦</span>
                    <div>
                      <strong style={{ display: "block", color: "var(--text-primary)" }}>Bank Transfer</strong>
                      <small style={{ color: "var(--text-secondary)" }}>Upload payment slip</small>
                    </div>
                  </div>
                </div>

                {paymentMethod === "card" ? (
                  <div style={{ animation: "fadeIn 0.3s ease" }}>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input 
                        className="form-input" 
                        placeholder="XXXX XXXX XXXX XXXX" 
                        value={cardData.number}
                        onChange={e => setCardData({...cardData, number: e.target.value})}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Expiry Date</label>
                        <input 
                          className="form-input" 
                          placeholder="MM/YY" 
                          value={cardData.expiry}
                          onChange={e => setCardData({...cardData, expiry: e.target.value})}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">CVV</label>
                        <input 
                          className="form-input" 
                          placeholder="123" 
                          value={cardData.cvv}
                          onChange={e => setCardData({...cardData, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ animation: "fadeIn 0.3s ease" }}>
                    <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 10px 0", color: "var(--text-primary)" }}>Bank Details</h4>
                      <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Bank: UniNexus Federal Bank</p>
                      <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Account: 1000 2345 6789</p>
                      <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Branch: Campus Core</p>
                    </div>

                    <div className="slip-dropzone" onClick={() => document.getElementById("slip-input").click()}>
                      <input 
                        type="file" 
                        id="slip-input" 
                        hidden 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                      {slipImage ? (
                        <div>
                          <img src={slipImage} alt="slip" className="slip-preview" />
                          <p style={{ color: "var(--accent-primary)", marginTop: "10px", fontSize: "0.9rem" }}>Slip Uploaded! Click to change.</p>
                        </div>
                      ) : (
                        <>
                          <span style={{ fontSize: "2.5rem" }}>📄</span>
                          <p style={{ color: "var(--text-primary)", fontWeight: "600", marginTop: "10px" }}>Click to upload payment slip</p>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>JPG, PNG or PDF accepted</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <EmptyCartView />
          )}

          {purchasedItems.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3 style={{ color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📦</span> Your Purchase History
              </h3>
              <div style={{ display: "grid", gap: "15px" }}>
                {purchasedItems.map(item => (
                  <div key={item._id} className="cart-item" style={{ opacity: 0.9 }}>
                    <div style={{ width: "80px", height: "80px", background: "rgba(0,0,0,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "1.5rem" }}>🏷️</span>
                      )}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h4 style={{ margin: "0 0 5px 0", color: "var(--text-primary)" }}>{item.title}</h4>
                        <span style={{ fontWeight: "bold", color: "var(--text-secondary)" }}>Rs. {item.price.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", margin: 0 }}>Date: {item.purchaseDate}</p>
                        <Link to={`/product/${item._id}`} style={{ textDecoration: "none", color: "var(--accent-primary)", fontSize: "0.8rem", fontWeight: "600" }}>
                          View Again
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="cart-sidebar">
          {/* ... existing sidebar card ... */}
          <div className="summary-card">
            <h3 style={{ margin: "0 0 20px 0", color: "var(--text-primary)" }}>Order Summary</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--text-secondary)" }}>
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--text-secondary)" }}>
              <span>Service Fee (5%)</span>
              <span>Rs. {tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            <div style={{ height: "1px", background: "var(--border-color)", margin: "15px 0" }}></div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: "bold" }}>
              <span>Total</span>
              <span style={{ color: "var(--accent-primary)" }}>Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {step === 1 ? (
              <button 
                className="btn-primary" 
                style={{ width: "100%", padding: "15px" }}
                onClick={() => {
                  if (cartItems.length > 0) setStep(2);
                  else showToast("Please add items to cart first", "warning");
                }}
              >
                Proceed to Checkout
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button 
                  className="btn-primary" 
                  style={{ width: "100%", padding: "15px", position: "relative" }}
                  onClick={finalizePurchase}
                  disabled={isProcessing || (paymentMethod === "slip" && !slipImage)}
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </button>
                <button 
                  style={{ background: "transparent", color: "var(--text-secondary)", border: "none", cursor: "pointer", fontSize: "0.9rem" }}
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  Back to Cart
                </button>
              </div>
            )}

            <div style={{ marginTop: "25px", display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
              <span>🔒</span>
              <span>Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}