import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../App";
import { authAPI } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) return setError("Please fill in all fields");
    if (password !== confirmPassword) return setError("Passwords do not match");
    
    // Applying the same password rule as registration
    if (password.length < 8) return setError("Password must be at least 8 characters");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password))
      return setError("Password must include lowercase, uppercase, number, and special character");

    setLoading(true);
    setError("");

    try {
      await authAPI.resetPassword(token, password);
      showToast("Password reset successfully! Please login.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Reset Password</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "20px", fontSize: "0.9rem" }}>
          Enter your new password below.
        </p>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="password-wrapper">
              <input 
                className="form-input" 
                type={showPassword ? "text" : "password"}
                placeholder="New strong password" 
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
            <label className="form-label">Confirm New Password</label>
            <input 
              className="form-input" 
              type="password"
              placeholder="Confirm new password" 
              value={confirmPassword} 
              onChange={e => {setConfirmPassword(e.target.value); setError("");}} 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
