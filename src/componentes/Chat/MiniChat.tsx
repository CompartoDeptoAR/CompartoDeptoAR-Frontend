import { useState } from "react";

export const MiniChat = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [mensaje, setMensaje] = useState("");

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#0d6efd",
          color: "white",
          padding: "10px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Chat</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "10px", height: "120px", overflowY: "auto" }}>
        <small style={{ color: "#666" }}>Escribí un mensaje para iniciar la conversación</small>
      </div>

      <div style={{ padding: "10px", display: "flex", gap: "6px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        <button className="btn btn-primary">Enviar</button>
      </div>
    </div>
  );
};
