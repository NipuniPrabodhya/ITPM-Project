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
      
//       {/* Left side tabs */}
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

//       {/* Right side user info */}
//       <div>
//         {user ? (
//           <>
//             <span style={{ marginRight: 10 }}>
//               {user.username} ({user.role})
//             </span>
//             <button
//               onClick={logout}
//               style={{
//                 backgroundColor: "white",
//                 color: "#1e3a8a",
//                 padding: "5px 10px",
//                 borderRadius: "5px"
//               }}
//             >
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