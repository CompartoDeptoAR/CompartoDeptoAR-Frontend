import { Conversacion } from "../../services/chat/types";


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
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: conversacionActiva === conv.idPublicacion ? "#e3f2fd" : "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: conversacionActiva === conv.idPublicacion ? "#1976d2" : "#4caf50",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {conv.nombreOtraPersona.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <h6 style={{ margin: 0, fontWeight: "600" }}>{conv.nombreOtraPersona}</h6>
                <small style={{ color: "#666", whiteSpace: "nowrap" }}>
                  {formatearFecha(conv.fechaUltimoMensaje)}
                </small>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small
                  style={{
                    color: conv.noLeidos > 0 ? "#000" : "#666",
                    fontWeight: conv.noLeidos > 0 ? "600" : "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {conv.esUltimoMensajePropio && "✓ "}
                  {conv.ultimoMensaje}
                </small>

                {conv.noLeidos > 0 && (
                  <span
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginLeft: "8px",
                    }}
                  >
                    {conv.noLeidos}
                  </span>
                )}
              </div>

              <small style={{ color: "#999", fontSize: "11px" }}>
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