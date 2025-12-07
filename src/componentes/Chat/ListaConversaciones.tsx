import { Conversacion } from "../../services/chat/ types";


interface ListaConversacionesProps {
  conversaciones: Conversacion[];
  conversacionActiva: string | null;
  onSeleccionar: (id: string) => void;
}

export const ListaConversaciones = ({
  conversaciones,
  conversacionActiva,
  onSeleccionar,
}: ListaConversacionesProps) => {
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
        <i className="bi bi-chat-dots fs-1 d-block mb-3 text-muted"></i>
        <h6>No tienes conversaciones</h6>
        <small>Contacta a un anunciante desde una publicación</small>
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush">
      {conversaciones.map((conv) => (
        <div
          key={conv.idPublicacion}
          className={`list-group-item list-group-item-action border-bottom p-3 ${
            conversacionActiva === conv.idPublicacion ? "active" : ""
          }`}
          onClick={() => onSeleccionar(conv.idPublicacion)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-start">
            {/* Avatar */}
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                conversacionActiva === conv.idPublicacion
                  ? "bg-white text-primary"
                  : "bg-primary text-white"
              }`}
              style={{
                width: "50px",
                height: "50px",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {conv.nombreOtraPersona.charAt(0).toUpperCase()}
            </div>

            {/* Contenido */}
            <div className="flex-grow-1 overflow-hidden">
              <div className="d-flex justify-content-between mb-1">
                <h6 className="mb-0 text-truncate">{conv.nombreOtraPersona}</h6>
                <small
                  className={
                    conversacionActiva === conv.idPublicacion ? "text-white-50" : "text-muted"
                  }
                >
                  {formatearFecha(conv.fechaUltimoMensaje)}
                </small>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <small
                  className={`text-truncate ${
                    conversacionActiva === conv.idPublicacion
                      ? "text-white-50"
                      : conv.noLeidos > 0
                      ? "fw-semibold text-dark"
                      : "text-muted"
                  }`}
                  style={{ maxWidth: "80%" }}
                >
                  {conv.esUltimoMensajePropio && (
                    <i className="bi bi-check-all me-1"></i>
                  )}
                  {conv.ultimoMensaje}
                </small>

                {conv.noLeidos > 0 && (
                  <span className="badge bg-success rounded-pill">{conv.noLeidos}</span>
                )}
              </div>

              <small
                className={`text-truncate d-block ${
                  conversacionActiva === conv.idPublicacion ? "text-white-50" : "text-muted"
                }`}
                style={{ fontSize: "11px" }}
              >
                📍 {conv.tituloPublicacion}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};