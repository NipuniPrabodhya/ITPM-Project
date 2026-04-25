import { useState, useEffect, useCallback } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../App";
import { authAPI } from "../services/api";

export default function UserManagement() {
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [modalData, setModalData] = useState({});
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [modalError, setModalError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, targetUser: null });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError(err.response?.data?.message || "Failed to load admin data. Are you an admin?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && u.active) || 
                          (statusFilter === "inactive" && !u.active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const initiateToggle = (user) => {
    if (user.role === "admin") return showToast("Cannot deactivate admin", "error");
    setConfirmModal({ isOpen: true, targetUser: user });
  };

  const executeToggle = async () => {
    if (confirmModal.targetUser) {
      try {
        await authAPI.toggleUserStatus(confirmModal.targetUser._id);
        const isActivating = !confirmModal.targetUser.active;
        showToast(`${confirmModal.targetUser.username} ${isActivating ? "activated" : "deactivated"} successfully!`);
        fetchUsers();
      } catch (error) {
        showToast("Failed to update status", "error");
      }
    }
    setConfirmModal({ isOpen: false, targetUser: null });
  };

  const togglePassword = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setModalError("");
    // Don't include sensitive fields or fields that shouldn't be sent back as-is
    setModalData({ 
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "" // Clear password field for security
    });
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const { username, email, phone, password } = modalData;

    if (!username || !email || !phone) return setModalError("Username, Email, and Phone are required");
    
    if (!email.endsWith("@my.sliit.lk")) return setModalError("Email must be @my.sliit.lk");

    if (password && password !== "") {
      if (password.length < 8) return setModalError("Password must be at least 8 characters");
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(password))
        return setModalError("Password must include lowercase, uppercase, number, and special character");
    }

    if (!/^0\d{9}$/.test(phone))
      return setModalError("Phone number must start with 0 and be exactly 10 digits");

    try {
      setModalError("");
      await authAPI.adminUserUpdate(editingUser, modalData);
      showToast("User details updated successfully!", "success");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setModalError(error.response?.data?.message || "Failed to save user details");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Loading Admin Dashboard...</p>;

  if (error) return (
    <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
      <h3>Access Denied</h3>
      <p style={{ color: "var(--error-color)" }}>{error}</p>
      <button className="btn-secondary" style={{ marginTop: "20px" }} onClick={() => window.location.href="/"}>Go Back Home</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: "25px", color: "var(--text-primary)" }}>System Administration Dashboard</h2>
      
      {/* Control Panel */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap", background: "var(--bg-secondary)", padding: "15px", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
        <input 
          className="form-input" 
          placeholder="Search Username or Email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flexGrow: 1, minWidth: "200px" }}
        />
        <select 
          className="filter-dropdown" 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)} 
          style={{ width: "150px" }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
        <select 
          className="filter-dropdown" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          style={{ width: "150px" }}
        >
          <option value="all">Any Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Password</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No users found matching filters.</td></tr>
            ) : (
              filteredUsers.map(u => (
              <tr key={u._id} style={{ opacity: u.active ? 1 : 0.6 }}>
                <td><strong title={u._id}>#{u._id.substring(0, 6)}...</strong></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {u.profileImg ? (
                      <img src={u.profileImg} alt="avatar" className="avatar" style={{width: 30, height: 30}} />
                    ) : (
                      <div className="avatar" style={{width: 30, height: 30, fontSize: "0.8rem"}}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {u.username}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone || "N/A"}</td>
                <td>
                  <span className={`password-cell ${revealed[u._id] ? 'revealed' : ''}`}>
                    {revealed[u._id] ? "Hashed Safely" : "••••••••"}
                  </span>
                  <button 
                    onClick={() => togglePassword(u._id)}
                    style={{ marginLeft: 10, background: "transparent", cursor: "pointer", border: "1px solid var(--border-color)", borderRadius: 4, padding: "2px 6px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    {revealed[u._id] ? "Hide" : "Check"}
                  </button>
                </td>
                <td><span className="badge" style={{ background: "var(--accent-primary)", color: "white" }}>{u.role}</span></td>
                <td>
                  <span className={`badge ${u.active ? 'badge-success' : 'badge-error'}`}>
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleEditClick(u)}
                    >
                      Edit
                    </button>
                    <button 
                      style={{ 
                        padding: "6px 12px", 
                        borderRadius: "6px",
                        background: u.active ? "var(--error-color)" : "var(--success-color)",
                        color: "white",
                        border: "none",
                        fontWeight: "bold",
                        cursor: u.role === "admin" ? "not-allowed" : "pointer",
                        opacity: u.role === "admin" ? 0.3 : 1
                      }} 
                      onClick={() => initiateToggle(u)}
                      disabled={u.role === "admin"}
                    >
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title={confirmModal.targetUser?.active ? "Deactivate User" : "Activate User"} 
        message={`Are you sure you want to ${confirmModal.targetUser?.active ? "deactivate" : "activate"} user ${confirmModal.targetUser?.username}?`} 
        onConfirm={executeToggle} 
        onCancel={() => setConfirmModal({ isOpen: false, targetUser: null })} 
        confirmText={confirmModal.targetUser?.active ? "Deactivate" : "Activate"} 
        confirmColor={confirmModal.targetUser?.active ? "var(--error-color)" : "var(--success-color)"}
      />

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="modal-close" onClick={() => setEditingUser(null)}>×</button>
            </div>
            {modalError && <p style={{ color: "var(--error-color)", textAlign: "center", marginBottom: "15px", fontSize: "0.9rem" }}>{modalError}</p>}
            <form onSubmit={handleModalSave}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input 
                  className="form-input" 
                  value={modalData.username || ""} 
                  onChange={(e) => setModalData({...modalData, username: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  className="form-input" 
                  value={modalData.email || ""} 
                  onChange={(e) => setModalData({...modalData, email: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  className="form-input" 
                  value={modalData.phone || ""} 
                  onChange={(e) => setModalData({...modalData, phone: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password (leave blank to keep current)</label>
                <div className="password-wrapper">
                  <input 
                    className="form-input" 
                    type={showModalPassword ? "text" : "password"}
                    value={modalData.password} 
                    onChange={(e) => setModalData({...modalData, password: e.target.value})} 
                    placeholder="Enter new password or leave blank"
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowModalPassword(!showModalPassword)}
                  >
                    {showModalPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select 
                  className="form-input"
                  value={modalData.role || "student"}
                  onChange={(e) => setModalData({...modalData, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "15px" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}