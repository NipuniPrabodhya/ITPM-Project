import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNotification } from "../App";
import { productAPI } from "../services/api";

export default function EditProduct({ user }) {
  const { showToast } = useNotification();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Other");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [owner, setOwner] = useState("");

  const categories = ['Electronics', 'Education', 'Fashion', 'Home & Living', 'Other'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProduct(id);
        const p = response.data;
        setTitle(p.title);
        setDescription(p.description);
        setPrice(p.price);
        setCategory(p.category || "Other");
        setDetails(p.details || "");
        setImage(p.image);
        setOwner(p.owner);
      } catch (err) {
        showToast("Error loading product", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, showToast]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Loading Item Data...</p>;

  if (user.role !== "admin" && owner !== user.username) return <p style={{ textAlign: "center", marginTop: "50px", color: "var(--text-primary)" }}>Access Denied</p>;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !description || !price) return setError("Title, Description, and Price are required.");
    if (title.length < 5) return setError("Title must be at least 5 characters.");
    if (description.length < 10) return setError("Description must be at least 10 characters.");
    if (isNaN(price) || Number(price) <= 0) return setError("Price must be a valid positive number.");
    if (!image) return setError("Please upload an image of the item.");
    
    setUpdating(true);
    setError("");

    try {
      await productAPI.updateProduct(id, {
        title,
        description,
        price: Number(price),
        category,
        details,
        image
      });
      showToast("Listing updated successfully!");
      navigate(`/product/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container" style={{ maxWidth: 550 }}>
        <h2 className="auth-title">Edit Listing</h2>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleUpdate}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            {image ? (
              <img src={image} alt="Product" style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "10px" }} />
            ) : (
              <div style={{ width: "140px", height: "140px", borderRadius: "12px", border: "2px dashed var(--border-color)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2.5rem", marginBottom: "10px" }}>
                📸
              </div>
            )}
            <label className="profile-img-label" htmlFor="product-upload">
              Update Photo
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
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea 
              className={`form-input ${error && !description ? 'error' : ''}`}
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
              value={price} 
              onChange={e => setPrice(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Details (Optional)</label>
            <textarea 
              className="form-input"
              value={details} 
              onChange={e => setDetails(e.target.value)} 
              rows={2}
            />
          </div>
          
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>Save Changes</button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary" style={{ flexGrow: 1 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}



// import { useParams, useNavigate } from "react-router-dom";
// import { products } from "../data/products";
// import { useState } from "react";

// export default function EditProduct({ user }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const product = products.find(p => p.id === Number(id));

//   const [title, setTitle] = useState(product?.title || "");
//   const [description, setDescription] = useState(product?.description || "");
//   const [price, setPrice] = useState(product?.price || "");
//   const [details, setDetails] = useState(product?.details || "");

//   if (!product || (user.role !== "admin" && product.owner !== user.username)) return <p>Access Denied</p>;

//   const handleUpdate = () => {
//     if (!title || !description || !price) return alert("Title, Description, and Price are required");
//     if (isNaN(price)) return alert("Price must be a number");

//     product.title = title;
//     product.description = description;
//     product.price = Number(price);
//     product.details = details;

//     alert("Product updated successfully");
//     navigate("/view-products");
//   };

//   const inputStyle = field => ({
//     border: field ? "1px solid #ddd" : "1px solid red",
//     marginBottom: 10,
//     padding: 6,
//     borderRadius: 4,
//     width: "100%"
//   });

//   return (
//     <div style={{ maxWidth: 500, margin: "30px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Edit Product</h2>
//       <input
//         placeholder="Title"
//         value={title}
//         onChange={e => setTitle(e.target.value)}
//         style={inputStyle(title)}
//       />
//       <textarea
//         placeholder="Description"
//         value={description}
//         onChange={e => setDescription(e.target.value)}
//         style={inputStyle(description)}
//       />
//       <input
//         placeholder="Price"
//         value={price}
//         onChange={e => setPrice(e.target.value)}
//         style={inputStyle(price)}
//       />
//       <textarea
//         placeholder="Additional Details (optional)"
//         value={details}
//         onChange={e => setDetails(e.target.value)}
//         style={{ ...inputStyle(true) }}
//       />
//       <button
//         style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }}
//         onClick={handleUpdate}
//       >
//         Update Product
//       </button>
//     </div>
//   );
// }




// import { useParams, useNavigate } from "react-router-dom";
// import { products } from "../data/products";
// import { useState } from "react";

// export default function EditProduct({ user }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const product = products.find(p => p.id === Number(id));
//   const [title, setTitle] = useState(product?.title || "");
//   const [description, setDescription] = useState(product?.description || "");
//   const [price, setPrice] = useState(product?.price || "");

//   if (!product || (user.role !== "admin" && product.owner !== user.username)) return <p>Access Denied</p>;

//   const handleUpdate = () => {
//     if (!title || !description || !price) return alert("All fields required");
//     if (isNaN(price)) return alert("Price must be a number");
//     product.title = title;
//     product.description = description;
//     product.price = Number(price);
//     alert("Product updated successfully");
//     navigate("/view-products");
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "30px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Edit Product</h2>
//       <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
//       <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
//       <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
//       <button style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }} onClick={handleUpdate}>Update Product</button>
//     </div>
//   );
// }

// import { useParams, useNavigate } from "react-router-dom";
// import { products } from "../data/products";
// import { useState } from "react";

// export default function EditProduct({ user }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const product = products.find(p => p.id === Number(id));
//   const [title, setTitle] = useState(product.title);
//   const [description, setDescription] = useState(product.description);
//   const [price, setPrice] = useState(product.price);

//   if (!product || product.owner !== user.username) return <p>Access Denied</p>;

//   const handleUpdate = () => {
//     if (!title || !description || !price) return alert("All fields required");
//     if (isNaN(price)) return alert("Price must be a number");
//     product.title = title;
//     product.description = description;
//     product.price = Number(price);
//     alert("Product updated successfully");
//     navigate("/view-products");
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "30px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Edit Product</h2>
//       <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
//       <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
//       <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
//       <button style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }} onClick={handleUpdate}>Update Product</button>
//     </div>
//   );
// }