import React from "react";
import { useNavigate } from "react-router-dom";
import type {  PublicacionResponce } from "../../modelos/Publicacion";
import "../../styles/publicacionView.css";

interface FormularioPublicacionViewProps {
  publicacion: PublicacionResponce;
  nombreUsuario: string;
  usuarioId: string;
  calificacionPromedio?: number;
  cantidadCalificaciones?: number;
  onContactar: () => void;
}

const FormularioPublicacionView: React.FC<FormularioPublicacionViewProps> = ({
  publicacion,
  nombreUsuario,
  usuarioId,
  calificacionPromedio = 0,
  cantidadCalificaciones = 0,
  onContactar,
}) => {
  const navigate = useNavigate();

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
        <span className="text-muted ms-1">
          ({cantidadCalificaciones})
        </span>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Columna izquierda - Imagen y detalles */}
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">
              <h1 className="h3 mb-3">{publicacion.titulo}</h1>


              {/* Carrusel de imágenes */}
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
                          alt={`${publicacion.titulo} - Foto ${index + 1}`}
                          style={{ maxHeight: "500px", objectFit: "cover" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/800x600?text=Sin+Imagen";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {publicacion.foto.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselFotos"
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselFotos"
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <img
                    src="https://via.placeholder.com/800x600?text=Sin+Imagen"
                    alt="Sin imagen"
                    className="img-fluid rounded shadow-sm"
                    style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                  />
                </div>
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
                <p className="text-justify" style={{ whiteSpace: "pre-wrap" }}>
                  {publicacion.descripcion}
                </p>
              </div>

              {/* Reglas */}
              {publicacion.reglas && (
                <div className="mb-4">
                  <h5 className="text-muted mb-3">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Reglas y condiciones
                  </h5>
                  <div className="alert alert-info">
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {publicacion.reglas}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Precio y vendedor */}
        <div className="col-lg-4">
          {/* Card de precio */}
          <div className="card mb-3 sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <div className="mb-3">
                <h2 className="text-success mb-0">
                  {formatearPrecio(publicacion.precio)}
                </h2>
                <small className="text-muted">por mes</small>
              </div>

              <button
                className="btn btn-primary w-100 mb-2"
                onClick={onContactar}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Contactar
              </button>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Protegemos tu información
                </small>
              </div>
            </div>
          </div>

          {/* Card del vendedor */}
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
                onClick={() => navigate(`/perfil/${usuarioId}`)}
              >
                <i className="bi bi-person me-2"></i>
                Ver perfil
              </button>

              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Verifica el perfil antes de contactar
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioPublicacionView;