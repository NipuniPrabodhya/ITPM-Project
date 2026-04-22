import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../App";
import { productAPI } from "../services/api";

export default function AddProduct({ user }) {
  const { showToast } = useNotification();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Other");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Electronics', 'Education', 'Fashion', 'Home & Living', 'Other'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !description || !price) return setError("Title, Description, and Price are required.");
    if (isNaN(price) || Number(price) <= 0) return setError("Price must be a valid positive number.");
    
    setLoading(true);
    setError("");

    try {
      await productAPI.createProduct({
        title,
        description,
        price: Number(price),
        category,
        details,
        image
      });
      showToast("Product listed successfully!");
      navigate("/view-products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container" style={{ maxWidth: 550 }}>
        <h2 className="auth-title">Create Listing</h2>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleAdd}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            {image ? (
              <img src={image} alt="Product" style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "10px" }} />
            ) : (
              <div style={{ width: "140px", height: "140px", borderRadius: "12px", border: "2px dashed var(--border-color)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2.5rem", marginBottom: "10px" }}>
                📸
              </div>
            )}
            <label className="profile-img-label" htmlFor="product-upload">
              Upload Item Photo
            </label>
            <input 
              id="product-upload" 
              type="file" 
              accept="image/*" 
              className="profile-img-input" 
              onChange={handleImageUpload} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Title</label>
            <input 
              className={`form-input ${error && !title ? 'error' : ''}`}
              placeholder="What are you selling?" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea 
              className={`form-input ${error && !description ? 'error' : ''}`}
              placeholder="Briefly describe the item" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="filter-dropdown" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              style={{ width: "100%", margin: 0 }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price (Rs.)</label>
            <input 
              className={`form-input ${error && !price ? 'error' : ''}`}
              placeholder="0.00" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Details (Optional)</label>
            <textarea 
              className="form-input"
              placeholder="Condition, Specs, Delivery methods..." 
              value={details} 
              onChange={e => setDetails(e.target.value)} 
              rows={2}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Posting Listing..." : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { products } from "../data/products";
// import { useNavigate } from "react-router-dom";

// export default function AddProduct({ user }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const navigate = useNavigate();

//   const handleAdd = () => {
//     if (!title || !description || !price) return alert("All fields required");
//     if (isNaN(price)) return alert("Price must be a number");

//     const id = products.length + 1;
//     products.push({ id, title, description, price: Number(price), owner: user.username, views: 0, sold: false, inCart: false, cartOwner: null });
//     alert("Product added successfully");
//     navigate("/view-products");
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "30px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Add Product</h2>
//       <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
//       <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
//       <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
//       <button style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }} onClick={handleAdd}>Add Product</button>
//     </div>
//   );
// }



// import { useState } from "react";
// import { products } from "../data/products";
// import { useNavigate } from "react-router-dom";

// export default function AddProduct({ user }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const navigate = useNavigate();

//   const handleAdd = () => {
//     if (!title || !description || !price) return alert("All fields required");
//     if (isNaN(price)) return alert("Price must be a number");
//     const id = products.length + 1;
//     products.push({ id, title, description, price: Number(price), owner: user.username, views: 0, sold: false });
//     alert("Product added successfully");
//     navigate("/view-products");
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "30px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Add Product</h2>
//       <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
//       <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
//       <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
//       <button style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }} onClick={handleAdd}>Add Product</button>
//     </div>
//   );
// }