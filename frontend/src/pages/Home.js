import React from "react";
import bannerImage from "../assets/HomeImage.png";

export default function Home({ user }) {
  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      
      <div style={{
        padding: "50px 20px",
        backgroundColor: "var(--bg-secondary)"
      }}>
        <h1 style={{ fontSize: "3rem", color: "var(--accent-primary)" }}>
          Welcome to UniNexus Platform
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
          Use the navigation bar above to explore the system
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <img
          src={bannerImage}
          alt="banner"
          style={{
            width: "90%",
            maxWidth: 1000,
            borderRadius: 10
          }}
        />
      </div>
    </div>
  );
}

// import React from "react";
// import { Link } from "react-router-dom";
// import bannerImage from "../assets/HomeImage.png"; // your image

// export default function Home({ user }) {
//   const modules = [
//     { name: "Login", path: "/login", roles: ["guest"] },
//     { name: "Register", path: "/register", roles: ["guest"] },
//     { name: "Profile", path: "/profile", roles: ["student", "admin"] },
//     { name: "User Management", path: "/user-management", roles: ["admin"] },
//     { name: "View Marketplace", path: "/view-products", roles: ["student", "admin", "guest"] },
//     { name: "Add Product", path: "/add-product", roles: ["student", "admin"] },
//   ];

//   const role = user?.role || "guest";

//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       {/* Top horizontal tab bar */}
//       <div
//         style={{
//           display: "flex",
//           padding: "15px 30px",
//           backgroundColor: "#1e3a8a", // dark blue background for tabs
//           justifyContent: "center",
//           gap: "20px",
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         {modules
//           .filter((m) => m.roles.includes(role))
//           .map((m) => (
//             <Link
//               key={m.name}
//               to={m.path}
//               style={{
//                 textDecoration: "none",
//                 color: "white",
//                 fontWeight: "bold",
//                 padding: "8px 15px",
//                 borderRadius: 5,
//                 transition: "background 0.2s",
//               }}
//               onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
//               onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//             >
//               {m.name}
//             </Link>
//           ))}
//       </div>

//       {/* Welcome message */}
//       <div
//         style={{
//           padding: "60px 20px 30px 20px",
//           textAlign: "center",
//           backgroundColor: "#f3f4f6", // light background for readability
//         }}
//       >
//         <h1 style={{ fontSize: "3rem", color: "#1e3a8a" }}>
//           Welcome to UniNexus Platform
//         </h1>
//         <p style={{ fontSize: "1.2rem", color: "#334155", marginTop: "10px" }}>
//           Use the tabs above to navigate through User Management and E-Commerce modules
//         </p>
//       </div>

//       {/* Banner image below welcome message */}
//       <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
//         <img
//           src={bannerImage}
//           alt="UniNexus Banner"
//           style={{
//             width: "90%",
//             maxWidth: 1000,
//             borderRadius: 10,
//             boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// import { Link } from "react-router-dom";

// export default function Home({ user }) {
//   // Define modules
//   const modules = [
//     { name: "Login", path: "/login", color: "#ef4444", roles: ["guest"] },
//     { name: "Register", path: "/register", color: "#f59e0b", roles: ["guest"] },
//     { name: "Profile", path: "/profile", color: "#16a34a", roles: ["student", "admin"] },
//     { name: "User Management", path: "/user-management", color: "#4f46e5", roles: ["admin"] },
//     { name: "View Marketplace", path: "/view-products", color: "#0ea5e9", roles: ["student", "admin", "guest"] },
//     { name: "Add Product", path: "/add-product", color: "#8b5cf6", roles: ["student", "admin"] },
//   ];

//   const role = user?.role || "guest";

//   return (
//     <div style={{ maxWidth: 900, margin: "30px auto", padding: 20, textAlign: "center" }}>
//       <h1 style={{ marginBottom: 30 }}>Welcome to UniNexus Platform</h1>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
//         {modules
//           .filter(m => m.roles.includes(role))
//           .map(m => (
//             <Link key={m.name} to={m.path} style={{ textDecoration: "none" }}>
//               <div
//                 style={{
//                   padding: "20px 30px",
//                   backgroundColor: m.color,
//                   color: "white",
//                   borderRadius: 10,
//                   fontWeight: "bold",
//                   minWidth: 150,
//                   cursor: "pointer",
//                   boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                   transition: "transform 0.2s",
//                 }}
//                 onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
//               >
//                 {m.name}
//               </div>
//             </Link>
//           ))}
//       </div>
//       <p style={{ marginTop: 40, fontStyle: "italic", color: "#555" }}>
//         Use the buttons above to navigate through the UniNexus modules
//       </p>
//     </div>
//   );
// }