import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../App";

export default function Navbar({ user, logout }) {
  const role = user?.role || "guest";
  const { cartCount } = useCart() || { cartCount: 0 };

  const navModules = [
    { name: "Home", path: "/", roles: ["guest", "student", "admin"] },
    { name: "Login", path: "/login", roles: ["guest"] },
    { name: "Register", path: "/register", roles: ["guest"] },
    { name: "My Profile", path: "/profile", roles: ["student", "admin"] },
    { name: "Admin Dashboard", path: "/user-management", roles: ["admin"] },
    { name: "Marketplace", path: "/view-products", roles: ["guest", "student", "admin"] },
    { name: "Create Listing", path: "/add-product", roles: ["student", "admin"] },
    { name: "Manage Orders", path: "/seller-orders", roles: ["student", "admin"] },
  ];

  return (
    <div className="navbar" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 25px",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {navModules
          .filter(m => m.roles.includes(role))
          .map(m => (
            <Link
              key={m.name}
              to={m.path}
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                padding: "6px 10px",
                borderRadius: "5px"
              }}
            >
              {m.name}
            </Link>
          ))}

        {/* My Cart with badge */}
        {role === "student" && (
          <Link
            to="/cart"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              padding: "6px 10px",
              borderRadius: "5px",
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            🛒 My Cart
            {cartCount > 0 && (
              <span style={{
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                fontSize: "0.7rem",
                fontWeight: "bold",
                minWidth: "18px",
                height: "18px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                lineHeight: 1,
                boxShadow: "0 0 6px rgba(239,68,68,0.6)",
                animation: "pulse 1.5s infinite"
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* User Info */}
      <div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user.profileImg ? (
              <img src={user.profileImg} alt="avatar" className="avatar avatar-sm" />
            ) : (
              <div className="avatar avatar-sm">{user.username.charAt(0).toUpperCase()}</div>
            )}
            <span style={{ fontWeight: 600 }}>
              {user.username} <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>({user.role})</span>
            </span>
            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                marginLeft: "10px",
                cursor: "pointer",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                transition: "background 0.2s"
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <span>Guest</span>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}


// import React from "react";
// import { Link } from "react-router-dom";

// export default function Navbar({ user, logout }) {
//   const role = user?.role || "guest";

//   const modules = [
//     { name: "Home", path: "/", roles: ["guest", "student", "admin"] },
//     { name: "Login", path: "/login", roles: ["guest"] },
//     { name: "Register", path: "/register", roles: ["guest"] },
//     { name: "Profile", path: "/profile", roles: ["student", "admin"] },
//     { name: "User Management", path: "/user-management", roles: ["admin"] },
//     { name: "Marketplace", path: "/view-products", roles: ["guest", "student", "admin"] },
//     { name: "Add Product", path: "/add-product", roles: ["student", "admin"] },
//     { name: "Cart", path: "/cart", roles: ["student"] },
//   ];

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "12px 25px",
//       backgroundColor: "#1e3a8a",
//       color: "white",
//       position: "sticky",
//       top: 0,
//       zIndex: 1000
//     }}>
//       <div style={{ display: "flex", gap: "15px" }}>
//         {modules
//           .filter(m => m.roles.includes(role))
//           .map(m => (
//             <Link
//               key={m.name}
//               to={m.path}
//               style={{
//                 textDecoration: "none",
//                 color: "white",
//                 fontWeight: "bold",
//                 padding: "6px 10px",
//                 borderRadius: "5px"
//               }}
//               onMouseOver={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
//               onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
//             >
//               {m.name}
//             </Link>
//           ))}
//       </div>

//       <div>
//         {user ? (
//           <>
//             <span style={{ marginRight: 10 }}>{user.username} ({user.role})</span>
//             <button
//               onClick={logout}
//               style={{ backgroundColor: "white", color: "#1e3a8a", padding: "5px 10px", borderRadius: "5px" }}
//             >
//               Logout
//             </button>
//           </>
//         ) : <span>Guest</span>}
//       </div>
//     </div>
//   );
// }



// import React from "react";
// import { Link } from "react-router-dom";

// export default function Navbar({ user, logout }) {
//   const role = user?.role || "guest";

//   const modules = [
//     { name: "Home", path: "/", roles: ["guest", "student", "admin"] },
//     { name: "Login", path: "/login", roles: ["guest"] },
//     { name: "Register", path: "/register", roles: ["guest"] },
//     { name: "Profile", path: "/profile", roles: ["student", "admin"] },
//     { name: "User Management", path: "/user-management", roles: ["admin"] },
//     { name: "Marketplace", path: "/view-products", roles: ["guest", "student", "admin"] },
//     { name: "Add Product", path: "/add-product", roles: ["student", "admin"] },
//   ];

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "12px 25px",
//       backgroundColor: "#1e3a8a",
//       color: "white",
//       position: "sticky",
//       top: 0,
//       zIndex: 1000
//     }}>
      
//       {/* Tabs */}
//       <div style={{ display: "flex", gap: "15px" }}>
//         {modules
//           .filter(m => m.roles.includes(role))
//           .map(m => (
//             <Link
//               key={m.name}
//               to={m.path}
//               style={{
//                 textDecoration: "none",
//                 color: "white",
//                 fontWeight: "bold",
//                 padding: "6px 10px",
//                 borderRadius: "5px"
//               }}
//               onMouseOver={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
//               onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
//             >
//               {m.name}
//             </Link>
//           ))}
//       </div>

//       {/* User Info */}
//       <div>
//         {user ? (
//           <>
//             <span style={{ marginRight: 10 }}>
//               {user.username} ({user.role})
//             </span>
//             <button onClick={logout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <span>Guest</span>
//         )}
//       </div>
//     </div>
//   );
// }