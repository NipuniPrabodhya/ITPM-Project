import React from "react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", confirmColor = "var(--error-color)" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "420px", textAlign: "center", padding: "40px 30px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⚠️</div>
        <h3 style={{ marginTop: 0, color: "var(--text-primary)", fontSize: "1.4rem" }}>{title}</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "30px", lineHeight: "1.5" }}>{message}</p>
        
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button 
            onClick={onCancel} 
            style={{ 
              flex: 1, 
              padding: "12px", 
              background: "var(--bg-tertiary)", 
              border: "1px solid var(--border-color)", 
              color: "var(--text-primary)", 
              borderRadius: "8px", 
              fontWeight: "600", 
              cursor: "pointer",
              transition: "0.2s"
            }}
            onMouseOver={e=>e.currentTarget.style.background="var(--border-color)"}
            onMouseOut={e=>e.currentTarget.style.background="var(--bg-tertiary)"}
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm} 
            style={{ 
              flex: 1, 
              padding: "12px", 
              background: confirmColor, 
              border: "none", 
              color: "white", 
              borderRadius: "8px", 
              fontWeight: "600", 
              cursor: "pointer",
              transition: "0.2s transform",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
            onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"}
            onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
