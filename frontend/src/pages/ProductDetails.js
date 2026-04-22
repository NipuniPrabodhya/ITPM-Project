import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import ConfirmModal from "../components/ConfirmModal";
import SellerInfoModal from "../components/SellerInfoModal";
import { useNotification } from "../App";
import { productAPI } from "../services/api";

export default function ProductDetails({ user }) {
  const { showToast } = useNotification();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [sellerModal, setSellerModal] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await productAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]);

  const initiateDelete = () => {
    if (!user) return showToast("Login required", "error");
    if (user.role !== "admin" && user.username !== product.owner) return showToast("Access Denied", "error");
    setConfirmModal(true);
  };

  const executeDelete = async () => {
    try {
      await productAPI.deleteProduct(id);
      setConfirmModal(false);
      showToast("Product deleted successfully");
      navigate("/view-products");
    } catch (error) {
      showToast("Failed to delete product", "error");
    }
  };

  const handleAddToCart = async () => {
    if (!user) return showToast("Login required", "error");
    if (product.sold) return showToast("Product already sold", "error");
    
    try {
      await productAPI.toggleCart(id);
      showToast(product.inCart ? "Removed from cart" : "Added to cart successfully!");
      fetchProduct(); // Refresh data
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update cart", "error");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Loading Product Details...</p>;
  if (!product) return <p style={{ textAlign: "center", marginTop: "50px", color: "white" }}>Product not found</p>;

  return (
    <div style={{ maxWidth: 700, margin: "30px auto" }}>
      <button 
        onClick={() => navigate("/view-products")} 
        style={{ 
          background: "var(--bg-tertiary)", 
          color: "var(--text-primary)", 
          border: "1px solid var(--border-color)", 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          fontWeight: "600", 
          fontSize: "0.9rem", 
          marginBottom: "15px", 
          padding: "10px 20px",
          borderRadius: "8px",
          transition: "0.2s all" 
        }}
        onMouseOver={e=>{e.currentTarget.style.background="var(--border-color)"; e.currentTarget.style.boxShadow="0 4px 10px rgba(0,0,0,0.3)"}}
        onMouseOut={e=>{e.currentTarget.style.background="var(--bg-tertiary)"; e.currentTarget.style.boxShadow="none"}}
      >
        <span style={{ fontSize: "1.2rem" }}>🛒</span> Return to Marketplace
      </button>

      <div className="card" style={{ margin: 0, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        {/* Hero Image */}
        <div style={{ width: "100%", height: "350px", background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
          {product.image ? (
            <img src={product.image} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "6rem" }}>🏷️</span>
          )}
        </div>

        <div style={{ padding: "30px" }}>
          <h2 style={{ fontSize: "2rem", margin: "0 0 15px 0", color: "var(--text-primary)" }}>{product.title}</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: "bold", color: "var(--accent-primary)" }}>Rs. {product.price.toLocaleString()}</span>
            <span className={`badge ${product.sold ? "badge-error" : "badge-success"}`} style={{ fontSize: "0.9rem", padding: "6px 12px" }}>
              {product.sold ? "Sold Out" : "Available"}
            </span>
          </div>
          
          <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "var(--text-secondary)", marginBottom: "25px" }}>{product.description}</p>
          
          {product.details && (
            <div style={{ marginBottom: "25px" }}>
              <h4 style={{ color: "var(--text-primary)", marginBottom: "10px", fontSize: "1.1rem" }}>Additional Details</h4>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", background: "var(--bg-tertiary)", padding: "15px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                {product.details}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "25px", borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginBottom: "25px" }}>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>Seller:</strong> 
              <span 
                style={{ marginLeft: '5px', color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setSellerModal(true)}
              >
                {product.owner}
              </span>
            </p>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}><strong style={{ color: "var(--text-primary)" }}>Views:</strong> {product.views}</p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* Student actions */}
            {user && user.role === "student" && user.username !== product.owner && !product.sold && (
              <button
                onClick={handleAddToCart}
                style={{ background: "var(--success-color)", color: "white", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", border: "none", cursor: "pointer" }}
              >
                Add to Cart
              </button>
            )}

            {/* Owner/Admin actions */}
            {user && (user.role === "admin" || user.username === product.owner) && (
              <>
                <button
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                  style={{ background: "var(--warning-color)", color: "white", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", border: "none", cursor: "pointer" }}
                >
                  Edit Listing
                </button>
                <button
                  onClick={initiateDelete}
                  style={{ background: "var(--error-color)", color: "white", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", border: "none", cursor: "pointer" }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal} 
        title="Delete Marketplace Listing" 
        message={`Are you absolutely sure you want to permanently delete the listing for "${product.title}"? This action cannot be undone.`} 
        onConfirm={executeDelete} 
        onCancel={() => setConfirmModal(false)} 
        confirmText="Delete Listing" 
        confirmColor="var(--error-color)"
      />

      <SellerInfoModal 
        isOpen={sellerModal} 
        onClose={() => setSellerModal(false)} 
        username={product.owner} 
        buyerUsername={user?.username}
      />
    </div>
  );
}


// import { useParams, Link } from "react-router-dom";
// import { products } from "../data/products";

// export default function ProductDetails({ user }) {
//   const { id } = useParams();
//   const product = products.find(p => p.id === Number(id));
//   if (!product) return <p>Product not found</p>;

//   product.views += 1; // increment views

//   return (
//     <div style={{ maxWidth: 500, margin: "30px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>{product.title}</h2>
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       <p>Seller: {product.owner}</p>
//       <p>Views: {product.views}</p>
//       {!product.sold && product.owner === user.username && <Link to={`/edit-product/${product.id}`}><button style={{ background: "#facc15", padding: "6px 12px", marginTop: 10 }}>Edit Product</button></Link>}
//     </div>
//   );
// }