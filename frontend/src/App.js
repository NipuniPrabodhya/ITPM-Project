import React, { createContext, useContext, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import ViewProducts from "./pages/ViewProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { productAPI } from "./services/api";

// Create Notification Context
const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

// Create Cart Context
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function App() {
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [isInitializing, setIsInitializing] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  React.useEffect(() => {
    setIsInitializing(false);
  }, []);

  const refreshCartCount = useCallback((currentUser) => {
    const activeUser = currentUser || user;
    if (activeUser && activeUser.role === "student") {
      productAPI.getProducts()
        .then(res => {
          const count = res.data.filter(p => p.inCart && p.cartOwner === activeUser.username).length;
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [user]);

  // Fetch cart count when user logs in or changes
  React.useEffect(() => {
    refreshCartCount();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    localStorage.removeItem("user");
    setCartCount(0);
    setUser(null);
  };

  const handleSetUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUser(userData);
    if (!userData) setCartCount(0);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      <CartContext.Provider value={{ cartCount, refreshCartCount }}>
        <Router>
          <div className="app-container">
            <Navbar user={user} logout={logout} />

            <div className="main-content">
              {!isInitializing && (
                <Routes>
                  <Route path="/" element={<Home user={user} />} />
                  <Route path="/login" element={<Login setUser={handleSetUser} />} />
                  <Route path="/register" element={<Register setUser={handleSetUser} />} />
                  <Route path="/profile" element={<Profile user={user} setUser={handleSetUser} />} />
                  <Route path="/user-management" element={user && user.role === "admin" ? <UserManagement user={user} /> : <Navigate to="/" />} />
                  <Route path="/view-products" element={<ViewProducts user={user} />} />
                  <Route path="/add-product" element={<AddProduct user={user} />} />
                  <Route path="/edit-product/:id" element={<EditProduct user={user} />} />
                  <Route path="/cart" element={<Cart user={user} />} />
                  <Route path="/product/:id" element={<ProductDetails user={user} />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
              )}
              {isInitializing && <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Initializing system...</p>}
            </div>

            <Chatbot user={user} />
            <Footer />
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ message: "", type: "success" })}
            />
          </div>
        </Router>
      </CartContext.Provider>
    </NotificationContext.Provider>
  );
}



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import UserManagement from "./pages/UserManagement";
// import ViewProducts from "./pages/ViewProducts";
// import AddProduct from "./pages/AddProduct";

// export default function App() {
//   const [user, setUser] = React.useState(null);

//   const logout = () => setUser(null);

//   return (
//     <Router>
//       <Navbar user={user} logout={logout} />

//       <Routes>
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/register" element={<Register setUser={setUser} />} />

//         {/* ADD THESE 👇 */}
//         <Route path="/profile" element={<Profile user={user} />} />
//         <Route path="/user-management" element={<UserManagement />} />
//         <Route path="/view-products" element={<ViewProducts />} />
//         <Route path="/add-product" element={<AddProduct />} />
//       </Routes>
//     </Router>
//   );
// }

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import UserManagement from "./pages/UserManagement";
// import ViewProducts from "./pages/ViewProducts";
// import AddProduct from "./pages/AddProduct";
// import ProductDetails from "./pages/ProductDetails";
// import EditProduct from "./pages/EditProduct";

// export default function App() {
//   const [user, setUser] = React.useState(null);

//   const logout = () => setUser(null);

//   return (
//     <Router>
//       {/* Navbar always visible */}
//       <Navbar user={user} logout={logout} />

//       <Routes>
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/register" element={<Register setUser={setUser} />} />

//         <Route path="/profile" element={user ? <Profile user={user} /> : <Login setUser={setUser} />} />
//         <Route path="/user-management" element={user && user.role === "admin" ? <UserManagement /> : <Home user={user} />} />

//         <Route path="/view-products" element={<ViewProducts user={user} />} />
//         <Route path="/add-product" element={user ? <AddProduct user={user} /> : <Login setUser={setUser} />} />
//         <Route path="/product/:id" element={<ProductDetails user={user} />} />
//         <Route path="/edit-product/:id" element={<EditProduct user={user} />} />
//       </Routes>
//     </Router>
//   );
// }

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import UserManagement from "./pages/UserManagement";
// import ViewProducts from "./pages/ViewProducts";
// import AddProduct from "./pages/AddProduct";
// import ProductDetails from "./pages/ProductDetails";
// import EditProduct from "./pages/EditProduct";

// export default function App() {
//   const [user, setUser] = React.useState(null);

//   const logout = () => setUser(null);

//   return (
//     <Router>
//       {user && <Navbar user={user} logout={logout} />}
//       <Routes>
//         {/* Home is now the default landing page */}
//         <Route path="/" element={<Home user={user} />} />

//         {/* Login and Register pages */}
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/register" element={<Register setUser={setUser} />} />

//         {/* User Profile & Management */}
//         <Route path="/profile" element={user ? <Profile user={user} /> : <Login setUser={setUser} />} />
//         <Route path="/user-management" element={user && user.role === "admin" ? <UserManagement /> : <Home user={user} />} />

//         {/* E-Commerce */}
//         <Route path="/view-products" element={<ViewProducts user={user} />} />
//         <Route path="/add-product" element={user ? <AddProduct user={user} /> : <Login setUser={setUser} />} />
//         <Route path="/product/:id" element={<ProductDetails user={user} />} />
//         <Route path="/edit-product/:id" element={<EditProduct user={user} />} />
//       </Routes>
//     </Router>
//   );
// }




// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import Profile from "./pages/Profile";
// import AddProduct from "./pages/AddProduct";
// import ViewProducts from "./pages/ViewProducts";
// import ProductDetails from "./pages/ProductDetails";
// import EditProduct from "./pages/EditProduct";

// function App() {
//   const [user, setUser] = React.useState(null);

//   if (!user)
//     return (
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login setUser={setUser} />} />
//           <Route path="/register" element={<Register setUser={setUser} />} />
//         </Routes>
//       </Router>
//     );

//   return (
//     <Router>
//       <Navbar user={user} logout={() => setUser(null)} />
//       <Routes>
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/profile" element={<Profile user={user} />} />
//         <Route path="/add-product" element={<AddProduct user={user} />} />
//         <Route path="/view-products" element={<ViewProducts user={user} />} />
//         <Route path="/product/:id" element={<ProductDetails user={user} />} />
//         <Route path="/edit-product/:id" element={<EditProduct user={user} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           classNaimport { useState } from "react";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   const [role, setRole] = useState(null);

//   return (
//     <div>
//       {!role ? <Login setRole={setRole} /> : <Dashboard role={role} />}
//     </div>
//   );
// }

// export default App;me="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
