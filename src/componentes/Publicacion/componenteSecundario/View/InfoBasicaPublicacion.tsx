import { PublicacionResponce } from "../../../../modelos/Publicacion";

interface InfoBasicaProps {
  publicacion: PublicacionResponce;
}

export const InfoBasicaPublicacion: React.FC<InfoBasicaProps> = ({ publicacion }) => {
  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <h1 className="h3 mb-3">{publicacion.titulo}</h1>

      <div className="mb-4">
        <h5 className="text-muted mb-3">Información básica</h5>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt-fill text-primary me-2 fs-5"></i>
              <div>
                <small className="text-muted d-block">Ubicación</small>
                <strong>{publicacion.ubicacion}</strong>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar3 text-primary me-2 fs-5"></i>
              <div>
                <small className="text-muted d-block">Publicado</small>
                <strong>
                  {publicacion.createdAt ? formatearFecha(publicacion.createdAt) : "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-muted mb-3">Descripción</h5>
        <p style={{ whiteSpace: "pre-wrap" }}>{publicacion.descripcion}</p>
      </div>

      {publicacion.reglas && (
        <div className="mb-4">
          <h5 className="text-muted mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>
            Reglas y condiciones
          </h5>
          <div className="alert alert-info">
            <p className="mb-0">{publicacion.reglas}</p>
          </div>
        </div>
      )}
    </>
  );
};
