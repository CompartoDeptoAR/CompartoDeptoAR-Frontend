import { useState, useEffect, useRef } from "react";
import { MensajeDTO, InfoConversacionDTO } from "../../api/endpoints/chat";
import apiChat from "../../api/endpoints/chat";

interface VentanaChatProps {
  mensajes: MensajeDTO[];
  infoConversacion: InfoConversacionDTO | null;
  cargando: boolean;
  onEnviar: () => void;
  onVolver?: () => void;
}

export const VentanaChat = ({ 
  mensajes, 
  infoConversacion, 
  cargando,
  onEnviar,
  onVolver 
}: VentanaChatProps) => {
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (d.toDateString() === hoy.toDateString()) {
      return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    } else if (d.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
    }
  };

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim() || !infoConversacion) return;

    setEnviando(true);
    try {
      await apiChat.enviarMensaje({
        idDestinatario: infoConversacion.idOtraPersona,
        idPublicacion: infoConversacion.idPublicacion,
        contenido: nuevoMensaje
      });
      
      setNuevoMensaje("");
      onEnviar();
    } catch (err) {
      console.error("Error al enviar:", err);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  if (!infoConversacion) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        <div className="text-center">
          <i className="bi bi-chat-square-text fs-1 d-block mb-3"></i>
          <h5>Selecciona una conversación</h5>
          <p>Elige un chat para comenzar a conversar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Header del chat */}
      <div className="p-3 border-bottom bg-light d-flex align-items-center">
        {onVolver && (
          <button className="btn btn-link p-0 me-2" onClick={onVolver}>
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
        )}
        <div>
          <h6 className="mb-0">{infoConversacion.nombreOtraPersona}</h6>
          <small className="text-muted">{infoConversacion.tituloPublicacion}</small>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-grow-1 p-3 overflow-auto bg-light">
        {cargando ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <small>No hay mensajes aún</small>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <div key={msg.id} className={`mb-3 ${msg.esPropio ? 'text-end' : ''}`}>
                <div
                  className={`d-inline-block p-2 rounded ${
                    msg.esPropio ? 'bg-primary text-white' : 'bg-white border'
                  }`}
                  style={{ maxWidth: "70%", wordBreak: "break-word" }}
                >
                  <div>{msg.contenido}</div>
                  <small 
                    className={msg.esPropio ? 'text-white-50' : 'text-muted'} 
                    style={{ fontSize: '11px' }}
                  >
                    {formatearFecha(msg.fechaEnvio)}
                  </small>
                </div>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-top bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe un mensaje..."
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={enviando}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleEnviar} 
            disabled={enviando || !nuevoMensaje.trim()}
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