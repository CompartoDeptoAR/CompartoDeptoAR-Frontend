import React, { useState } from "react";
import "../../styles/seccionComentarios.css";

interface Comentario {
  id: string;
  usuarioNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

interface SeccionComentariosProps {
  comentarios: Comentario[];
  puedeCalificar: boolean;
  onSubmitCalificacion: (calificacion: number, comentario: string) => Promise<void>;
  loading?: boolean;
}

const SeccionComentarios: React.FC<SeccionComentariosProps> = ({
  comentarios,
  puedeCalificar,
  onSubmitCalificacion,
  loading = false,
}) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (calificacion === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    if (!comentario.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitCalificacion(calificacion, comentario);
      setCalificacion(0);
      setComentario("");
    } catch (error) {
      console.error("Error al enviar calificación:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderEstrellas = (rating: number, interactive = false) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi bi-star${
              star <= (interactive ? hoveredStar || calificacion : rating) ? "-fill" : ""
            } ${interactive ? "star-interactive" : ""}`}
            style={{
              color:
                star <= (interactive ? hoveredStar || calificacion : rating)
                  ? "#FFB800"
                  : "#ddd",
              cursor: interactive ? "pointer" : "default",
              fontSize: interactive ? "1.5rem" : "1rem",
            }}
            onClick={() => interactive && setCalificacion(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          ></i>
        ))}
      </div>
    );
  };

  const calcularPromedioCalificacion = () => {
    if (comentarios.length === 0) return 0;
    const suma = comentarios.reduce((acc, c) => acc + c.calificacion, 0);
    return (suma / comentarios.length).toFixed(1);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <i className="bi bi-chat-square-text me-2"></i>
              Opiniones y calificaciones
            </h4>
            {comentarios.length > 0 && (
              <div className="d-flex align-items-center">
                <span className="fs-3 fw-bold me-2">
                  {calcularPromedioCalificacion()}
                </span>
                <div>
                  {renderEstrellas(Number(calcularPromedioCalificacion()))}
                  <small className="text-muted d-block">
                    {comentarios.length} {comentarios.length === 1 ? "opinión" : "opiniones"}
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* Formulario para nueva calificación */}
          {puedeCalificar && (
            <div className="border rounded p-4 mb-4 bg-light">
              <h5 className="mb-3">Califica al anunciante</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tu calificación</label>
                  {renderEstrellas(calificacion, true)}
                </div>

                <div className="mb-3">
                  <label htmlFor="comentario" className="form-label">
                    Tu opinión
                  </label>
                  <textarea
                    id="comentario"
                    className="form-control"
                    rows={4}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Comparte tu experiencia con este anunciante..."
                    maxLength={500}
                    disabled={submitting}
                  />
                  <small className="text-muted">{comentario.length}/500 caracteres</small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || calificacion === 0}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Publicar calificación
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Lista de comentarios */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : comentarios.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-chat-square-text fs-1 d-block mb-3"></i>
              <p>Aún no hay opiniones sobre este anunciante</p>
              {puedeCalificar && <p>¡Sé el primero en dejar tu opinión!</p>}
            </div>
          ) : (
            <div className="comentarios-lista">
              {comentarios.map((com) => (
                <div key={com.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{com.usuarioNombre}</h6>
                      {renderEstrellas(com.calificacion)}
                    </div>
                    <small className="text-muted">{formatearFecha(com.fecha)}</small>
                  </div>
                  <p className="mb-0 text-muted">{com.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeccionComentarios;