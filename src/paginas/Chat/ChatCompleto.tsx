import { useState, useEffect } from "react";
import { useChatCompleto } from "../../hooks/chat/useChatCompleto";
import { VentanaChat } from "../../componentes/Chat/VentanaChat";
import { ListaConversaciones } from "../../componentes/Chat/ListaConversaciones";


interface ChatCompletoProps {
  idUsuario: string;
  onBack?: () => void;
}

export const ChatCompleto = ({ idUsuario, onBack }: ChatCompletoProps) => {
  const {
    conversaciones,
    conversacionActiva,
    conversacionSeleccionada,
    mensajes,
    cargando,
    seleccionarConversacion,
    cerrarConversacion,
    enviarMensaje,
  } = useChatCompleto(idUsuario);

  const [esMobile, setEsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setEsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mostrarSidebar = !esMobile || !conversacionActiva;
  const mostrarChat = !esMobile || conversacionActiva;

  return (
    <div className="vh-100 d-flex flex-column">
      <div className="bg-success text-white p-3 d-flex align-items-center">
        {onBack && (
          <button className="btn btn-link text-white p-0 me-3" onClick={onBack}>
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
        )}
        <i className="bi bi-whatsapp fs-4 me-2"></i>
        <h5 className="m-0">Mensajes</h5>
      </div>

      <div className="row g-0 flex-grow-1" style={{ overflow: "hidden" }}>
  
        {mostrarSidebar && (
          <div
            className={`${esMobile ? "col-12" : "col-md-4 col-lg-3"} border-end bg-white`}
            style={{ height: "100%", overflowY: "auto" }}
          >
            <ListaConversaciones
              conversaciones={conversaciones}
              conversacionActiva={conversacionActiva}
              onSeleccionar={seleccionarConversacion}
            />
          </div>
        )}

        {mostrarChat && (
          <div className={`${esMobile ? "col-12" : "col-md-8 col-lg-9"}`} style={{ height: "100%" }}>
            <VentanaChat
              mensajes={mensajes}
              conversacion={conversacionSeleccionada}
              cargando={cargando}
              onEnviar={enviarMensaje}
              onVolver={esMobile ? cerrarConversacion : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};