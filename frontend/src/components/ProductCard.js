import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { useNotification } from "../App";
import { useCart } from "../App";
import SellerInfoModal from "./SellerInfoModal";
import { productAPI } from "../services/api";

export default function ProductCard({ product, user }) {
  const { showToast } = useNotification();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleBuy = async () => {
    if (!user) return showToast("Please login to buy items", "error");
    if (product.sold) return showToast("Item already sold", "error");
    
    setLoadingAction(true);
    try {
      await productAPI.toggleCart(product._id);
      showToast(product.inCart ? "Removed from cart" : "Added to cart successfully!");
      refreshCartCount();
      window.location.reload();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update cart", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  const executeDelete = async () => {
    setLoadingAction(true);
    try {
      await productAPI.deleteProduct(product._id);
      setIsDeleteModalOpen(false);
      showToast("Product deleted successfully");
      window.location.reload();
    } catch (error) {
      showToast("Failed to delete product", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteClick = () => {
    if (!user) return showToast("Unauthorized", "error");
    if (user.role === "admin" || product.owner === user.username) {
      setIsDeleteModalOpen(true);
    } else {
      showToast("Cannot delete this product", "error");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-product/${product._id}`);
  };

  return (
    <div className={`card ${product.top ? "highlight" : ""}`} style={{
      width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 0, overflow: "hidden", border: "1px solid var(--border-color)", borderRadius: "12px", background: "var(--bg-secondary)"
    }}>
      {/* Product Image Header */}
      <div style={{ width: "100%", height: "180px", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid var(--border-color)", overflow: "hidden" }}>
        {product.image ? (
          <img src={product.image} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "4rem" }}>🏷️</span>
        )}
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <p style={{ margin: "0 0 5px 0", color: "var(--accent-primary)", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>{product.category}</p>
        <h3 style={{ margin: "0 0 10px 0", color: "var(--text-primary)", fontSize: "1.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.title}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: "0 0 15px 0", flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--accent-primary)" }}>Rs. {product.price.toLocaleString()}</span>
          <span className={`badge ${product.sold ? "badge-error" : "badge-success"}`} style={{ fontSize: "0.75rem" }}>
            {product.sold ? "Sold Out" : "Available"}
          </span>
        </div>
        
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 20px 0" }}>
          Seller: <strong 
            style={{ color: "var(--accent-primary)", cursor: "pointer", textDecoration: "underline" }} 
            onClick={() => setIsSellerModalOpen(true)}
          >
            {product.owner}
          </strong>
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "auto" }}>
          <Link to={`/product/${product._id}`} style={{ flexGrow: 1, textDecoration: "none" }}>
            <button className="btn-primary" style={{ width: "100%", padding: "8px 0", fontSize: "0.9rem" }} disabled={loadingAction}>View Details</button>
          </Link>

          {user && user.role === "student" && product.owner === user.username && (
            <div style={{ display: "flex", width: "100%", gap: "8px", marginTop: "8px" }}>
              <button onClick={handleEdit} style={{ flexGrow: 1, background: "var(--warning-color)", color: "white", padding: "8px 0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", transition: "0.2s opacity" }} onMouseOver={e=>e.target.style.opacity=0.8} onMouseOut={e=>e.target.style.opacity=1}>Edit</button>
              <button onClick={handleDeleteClick} style={{ flexGrow: 1, background: "var(--error-color)", color: "white", padding: "8px 0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", transition: "0.2s opacity" }} onMouseOver={e=>e.target.style.opacity=0.8} onMouseOut={e=>e.target.style.opacity=1}>Delete</button>
            </div>
          )}

          {user && user.role === "admin" && (
            <button onClick={handleDeleteClick} style={{ width: "100%", background: "var(--error-color)", color: "white", padding: "8px 0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", marginTop: "8px", transition: "0.2s opacity" }} onMouseOver={e=>e.target.style.opacity=0.8} onMouseOut={e=>e.target.style.opacity=1}>Admin Delete</button>
          )}

          {user && user.role === "student" && product.owner !== user.username && !product.sold && (
            <button onClick={handleBuy} style={{ width: "100%", background: "var(--success-color)", color: "white", padding: "8px 0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", marginTop: "8px", transition: "0.2s opacity" }} onMouseOver={e=>e.target.style.opacity=0.8} onMouseOut={e=>e.target.style.opacity=1}>Add to Cart</button>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        onConfirm={executeDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Confirm Delete"
      />

      <SellerInfoModal 
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        username={product.owner}
        buyerUsername={user?.username}
      />
    </div>
  );
}

// import { Link } from "react-router-dom";

// export default function ProductCard({ product, user }) {
//   return (
//     <div className={`card ${product.top ? "highlight" : ""}`}>
//       <h3>{product.title}</h3>
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       <p>Seller: {product.owner}</p>
//       <p>Status: {product.sold ? "Sold" : "Available"}</p>
//       <Link to={`/product/${product.id}`}><button style={{ background: "#4f46e5", color: "white", padding: "4px 10px", marginTop: 5 }}>View</button></Link>
//     </div>
//   );
// }