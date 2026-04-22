import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../App";
import { authAPI } from "../services/api";

export default function Login({ setUser }) {
  const { showToast } = useNotification();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("All fields required");

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({ username, password });
      setUser(response.data);
      showToast("Signed in successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Welcome Back</h2>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              className={`form-input ${error && !username ? 'error' : ''}`}
              placeholder="Enter your username" 
              value={username} 
              onChange={e => {setUsername(e.target.value); setError("");}} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input 
                className={`form-input ${error && !password ? 'error' : ''}`}
                placeholder="Enter your password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => {setPassword(e.target.value); setError("");}} 
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login to UniNexus"}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}



// import { useState } from "react";
// import { users } from "../data/users";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login({ setUser }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (!username || !password) return alert("All fields required");
//     const found = users.find(u => u.username === username && u.password === password && u.active);
//     if (found) {
//       setUser(found);
//       navigate("/");
//     } else alert("Invalid credentials or inactive account");
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Login</h2>
//       <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
//       <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
//       <button style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }} onClick={handleLogin}>Login</button>
//       <p style={{ marginTop: 10 }}>Don't have an account? <Link to="/register">Register</Link></p>
//     </div>
//   );
// }