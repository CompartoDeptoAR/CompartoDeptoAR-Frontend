import { useRef, useEffect } from "react";
import { useMensajes } from "../../hooks/chat/useMensajes";

interface MiniChatProps {
  visible: boolean;
  onClose: () => void;
  idPublicacion: string;
  idDestinatario: string;
}

export const MiniChat = ({ visible, onClose, idPublicacion, idDestinatario }: MiniChatProps) => {
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const {
    mensajes,
    mensaje,
    setMensaje,
    enviando,
    error,
    esPrimerMensaje,
    enviarMensaje,
  } = useMensajes({ idPublicacion, idDestinatario, visible });

  // Auto-scroll al último mensaje
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 bg-white shadow-lg"
      style={{
        width: "350px",
        maxHeight: "500px",
        zIndex: 9999,
        borderRadius: "12px 12px 0 0",
        margin: "0 20px 20px 0",
      }}
    >
      {/* Header */}
      <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0" }}>
        <h6 className="mb-0 fw-bold">Chat</h6>
        <button
          onClick={onClose}
          className="btn-close btn-close-white"
          aria-label="Cerrar"
        ></button>
      </div>

      {/* Mensajes */}
      <div 
        className="p-3 bg-light overflow-auto"
        style={{ height: "300px" }}
      >
        {mensajes.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <small>
              {esPrimerMensaje 
                ? "💌 Tu primer mensaje también se enviará por email" 
                : "Escribí un mensaje para continuar la conversación"}
            </small>
          </div>
        ) : (
          <>
            {mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.esPropio ? 'text-end' : ''}`}
              >
                <div
                  className={`d-inline-block p-2 rounded ${
                    msg.esPropio 
                      ? 'bg-primary text-white' 
                      : 'bg-white border'
                  }`}
                  style={{ maxWidth: "75%", wordBreak: "break-word" }}
                >
                  <div className="small">{msg.contenido}</div>
                  <small 
                    className={msg.esPropio ? 'text-white-50' : 'text-muted'}
                    style={{ fontSize: "10px" }}
                  >
                    {new Date(msg.fechaEnvio).toLocaleTimeString('es-AR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </small>
                </div>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-sm mx-2 mb-0 py-1" role="alert">
          <small>{error}</small>
        </div>
      )}

      {/* Input */}
      <div className="p-2 border-top bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={enviando}
          />
          <button 
            className="btn btn-primary" 
            onClick={enviarMensaje}
            disabled={enviando || !mensaje.trim()}
          >
            {enviando ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="bi bi-send"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};