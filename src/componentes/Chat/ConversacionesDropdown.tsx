import { useConversaciones } from "../../hooks/chat/useConversaciones";


interface Props {
  idUsuario: string;
  onSeleccionar: (conversacion: any) => void;
}

export const ConversacionesDropdown = ({ idUsuario, onSeleccionar }: Props) => {
  const { conversaciones, loading } = useConversaciones(idUsuario);


  if (conversaciones.length === 0)
    return <div className="p-3 text-center text-muted">Sin conversaciones</div>;

  return (
    <div
      className="position-absolute bg-white shadow rounded"
      style={{
        top: "45px",
        right: 0,
        width: "300px",
        zIndex: 9999,
        maxHeight: "350px",
        overflowY: "auto",
      }}
    >
      {conversaciones.map((c) => (
        <div
          key={c.idPublicacion + c.idOtraPersona}
          className="p-2 border-bottom d-flex align-items-center hover-bg"
          style={{ cursor: "pointer" }}
          onClick={() => onSeleccionar(c)}
        >
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
            style={{ width: 40, height: 40 }}
          >
            {c.nombreOtraPersona.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow-1">
            <div className="fw-semibold">
              {c.nombreOtraPersona}
            </div>

            <div className="text-muted small text-truncate" style={{ maxWidth: 180 }}>
              {c.ultimoMensaje}
            </div>
          </div>

          {c.noLeidos > 0 && (
            <span className="badge bg-danger ms-2">
              {c.noLeidos}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
