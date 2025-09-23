import React, { useState, useRef, useEffect } from "react";

function TopBar({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        height: 48,
        background: "#007bff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 4px #0001",
        marginBottom: 16,
      }}
    >
      <span style={{ fontWeight: "bold", fontSize: 18 }}>
        Todo List
      </span>
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <span
          style={{
            marginRight: 12,
            fontWeight: 500
          }}
        >
          {username}
        </span>
        {/* UserIcon as a circle with initials */}
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#fff",
            color: "#007bff",
            textAlign: "center",
            lineHeight: "32px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "inline-block",
            userSelect: "none",
          }}
          onClick={() => setOpen((x) => !x)}
        >
          {username && username[0]?.toUpperCase()}
        </span>
        {/* Dropdown */}
        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40px",
              background: "#fff",
              color: "#222",
              border: "1px solid #e0e0e0",
              minWidth: 120,
              borderRadius: 6,
              boxShadow: "0 2px 8px #0002",
              zIndex: 999
            }}
          >
            <button
              onClick={onLogout}
              style={{
                padding: "10px 16px",
                border: "none",
                background: "none",
                width: "100%",
                cursor: "pointer",
                borderRadius: 6,
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;