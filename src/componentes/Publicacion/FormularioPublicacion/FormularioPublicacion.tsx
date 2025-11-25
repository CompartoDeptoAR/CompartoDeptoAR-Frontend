import React, { useState } from "react";
import "../../../styles/FormularioPerfil.css";
import type { Publicacion } from "../../../modelos/Publicacion";
import SelectorUbicacionArgentina from "../../SelectorUbicacionArgentina/SelectorUbicacionArgentina";

interface FormularioPublicacionProps {
  publicacion: Publicacion;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProvinciaChange: (provincia: string) => void;
  onLocalidadChange: (localidad: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  modo: "crear" | "editar";
  loading?: boolean;
  onCancel?: () => void;
  onFotosChange: (fotos: string[]) => void;
  onPreferenciasChange: (key: string, value: boolean) => void;
  onHabitosChange: (key: string, value: boolean) => void;
}

const FormularioPublicacion: React.FC<FormularioPublicacionProps> = ({
  publicacion,
  handleChange,
  onProvinciaChange,
  onLocalidadChange,
  handleSubmit,
  modo,
  loading = false,
  onCancel,
  onFotosChange,
  onPreferenciasChange,
  onHabitosChange,
}) => {
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState("");
  const [errorUrl, setErrorUrl] = useState("");

  const reglasTexto = publicacion.reglas?.join("\n") ?? "";

  const esUrlValida = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAgregarFoto = () => {
    const urlLimpia = nuevaFotoUrl.trim();
    
    if (!esUrlValida(urlLimpia)) {
      setErrorUrl("Por favor ingresa una URL válida (debe comenzar con http:// o https://)");
      return;
    }

    if (publicacion.foto.includes(urlLimpia)) {
      setErrorUrl("Esta foto ya fue agregada");
      return;
    }

    onFotosChange([...publicacion.foto, urlLimpia]);
    setNuevaFotoUrl("");
    setErrorUrl("");
  };

  const handleEliminarFoto = (index: number) => {
    const nuevasFotos = publicacion.foto.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAgregarFoto();
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold mb-2">
            {modo === "crear" ? "🏠 Crear Nueva Publicación" : "✏️ Editar Publicación"}
          </h1>
          <p className="text-muted">
            {modo === "crear" 
              ? "Completa los datos para publicar tu espacio disponible" 
              : "Actualiza la información de tu publicación"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* COLUMNA PRINCIPAL */}
          <div className="col-lg-8">
            {/* INFORMACIÓN BÁSICA */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">📋 Información Básica</h5>
              </div>
              <div className="card-body">
                {/* TÍTULO */}
                <div className="mb-4">
                  <label htmlFor="titulo" className="form-label fw-semibold">
                    Título del anuncio <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="titulo"
                    name="titulo"
                    value={publicacion.titulo}
                    onChange={handleChange}
                    placeholder="Ej: Habitación luminosa en Palermo"
                    required
                    disabled={loading}
                    maxLength={100}
                  />
                  <div className="form-text">
                    {publicacion.titulo.length}/100 caracteres
                  </div>
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label fw-semibold">
                    Descripción de la vivienda <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={publicacion.descripcion}
                    onChange={handleChange}
                    rows={6}
                    maxLength={1000}
                    required
                    disabled={loading}
                    placeholder="Describe tu espacio: características, ambientes, servicios incluidos..."
                  />
                  <div className="form-text">
                    {publicacion.descripcion.length}/1000 caracteres
                  </div>
                </div>
              </div>
            </div>

            {/* UBICACIÓN Y PRECIO */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">📍 Ubicación y Precio</h5>
              </div>
              <div className="card-body">
                <SelectorUbicacionArgentina
                  provincia={publicacion.provincia}
                  localidad={publicacion.localidad}
                  onProvinciaChange={onProvinciaChange}
                  onLocalidadChange={onLocalidadChange}
                  disabled={loading}
                  required
                />

                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label fw-semibold">
                    Dirección (opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccion"
                    name="direccion"
                    value={publicacion.direccion || ""}
                    onChange={handleChange}
                    placeholder="Ej: Av. Santa Fe 1234"
                    disabled={loading}
                  />
                  <div className="form-text">
                    La dirección exacta solo se mostrará a interesados confirmados
                  </div>
                </div>

                <div className="mb-0">
                  <label htmlFor="precio" className="form-label fw-semibold">
                    Precio mensual <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light">
                      <strong>$</strong>
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="precio"
                      name="precio"
                      value={publicacion.precio}
                      onChange={handleChange}
                      min={0}
                      step={1000}
                      required
                      disabled={loading}
                      placeholder="50000"
                    />
                    <span className="input-group-text bg-light">ARS / mes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOTOS */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">📸 Fotos de la Propiedad</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info mb-3">
                  <small>
                    💡 <strong>Tip:</strong> Las publicaciones con fotos reciben hasta 5x más visitas
                  </small>
                </div>

                <div className="input-group mb-2">
                  <input
                    type="text"
                    className={`form-control ${errorUrl ? "is-invalid" : ""}`}
                    value={nuevaFotoUrl}
                    onChange={(e) => {
                      setNuevaFotoUrl(e.target.value);
                      setErrorUrl("");
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAgregarFoto}
                    disabled={loading || !nuevaFotoUrl.trim()}
                  >
                    ➕ Agregar
                  </button>
                </div>
                
                {errorUrl && (
                  <div className="alert alert-danger py-2 mb-2">{errorUrl}</div>
                )}
                
                <div className="form-text mb-3">
                  Pega la URL de la imagen y presiona "Agregar" o Enter
                </div>

                {publicacion.foto.length > 0 ? (
                  <div className="row g-3">
                    {publicacion.foto.map((url, index) => (
                      <div key={index} className="col-sm-6 col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="position-relative">
                            <img
                              src={url}
                              alt={`Foto ${index + 1}`}
                              className="card-img-top"
                              style={{
                                height: "180px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            {index === 0 && (
                              <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                                Principal
                              </span>
                            )}
                          </div>
                          <div className="card-body p-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-danger w-100"
                              onClick={() => handleEliminarFoto(index)}
                              disabled={loading}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center py-4">
                    <div className="mb-2" style={{ fontSize: "3rem" }}>📷</div>
                    <p className="mb-0 text-muted">
                      Aún no has agregado fotos. ¡Agrega al menos una!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* REGLAS */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-warning">
                <h5 className="mb-0">📜 Reglas y Condiciones</h5>
              </div>
              <div className="card-body">
                <label htmlFor="reglas" className="form-label fw-semibold">
                  Reglas o condiciones (opcional)
                </label>
                <textarea
                  className="form-control"
                  id="reglas"
                  name="reglas"
                  value={reglasTexto}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  disabled={loading}
                  placeholder="• No se permiten mascotas&#10;• No fumar en espacios comunes&#10;• Horario de silencio: 22:00 - 8:00"
                />
                <div className="form-text">
                  Escribe una regla por línea. Máximo 500 caracteres.
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA LATERAL */}
          <div className="col-lg-4">
            {/* PREFERENCIAS */}
            <div className="card shadow-sm mb-4 sticky-top" style={{ top: "20px" }}>
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">👤 Preferencias del Compañero</h5>
              </div>
              <div className="card-body">
                <p className="text-muted small mb-3">
                  Selecciona las características que buscas en tu compañero ideal
                </p>
                <div className="d-flex flex-column gap-2">
                  {Object.entries(publicacion.preferencias || {}).map(([key, val]) => (
                    <div key={key} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`pref-${key}`}
                        checked={!!val}
                        onChange={(e) => onPreferenciasChange(key, e.target.checked)}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor={`pref-${key}`}>
                        {key}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HÁBITOS */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">🌟 Tus Hábitos</h5>
              </div>
              <div className="card-body">
                <p className="text-muted small mb-3">
                  Describe tu estilo de vida para encontrar mejor match
                </p>
                <div className="d-flex flex-column gap-2">
                  {Object.entries(publicacion.habitos || {}).map(([key, val]) => (
                    <div key={key} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`hab-${key}`}
                        checked={!!val}
                        onChange={(e) => onHabitosChange(key, e.target.checked)}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor={`hab-${key}`}>
                        {key}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Guardando...
                      </>
                    ) : modo === "crear" ? (
                      "🚀 Publicar Ahora"
                    ) : (
                      "💾 Guardar Cambios"
                    )}
                  </button>
                  {onCancel && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioPublicacion;