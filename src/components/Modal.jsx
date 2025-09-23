import React from "react";

export default function Modal({ children, open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.34)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        minWidth: 340,
        maxWidth: 420,
        width: "90vw",
        boxShadow: "0 4px 32px #0003",
        padding: 32,
        position: "relative",
      }}>
        <button 
          style={{
            position: "absolute", top: 8, right: 14,
            background: "none", border: "none", fontSize: 24, fontWeight: "bold", color: "#007bff", cursor: "pointer"
          }}
          onClick={onClose}
          aria-label="Close"
        >×</button>
        {children}
      </div>
    </div>
  );
}