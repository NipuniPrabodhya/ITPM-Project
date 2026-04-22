import { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../App";
import { authAPI } from "../services/api";

export default function Register({ setUser }) {
  const { showToast } = useNotification();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !phone) return setError("All fields required");

    if (password.length < 8) return setError("Password must be at least 8 characters");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password))
      return setError("Password must include lowercase, uppercase, number, and special character");
    
    if (!email.endsWith("@my.sliit.lk")) return setError("Email must be @my.sliit.lk");

    if (!/^0\d{9}$/.test(phone))
      return setError("Phone number must start with 0 and be exactly 10 digits");
    
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.register({ username, email, password, phone });
      setUser(response.data);
      showToast("Registered successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Create Account</h2>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleRegister}>
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
            <label className="form-label">Student Email</label>
            <input 
              className={`form-input ${error && !email ? 'error' : ''}`}
              placeholder="e.g. itXXXX@my.sliit.lk" 
              value={email} 
              onChange={e => {setEmail(e.target.value); setError("");}} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input 
                className={`form-input ${error && !password ? 'error' : ''}`}
                placeholder="Strong password" 
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

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              className={`form-input ${error && !phone ? 'error' : ''}`}
              placeholder="e.g. 07XXXXXXXX" 
              value={phone} 
              onChange={e => {setPhone(e.target.value); setError("");}} 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}




// import { useState } from "react";
// import { users } from "../data/users";
// import { useNavigate } from "react-router-dom";

// export default function Register({ setUser }) {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = () => {
//     if (!username || !email || !password) return alert("All fields required");
//     if (!email.endsWith("@uninexus.edu")) return alert("Use university email");
//     const id = users.length + 1;
//     const newUser = { id, username, email, password, role: "student", active: true };
//     users.push(newUser);
//     setUser(newUser);
//     navigate("/");
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
//       <h2>Register</h2>
//       <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
//       <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//       <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
//       <button style={{ background: "#4f46e5", color: "white", padding: "6px 12px", marginTop: 10 }} onClick={handleRegister}>Register</button>
//     </div>
//   );
// }