import { useState, useEffect, useRef } from "react";
import { Conversacion, MensajeUI } from "../../services/chat/types";

interface VentanaChatProps {
  mensajes: MensajeUI[];
  conversacion: Conversacion | undefined;
  cargando: boolean;
  onEnviar: (mensaje: string) => Promise<void>;
  onVolver?: () => void;
}

const VentanaChat:React.FC<VentanaChatProps> = ({ mensajes, conversacion, cargando, onEnviar, onVolver }) => {
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const formatearFecha = (fecha: Date) => {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (fecha.toDateString() === hoy.toDateString()) {
      return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } else if (fecha.toDateString() === ayer.toDateString()) {
      return "Ayer";
    } else {
      return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    }
  };

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim() || enviando) return;

    setEnviando(true);
    try {
      await onEnviar(nuevoMensaje);
      setNuevoMensaje("");
    } catch (err) {
      console.error("Error al enviar:", err);
      alert("Error al enviar mensaje");
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  if (!conversacion) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center", color: "#999" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
          <h5>Selecciona una conversación</h5>
          <p>Elige un chat de la lista para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#e5ddd5" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
        }}
      >
        {onVolver && (
          <button
            onClick={onVolver}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              marginRight: "12px",
            }}
          >
            ←
          </button>
        )}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#4caf50",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
            fontWeight: "bold",
          }}
        >
          {conversacion.nombreOtraPersona.charAt(0).toUpperCase()}
        </div>
        <div>
          <h6 style={{ margin: 0 }}>{conversacion.nombreOtraPersona}</h6>
          <small style={{ color: "#666" }}>📍 {conversacion.tituloPublicacion}</small>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {cargando ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "24px" }}>⏳</div>
            <p>Cargando...</p>
          </div>
        ) : mensajes.length === 0 ? (
          <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>
            <small>No hay mensajes aún. ¡Inicia la conversación! 👋</small>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.esPropio ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    maxWidth: "65%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: msg.esPropio ? "#dcf8c6" : "white",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ fontSize: "14px", marginBottom: "4px" }}>{msg.contenido}</div>
                  <div style={{ textAlign: "right" }}>
                    <small style={{ fontSize: "11px", color: "#666" }}>
                      {formatearFecha(msg.fechaEnvio)}
                      {msg.esPropio && (
                        <span style={{ marginLeft: "4px", color: msg.leido ? "#4caf50" : "#999" }}>
                          ✓✓
                        </span>
                      )}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "12px", backgroundColor: "white", borderTop: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Escribe un mensaje"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={enviando}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: "24px",
              outline: "none",
            }}
          />
          <button
            onClick={handleEnviar}
            disabled={enviando || !nuevoMensaje.trim()}
            style={{
              padding: "10px 20px",
              backgroundColor: enviando || !nuevoMensaje.trim() ? "#ccc" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "24px",
              cursor: enviando || !nuevoMensaje.trim() ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {enviando ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentanaChat;