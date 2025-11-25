import React from "react";
import type { PublicacionResponce } from "../../../modelos/Publicacion";
import "../../../styles/publicacionView.css";
import { Navegar } from "../../../navigation/navigationService";

interface FormularioPublicacionViewProps {
  publicacion: PublicacionResponce;
  nombreUsuario: string;
  usuarioId: string;
  calificacionPromedio?: number;
  cantidadCalificaciones?: number;

  onContactar: () => void;

  /** Props nuevos */
  // puedeCalificar?: boolean;
  // onEnviarCalificacion?: (calificacion: number, comentario: string) => void;
}

const FormularioPublicacionView: React.FC<FormularioPublicacionViewProps> = ({
  publicacion,
  nombreUsuario,
  usuarioId,
  calificacionPromedio = 0,
  cantidadCalificaciones = 0,
  onContactar,
  // puedeCalificar = false,
  // onEnviarCalificacion,
}) => {

  // const [rating, setRating] = React.useState(0);
  // const [comentario, setComentario] = React.useState("");

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderEstrellas = (rating: number) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi bi-star${star <= rating ? "-fill" : ""}`}
            style={{ color: star <= rating ? "#FFB800" : "#ddd" }}
          ></i>
        ))}
        <span className="text-muted ms-1">({cantidadCalificaciones})</span>
      </div>
    );
  };

  // --- mandar calificación chau ---
  //
  // const enviarCalificacion = () => {
  //   if (!onEnviarCalificacion) return;
  //   if (rating === 0) return;
  //   onEnviarCalificacion(rating, comentario);
  //   setComentario("");
  //   setRating(0);
  // };
  //
  // --- FIN---

  return (
    <div className="container mt-4">
      <div className="row">

        {/* Columna izquierda */}
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">

              <h1 className="h3 mb-3">{publicacion.titulo}</h1>

              {/* Carrusel */}
              {publicacion.foto && publicacion.foto.length > 0 ? (
                <div id="carouselFotos" className="carousel slide mb-4">
                  <div className="carousel-inner">
                    {publicacion.foto.map((foto, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <img
                          src={foto}
                          className="d-block w-100 rounded"
                          alt={`Foto ${index + 1}`}
                          style={{ maxHeight: "500px", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <img
                  src="https://via.placeholder.com/800x600?text=Sin+Imagen"
                  className="img-fluid rounded mb-4"
                />
              )}

              {/* Información básica */}
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
                          {publicacion.createdAt
                            ? formatearFecha(publicacion.createdAt)
                            : "Fecha no disponible"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <h5 className="text-muted mb-3">Descripción</h5>
                <p style={{ whiteSpace: "pre-wrap" }}>{publicacion.descripcion}</p>
              </div>

              {/* Reglas */}
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

              {/* --- para calificar chau ---
              
              {puedeCalificar && (
                <div className="card p-3 mt-4">
                  <h6>Calificar al anunciante</h6>

                  <div className="d-flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi bi-star${star <= rating ? "-fill" : ""} fs-4`}
                        style={{ cursor: "pointer", color: star <= rating ? "#FFB800" : "#aaa" }}
                        onClick={() => setRating(star)}
                      ></i>
                    ))}
                  </div>

                  <textarea
                    className="form-control mb-2"
                    placeholder="Escribe un comentario (opcional)"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={3}
                  ></textarea>

                  <button
                    className="btn btn-primary"
                    disabled={rating === 0}
                    onClick={enviarCalificacion}
                  >
                    Enviar calificación
                  </button>
                </div>
              )}

              --- FIN bloque para calificar --- */}

            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-lg-4">
          <div className="card mb-3 sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h2 className="text-success mb-0">{formatearPrecio(publicacion.precio)}</h2>
              <small className="text-muted">por mes</small>

              <button className="btn btn-primary w-100 mt-3" onClick={onContactar}>
                <i className="bi bi-chat-dots me-2"></i>
                Contactar
              </button>
            </div>
          </div>

          {/* Perfil del anunciante */}
          <div className="card">
            <div className="card-body">
              <h6 className="card-title mb-3">Información del anunciante</h6>

              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "50px", height: "50px", fontSize: "20px" }}
                >
                  {nombreUsuario.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h6 className="mb-0">{nombreUsuario}</h6>
                  {calificacionPromedio > 0 && renderEstrellas(calificacionPromedio)}
                </div>
              </div>

              <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => Navegar.usuarioPerfil(usuarioId!)}
              >
                <i className="bi bi-person me-2"></i>
                Ver perfil
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FormularioPublicacionView;
