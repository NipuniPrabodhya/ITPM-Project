import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../App";
import { authAPI } from "../services/api";

export default function ForgotPassword() {
  const { showToast } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    if (!email.endsWith("@my.sliit.lk")) return setError("Please use your student email (@my.sliit.lk)");

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.forgotPassword(email);
      showToast("Reset link generated!", "success");
      setSent(true);
      // In this demo, we'll show the token since we don't have real email
      console.log("Reset Token:", response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Forgot Password</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "20px", fontSize: "0.9rem" }}>
          Enter your student email and we'll send you instructions to reset your password.
        </p>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student Email</label>
              <input 
                className="form-input" 
                placeholder="itXXXX@my.sliit.lk" 
                value={email} 
                onChange={e => {setEmail(e.target.value); setError("");}} 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", padding: "12px", marginTop: "10px" }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📩</div>
            <h3 style={{ color: "var(--success-color)", marginBottom: "10px" }}>Check Your Email</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <p style={{ color: "var(--accent-primary)", fontSize: "0.8rem", marginTop: "15px", fontStyle: "italic" }}>
              (Note: Since this is a demo, check the browser console for the reset link!)
            </p>
          </div>
        )}
        
        <div className="auth-footer">
          Remembered your password? <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
