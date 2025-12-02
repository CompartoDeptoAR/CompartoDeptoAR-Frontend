import { ConversacionDTO } from "../../api/endpoints/chat";

interface ListaConversacionesProps {
  conversaciones: ConversacionDTO[];
  conversacionActiva: string | null;
  onSeleccionar: (id: string) => void;
}

export const ListaConversaciones = ({ 
  conversaciones, 
  conversacionActiva, 
  onSeleccionar 
}: ListaConversacionesProps) => {
  
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

  if (conversaciones.length === 0) {
    return (
      <div className="text-center text-muted p-5">
        <i className="bi bi-chat-dots fs-1 d-block mb-3"></i>
        <p>No tienes conversaciones aún</p>
        <small>Contacta a un anunciante desde una publicación</small>
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush">
      {conversaciones.map((conv) => (
        <button
          key={conv.idPublicacion}
          className={`list-group-item list-group-item-action border-bottom ${
            conversacionActiva === conv.idPublicacion ? 'active' : ''
          }`}
          onClick={() => onSeleccionar(conv.idPublicacion)}
        >
          <div className="d-flex w-100 justify-content-between mb-1">
            <h6 className="mb-1 text-truncate" style={{ maxWidth: "70%" }}>
              {conv.nombreOtraPersona}
            </h6>
            <small className={conversacionActiva === conv.idPublicacion ? 'text-white-50' : 'text-muted'}>
              {formatearFecha(conv.fechaUltimoMensaje)}
            </small>
          </div>
          
          <div className="d-flex w-100 justify-content-between align-items-center">
            <small 
              className={`text-truncate ${conversacionActiva === conv.idPublicacion ? 'text-white-50' : 'text-muted'}`}
              style={{ maxWidth: "80%" }}
            >
              {conv.ultimoMensajePropio && '✓ '}
              {conv.ultimoMensaje}
            </small>
            
            {conv.noLeidos > 0 && (
              <span className="badge bg-danger rounded-pill">
                {conv.noLeidos}
              </span>
            )}
          </div>
          
          <small 
            className={conversacionActiva === conv.idPublicacion ? 'text-white-50' : 'text-muted'} 
            style={{ fontSize: '11px' }}
          >
            {conv.tituloPublicacion}
          </small>
        </button>
      ))}
    </div>
  );
};