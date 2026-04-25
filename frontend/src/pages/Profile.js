import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../App";
import { authAPI } from "../services/api";

export default function Profile({ user, setUser }) {
  const { showToast } = useNotification();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState(""); // Don't show hashed password
  const [showPassword, setShowPassword] = useState(false);
  const [profileImg, setProfileImg] = useState(user?.profileImg || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username || !email || !phone) return setError("Basic fields required");
    
    // Email domain validation
    if (!email.endsWith("@my.sliit.lk")) return setError("Email must be @my.sliit.lk");

    // Password validation only if changing
    if (password) {
      if (password.length < 8) return setError("Password must be at least 8 characters");
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(password))
        return setError("Password must include lowercase, uppercase, number, and special character");
    }

    // Phone validation
    if (!/^0\d{9}$/.test(phone))
      return setError("Phone number must start with 0 and be exactly 10 digits");
    
    setLoading(true);
    setError("");

    try {
      const updateData = { username, email, phone, profileImg };
      if (password) updateData.password = password;

      const response = await authAPI.updateProfile(updateData);
      setUser(response.data); // Update global state
      showToast("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const executeDeactivate = async () => {
    try {
      // Admin should be able to deactivate but for self-service we'd need a specific route
      showToast("Deactivation requested. Contact admin for final removal.", "warning");
    } catch (error) {
      showToast("Operation failed", "error");
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">My Profile</h2>
        
        {error && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}
        
        <form onSubmit={handleUpdate}>
          <div className="profile-img-upload">
            {profileImg ? (
              <img src={profileImg} alt="Profile" className="avatar avatar-lg" />
            ) : (
              <div className="avatar avatar-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="profile-img-label" htmlFor="profile-upload">
              Change Picture
            </label>
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              className="profile-img-input" 
              onChange={handleImageUpload} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              className="form-input"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              className="form-input"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              className="form-input"
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="07XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input 
                className="form-input"
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
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
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        
        <div style={{ marginTop: "20px", textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
          <button 
            style={{ background: "transparent", border: "1px solid var(--error-color)", color: "var(--error-color)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }} 
            onClick={() => setIsModalOpen(true)}
          >
            Deactivate Account
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Deactivate Account"
        message="Are you sure you want to deactivate your account? You will no longer be able to log in until an administrator reactivates you."
        onConfirm={executeDeactivate}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Yes, Deactivate"
      />
    </div>
  );
}