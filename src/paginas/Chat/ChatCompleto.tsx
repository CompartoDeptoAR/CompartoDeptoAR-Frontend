import { useState, useEffect } from "react";
import { useConversaciones } from "../../hooks/chat/useConversaciones";
import { ListaConversaciones } from "./ListaConversaciones";
import { VentanaChat } from "./VentanaChat";

interface ChatCompletoProps {
  onBack?: () => void;
}

export const ChatCompleto = ({ onBack }: ChatCompletoProps) => {
  const {
    conversaciones,
    conversacionActiva,
    mensajes,
    infoConversacion,
    cargando,
    seleccionarConversacion,
    cerrarConversacion,
    recargarConversaciones,
  } = useConversaciones();

  const [esMobile, setEsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setEsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mostrarSidebar = !esMobile || !conversacionActiva;
  const mostrarChat = !esMobile || conversacionActiva;

  const handleEnviarMensaje = () => {
    recargarConversaciones();
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      {/* Header */}
      <div className="bg-primary text-white p-3 d-flex align-items-center">
        {onBack && (
          <button className="btn btn-link text-white p-0 me-3" onClick={onBack}>
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
        )}
        <h5 className="m-0">
          <i className="bi bi-chat-dots me-2"></i>
          Mensajes
        </h5>
      </div>

      {/* Contenido */}
      <div className="row g-0 flex-grow-1" style={{ overflow: 'hidden' }}>
        {/* Sidebar - Lista de conversaciones */}
        {mostrarSidebar && (
          <div 
            className={`${esMobile ? 'col-12' : 'col-md-4 col-lg-3'} border-end bg-white`}
            style={{ height: '100%', overflowY: 'auto' }}
          >
            <ListaConversaciones
              conversaciones={conversaciones}
              conversacionActiva={conversacionActiva}
              onSeleccionar={seleccionarConversacion}
            />
          </div>
        )}

        {/* Chat principal */}
        {mostrarChat && (
          <div 
            className={`${esMobile ? 'col-12' : 'col-md-8 col-lg-9'}`}
            style={{ height: '100%' }}
          >
            <VentanaChat
              mensajes={mensajes}
              infoConversacion={infoConversacion}
              cargando={cargando}
              onEnviar={handleEnviarMensaje}
              onVolver={esMobile ? cerrarConversacion : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};