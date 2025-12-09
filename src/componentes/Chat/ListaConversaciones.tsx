import { Conversacion } from "../../services/chat/types";
import "../../styles/ListaConversaciones.css"

interface ListaConversacionesProps {
  conversaciones: Conversacion[];
  conversacionActiva: string | null;
  onSeleccionar: (id: string) => void;
}

const ListaConversaciones:React.FC<ListaConversacionesProps> = ({ conversaciones, conversacionActiva, onSeleccionar }) => {
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

  if (conversaciones.length === 0) {
    return (
      <div className="text-center text-muted p-5">
        <div style={{ fontSize: "48px" }}>💬</div>
        <h6 className="mt-3">No tienes conversaciones</h6>
        <small>Contacta a un anunciante desde una publicación</small>
      </div>
    );
  }

  return (
    <div>
      {conversaciones.map((conv) => (
        <div
          key={conv.idPublicacion}
          onClick={() => onSeleccionar(conv.idPublicacion)}
          className={`item-conversacion ${conversacionActiva === conv.idPublicacion ? "activa" : ""}`}
        >
          <div className="item-conversacion-contenido">
            <div
              className={`avatar ${conversacionActiva === conv.idPublicacion ? "activa" : ""}`}
            >
              {conv.nombreOtraPersona.charAt(0).toUpperCase()}
            </div>

            <div className="contenido-texto">
              <div className="linea-superior">
                <h6>{conv.nombreOtraPersona}</h6>
                <small>{formatearFecha(conv.fechaUltimoMensaje)}</small>
              </div>

              <div className="linea-mensaje">
                <small
                  className={`ultimo-mensaje ${conv.noLeidos > 0 ? "negrita" : ""}`}
                >
                  {conv.esUltimoMensajePropio && "✓ "}
                  {conv.ultimoMensaje}
                </small>

                {conv.noLeidos > 0 && (
                  <span className="badge-no-leidos">
                    {conv.noLeidos}
                  </span>
                )}
              </div>

              <small className="titulo-pub">
                📍 {conv.tituloPublicacion}
              </small>
            </div>
          </div>
        </div>

      ))}
    </div>
  );
};

export default ListaConversaciones;