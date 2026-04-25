import ProductCard from "../components/ProductCard";
import { useState, useEffect, useCallback } from "react";
import { productAPI } from "../services/api";

export default function ViewProducts({ user }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const params = { 
        sort: sortOrder, 
        category: categoryFilter,
        search: searchQuery
      };
      const response = await productAPI.getProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [sortOrder, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  // Identify top 3 products by views across the whole dataset
  useEffect(() => {
    if (products.length > 0) {
      const sortedByViews = [...products].sort((a, b) => (b.views || 0) - (a.views || 0));
      const top3Ids = sortedByViews.slice(0, 3).map(p => p._id);
      
      setProducts(prev => prev.map(p => ({
        ...p,
        top: top3Ids.includes(p._id) && (p.views || 0) > 0
      })));
    }
  }, [products.length]); // Only run when product count changes (initial fetch)

  const filteredProducts = products.filter(p => {
    const matchesAvailability = availabilityFilter === "all" || 
                                (availabilityFilter === "available" && !p.sold) || 
                                (availabilityFilter === "sold" && p.sold);
    return matchesAvailability;
  });

  const isSearching = searchQuery !== "" || availabilityFilter !== "all" || sortOrder !== "" || categoryFilter !== "All";
  const trendingProducts = filteredProducts.filter(p => p.top).sort((a, b) => (b.views || 0) - (a.views || 0));
  const regularProducts = filteredProducts.filter(p => !p.top);

  if (loading) return <div style={{ color: "var(--text-primary)", textAlign: "center", marginTop: "100px", fontSize: "1.2rem" }}>Loading Marketplace...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
      
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1 className="hero-title">UniNexus Marketplace</h1>
        <p className="hero-subtitle">Discover amazing items from the campus community</p>
      </div>
      
      {/* Filters */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap", background: "var(--bg-secondary)", padding: "18px", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
        <input 
          className="form-input" 
          placeholder="Search items by title or description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flexGrow: 1, minWidth: "250px", margin: 0 }}
        />
        <select 
          className="filter-dropdown" 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)} 
          style={{ width: "180px", margin: 0 }}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Education">Education</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Living">Home & Living</option>
          <option value="Other">Other</option>
        </select>
        <select 
          className="filter-dropdown" 
          value={availabilityFilter} 
          onChange={(e) => setAvailabilityFilter(e.target.value)} 
          style={{ width: "160px", margin: 0 }}
        >
          <option value="all">All Items</option>
          <option value="available">Available Only</option>
          <option value="sold">Sold Out</option>
        </select>
        <select 
          className="filter-dropdown" 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)} 
          style={{ width: "200px", margin: 0 }}
        >
          <option value="">Sort By: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="views_desc">Most Popular</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.2)" }}>
          <span style={{ fontSize: "4rem" }}>🔍</span>
          <h3 style={{ color: "var(--text-primary)", marginTop: "20px", fontSize: "1.5rem" }}>No items found!</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Try adjusting your search criteria or filter status.</p>
        </div>
      ) : isSearching ? (
        <div className="product-grid">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} user={user} />)}
        </div>
      ) : (
        <>
          {trendingProducts.length > 0 && (
            <div style={{ marginBottom: "50px" }}>
              <h3 style={{ color: "var(--text-primary)", marginBottom: "25px", display: "flex", alignItems: "center", gap: "12px", fontSize: "1.4rem" }}>
                <span style={{ background: "rgba(99, 102, 241, 0.2)", padding: "8px", borderRadius: "8px" }}>✨</span> 
                Trending Listings
              </h3>
              <div className="product-grid">
                {trendingProducts.map(p => <ProductCard key={p.id} product={p} user={user} />)}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "25px", display: "flex", alignItems: "center", gap: "12px", fontSize: "1.4rem", borderTop: "1px solid var(--border-color)", paddingTop: "40px" }}>
              <span style={{ background: "rgba(255, 255, 255, 0.05)", padding: "8px", borderRadius: "8px" }}>🗄️</span> 
              All Available Items
            </h3>
            <div className="product-grid">
              {regularProducts.map(p => <ProductCard key={p.id} product={p} user={user} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// import { products } from "../data/products";
// import ProductCard from "../components/ProductCard";

// export default function ViewProducts({ user }) {
//   // Sort by views for top 3 highlight
//   const sorted = [...products].sort((a, b) => b.views - a.views);
//   sorted.forEach((p, i) => p.top = i < 3); // top 3

//   return (
//     <div style={{ maxWidth: 1000, margin: "20px auto" }}>
//       <h2>Marketplace</h2>
//       <div style={{ display: "flex", flexWrap: "wrap" }}>
//         {sorted.map(p => (
//           <ProductCard key={p.id} product={p} user={user} />
//         ))}
//       </div>
//     </div>
//   );
// }