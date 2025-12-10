import { useState, useEffect, useRef } from "react";
import { Conversacion, MensajeUI } from "../../services/chat/types";
import "../../styles/VentanaChat.css";

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
      <div className="chat-empty">
        <div className="chat-empty-inner">
          <div className="chat-empty-icon">💬</div>
          <h5>Selecciona una conversación</h5>
          <p>Elige un chat de la lista para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      
      {/* Header */}
      <div className="chat-header">
        {onVolver && (
          <button className="chat-back" onClick={onVolver}>
            ←
          </button>
        )}

        <div className="chat-avatar">
          {conversacion.nombreOtraPersona.charAt(0).toUpperCase()}
        </div>

        <div>
          <h6 className="chat-name">{conversacion.nombreOtraPersona}</h6>
          <small className="chat-subtitle">
            📍 {conversacion.tituloPublicacion}
          </small>
        </div>
      </div>

      {/* Mensajes */}
      <div className="chat-messages">
        {mensajes.length === 0 ? (
          <div className="chat-no-messages">
            <small>No hay mensajes aún. ¡Inicia la conversación! 👋</small>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message-row ${msg.esPropio ? "propio" : ""}`}
              >
                <div className="chat-message">
                  <div className="chat-text">{msg.contenido}</div>
                  <div className="chat-meta">
                    <small>
                      {formatearFecha(msg.fechaEnvio)}
                      {msg.esPropio && (
                        <span className={`chat-check ${msg.leido ? "leido" : ""}`}>
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
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Escribe un mensaje"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={enviando}
        />
        <button
          className="chat-send"
          onClick={handleEnviar}
          disabled={enviando || !nuevoMensaje.trim()}
        >
          {enviando ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default VentanaChat;
