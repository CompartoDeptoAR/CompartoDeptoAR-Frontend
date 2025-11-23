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

  // Helper para mostrar reglas como textarea
  const reglasTexto = publicacion.reglas?.join("\n") ?? "";

  // Validar URL
  const esUrlValida = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Agregar foto
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

  // Eliminar foto
  const handleEliminarFoto = (index: number) => {
    const nuevasFotos = publicacion.foto.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
  };

  // Manejar Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAgregarFoto();
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">
            {modo === "crear" ? "Crear Publicación" : "Editar Publicación"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* TÍTULO */}
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">
                Título del anuncio <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="titulo"
                name="titulo"
                value={publicacion.titulo}
                onChange={handleChange}
                placeholder="Ej: Habitación luminosa en Palermo"
                required
                disabled={loading}
                maxLength={100}
              />
              <small className="text-muted">
                {publicacion.titulo.length}/100 caracteres
              </small>
            </div>

            {/* UBICACIÓN */}
            <SelectorUbicacionArgentina
              provincia={publicacion.provincia}
              localidad={publicacion.localidad}
              onProvinciaChange={onProvinciaChange}
              onLocalidadChange={onLocalidadChange}
              disabled={loading}
              required
            />

            {/* DIRECCION */}
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">
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
            </div>

            {/* PRECIO */}
            <div className="mb-3">
              <label htmlFor="precio" className="form-label">
                Precio mensual <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
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
                />
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción de la vivienda <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                value={publicacion.descripcion}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                required
                disabled={loading}
              />
              <small className="text-muted">
                {publicacion.descripcion.length}/1000 caracteres
              </small>
            </div>

            {/* REGLAS */}
            <div className="mb-3">
              <label htmlFor="reglas" className="form-label">
                Reglas o condiciones
              </label>
              <textarea
                className="form-control"
                id="reglas"
                name="reglas"
                value={reglasTexto}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                disabled={loading}
                placeholder="Una regla por línea"
              />
            </div>

            {/* FOTOS */}
            <div className="mb-3">
              <label className="form-label">
                Fotos de la propiedad
              </label>
              
              {/* Input para agregar fotos */}
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
                  className="btn btn-outline-primary"
                  onClick={handleAgregarFoto}
                  disabled={loading || !nuevaFotoUrl.trim()}
                >
                  + Agregar
                </button>
              </div>
              
              {errorUrl && (
                <div className="text-danger small mb-2">{errorUrl}</div>
              )}
              
              <small className="text-muted d-block mb-3">
                Puedes agregar varias fotos. Pega la URL y presiona "Agregar" o Enter.
              </small>

              {/* Lista de fotos agregadas */}
              {publicacion.foto.length > 0 && (
                <div className="row g-3">
                  {publicacion.foto.map((url, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                      <div className="card">
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="card-img-top"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="card-body p-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger w-100"
                            onClick={() => handleEliminarFoto(index)}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* PREFERENCIAS */}
            <div className="mb-3">
              <label className="form-label">Preferencias del compañero ideal</label>
              <div className="d-flex flex-wrap gap-3">
                {Object.entries(publicacion.preferencias || {}).map(([key, val]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={!!val}
                      onChange={(e) => onPreferenciasChange(key, e.target.checked)}
                      disabled={loading}
                    />
                    {" "}{key}
                  </label>
                ))}
              </div>
            </div>

            {/* HÁBITOS */}
            <div className="mb-3">
              <label className="form-label">Tus hábitos</label>
              <div className="d-flex flex-wrap gap-3">
                {Object.entries(publicacion.habitos || {}).map(([key, val]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={!!val}
                      onChange={(e) => onHabitosChange(key, e.target.checked)}
                      disabled={loading}
                    />
                    {" "}{key}
                  </label>
                ))}
              </div>
            </div>
            
            {/* BOTONES */}
            <div className="d-flex gap-2 justify-content-end mt-4">
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : modo === "crear"
                  ? "Publicar"
                  : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioPublicacion;