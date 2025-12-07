import { useRef, useEffect } from "react";
import { useMiniChat } from "../../hooks/chat/useMiniChat";
import "../../styles/MiniChat.css";

interface MiniChatProps {
  visible: boolean;
  onClose: () => void;
  idPublicacion: string;
  idDestinatario: string;
  idUsuarioActual: string;
  nombreDestinatario?: string;
}

export const MiniChat = ({
  visible,
  onClose,
  idPublicacion,
  idDestinatario,
  idUsuarioActual,
  nombreDestinatario = "Usuario",
}: MiniChatProps) => {
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const { mensajes, mensaje, setMensaje, enviando, error, enviarMensaje } = useMiniChat({
    idPublicacion,
    idDestinatario,
    idUsuarioActual,
    visible,
  });

  // Auto-scroll
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  if (!visible) return null;

  return (
    <div className="mini-chat">
      {/* Header */}
      <div className="mini-chat-header">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
            style={{ width: "32px", height: "32px", fontSize: "14px" }}
          >
            {nombreDestinatario.charAt(0).toUpperCase()}
          </div>
          <span className="fw-semibold">{nombreDestinatario}</span>
        </div>
        <button onClick={onClose} className="btn-close btn-close-white btn-sm"></button>
      </div>

      {/* Mensajes */}
      <div className="mini-chat-mensajes">
        {mensajes.length === 0 ? (
          <div className="text-center text-muted py-5">
            <small>Inicia la conversación 👋</small>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`mensaje-bubble ${msg.esPropio ? "propio" : "recibido"}`}
              >
                <div className="mensaje-contenido">{msg.contenido}</div>
                <div className="mensaje-hora">
                  {msg.fechaEnvio.toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-sm mx-2 mb-2 py-1">
          <small>{error}</small>
        </div>
      )}

      {/* Input */}
      <div className="mini-chat-input">
        <input
          type="text"
          className="form-control"
          placeholder="Aa"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={enviando}
        />
        <button
          className="btn btn-primary btn-sm ms-2"
          onClick={enviarMensaje}
          disabled={enviando || !mensaje.trim()}
        >
          {enviando ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <i className="bi bi-send-fill"></i>
          )}
        </button>
      </div>
    </div>
  );
};