import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          border: "1px solid rgba(239, 68, 68, 0.4)",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#f87171",
        };
      case "warning":
        return {
          border: "1px solid rgba(245, 158, 11, 0.4)",
          background: "rgba(245, 158, 11, 0.1)",
          color: "#fbbf24",
        };
      default: // success
        return {
          border: "1px solid rgba(34, 197, 94, 0.4)",
          background: "rgba(34, 197, 94, 0.1)",
          color: "#4ade80",
        };
    }
  };

  const icon = type === "error" ? "❌" : type === "warning" ? "⚠️" : "✅";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        padding: "12px 24px",
        borderRadius: "12px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: "600",
        animation: "toastIn 0.3s ease-out forwards",
        whiteSpace: "nowrap",
        ...getStyles(),
      }}
    >
      <span>{icon}</span>
      <span>{message}</span>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
