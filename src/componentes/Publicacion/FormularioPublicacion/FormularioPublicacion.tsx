import React, { useState } from "react";
import "../../styles/FormularioPerfil.css";
import SelectorUbicacionArgentina from "../../SelectorUbicacionArgentina/SelectorUbicacionArgentina";
import type { PublicacionFormulario } from "../../../modelos/Publicacion";

interface FormularioPublicacionProps {
  publicacion: PublicacionFormulario;
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

  // Reglas como textarea
  const reglasTexto = publicacion.reglas?.join("\n") ?? "";

  const esUrlValida = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAgregarFoto = () => {
    const url = nuevaFotoUrl.trim();
    if (!esUrlValida(url)) {
      setErrorUrl("URL inválida. Debe comenzar con http:// o https://");
      return;
    }
    if (publicacion.foto.includes(url)) {
      setErrorUrl("Esta foto ya está agregada");
      return;
    }
    onFotosChange([...publicacion.foto, url]);
    setNuevaFotoUrl("");
    setErrorUrl("");
  };

  const handleEliminarFoto = (i: number) => {
    onFotosChange(publicacion.foto.filter((_, idx) => idx !== i));
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
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-control"
                name="titulo"
                value={publicacion.titulo}
                onChange={handleChange}
                required
                maxLength={100}
                disabled={loading}
              />
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

            {/* DIRECCIÓN */}
            <div className="mb-3">
              <label className="form-label">Dirección (opcional)</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={publicacion.direccion || ""}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* PRECIO */}
            <div className="mb-3">
              <label className="form-label">Precio mensual *</label>
              <input
                type="number"
                className="form-control"
                name="precio"
                value={publicacion.precio}
                onChange={handleChange}
                min={0}
                step={1000}
                required
                disabled={loading}
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
              <label className="form-label">Descripción *</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={publicacion.descripcion}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                required
                disabled={loading}
              />
            </div>

            {/* REGLAS */}
            <div className="mb-3">
              <label className="form-label">Reglas</label>
              <textarea
                className="form-control"
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
              <label className="form-label">Fotos</label>

              <div className="input-group mb-2">
                <input
                  className={`form-control ${errorUrl ? "is-invalid" : ""}`}
                  value={nuevaFotoUrl}
                  onChange={(e) => {
                    setNuevaFotoUrl(e.target.value);
                    setErrorUrl("");
                  }}
                  placeholder="URL de la imagen"
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

              {errorUrl && <small className="text-danger">{errorUrl}</small>}

              {publicacion.foto.length > 0 && (
                <div className="row g-3 mt-2">
                  {publicacion.foto.map((url, idx) => (
                    <div className="col-md-4" key={idx}>
                      <div className="card">
                        <img src={url} className="card-img-top" />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm mt-1"
                          onClick={() => handleEliminarFoto(idx)}
                        >
                          Eliminar
                        </button>
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
            <div className="d-flex justify-content-end gap-2 mt-4">
              {onCancel && (
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                  Cancelar
                </button>
              )}

              <button type="submit" className="btn btn-primary">
                {loading
                  ? "Guardando..."
                  : modo === "crear"
                  ? "Publicar"
                  : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioPublicacion;
