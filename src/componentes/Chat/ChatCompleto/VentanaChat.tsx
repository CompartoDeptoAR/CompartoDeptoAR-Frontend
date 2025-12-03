import { useState, useEffect, useRef } from "react";
import { Conversacion, MensajeUI } from "../../../services/chat/ types";

interface VentanaChatProps {
  mensajes: MensajeUI[];
  conversacion: Conversacion | undefined;
  cargando: boolean;
  onEnviar: (mensaje: string) => Promise<void>;
  onVolver?: () => void;
}

export const VentanaChat = ({
  mensajes,
  conversacion,
  cargando,
  onEnviar,
  onVolver,
}: VentanaChatProps) => {
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
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
      <div className="d-flex align-items-center justify-content-center h-100 bg-light">
        <div className="text-center text-muted">
          <i className="bi bi-chat-square-text fs-1 d-block mb-3"></i>
          <h5>Selecciona una conversación</h5>
          <p>Elige un chat de la lista para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100" style={{ background: "#e5ddd5" }}>
      {/* Header */}
      <div className="p-3 bg-light border-bottom d-flex align-items-center">
        {onVolver && (
          <button className="btn btn-link p-0 me-2" onClick={onVolver}>
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
        )}
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
          style={{ width: "40px", height: "40px" }}
        >
          {conversacion.nombreOtraPersona.charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-0">{conversacion.nombreOtraPersona}</h6>
          <small className="text-muted">
            <i className="bi bi-geo-alt-fill"></i> {conversacion.tituloPublicacion}
          </small>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-grow-1 overflow-auto p-3">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="text-center text-muted py-5">
            <small>No hay mensajes aún. ¡Inicia la conversación! 👋</small>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-2 ${msg.esPropio ? "justify-content-end" : ""}`}
              >
                <div
                  className={`p-2 rounded ${
                    msg.esPropio ? "bg-light-green" : "bg-white"
                  }`}
                  style={{
                    maxWidth: "65%",
                    wordWrap: "break-word",
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                    backgroundColor: msg.esPropio ? "#dcf8c6" : "white",
                  }}
                >
                  <div style={{ fontSize: "14px" }}>{msg.contenido}</div>
                  <div className="text-end">
                    <small className="text-muted" style={{ fontSize: "11px" }}>
                      {formatearFecha(msg.fechaEnvio)}
                      {msg.esPropio && (
                        <i
                          className={`bi bi-check-all ms-1 ${
                            msg.leido ? "text-info" : "text-muted"
                          }`}
                        ></i>
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
      <div className="p-2 bg-light border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe un mensaje"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={enviando}
          />
          <button
            className="btn btn-success"
            onClick={handleEnviar}
            disabled={enviando || !nuevoMensaje.trim()}
          >
            {enviando ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-send-fill"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};