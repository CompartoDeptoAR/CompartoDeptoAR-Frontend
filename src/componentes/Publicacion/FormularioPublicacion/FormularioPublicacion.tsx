import React, { useState, useRef } from "react";
import "../../../styles/FormularioPerfil.css";
import type { Publicacion } from "../../../modelos/Publicacion";
import SelectorUbicacionArgentina from "../../SelectorUbicacionArgentina/SelectorUbicacionArgentina";
import { useHabitosPreferencias } from "../../../hooks/useHabitosPreferencias";
import { SelectorHabitosPreferencias } from "../../HabitosPreferencias/SelectorHabitosPreferencias";

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
}) => {
  const [arrastrando, setArrastrando] = useState(false);
  const [errorFoto, setErrorFoto] = useState("");
  const [arrastrándoFoto, setArrastrandoFoto] = useState<number | null>(null);
  const [sobreIndiceFoto, setSobreIndiceFoto] = useState<number | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [reglasTexto, setReglasTexto] = useState(
  publicacion.reglas?.join("\n") ?? ""
);

  const MAX_FOTOS = 10;
  const TAMANO_MAX = 5 * 1024 * 1024; 
  const TIPOS_PERMITIDOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


  const {
  habitos,
  preferencias,
  toggleHabito,
  togglePreferencia,
  cargando: cargandoPerfil,
  error: errorPerfil,
} = useHabitosPreferencias({
  habitosIniciales: publicacion.habitos,
  preferenciasIniciales: publicacion.preferencias,
  cargarDesdePerfil: modo === 'crear',
});
 
  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validarArchivo = (file: File): string | null => {
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return "Solo se permiten imágenes JPG, PNG o WebP";
    }
    if (file.size > TAMANO_MAX) {
      return "La imagen no debe superar 5MB";
    }
    return null;
  };

  const procesarArchivos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setErrorFoto("");

    const fotosActuales = publicacion.foto.length;
    const espacioDisponible = MAX_FOTOS - fotosActuales;

    if (espacioDisponible <= 0) {
      setErrorFoto(`Ya alcanzaste el límite de ${MAX_FOTOS} fotos`);
      return;
    }

    const archivosArray = Array.from(files).slice(0, espacioDisponible);
    const nuevasFotos: string[] = [];

    for (const file of archivosArray) {
      const errorValidacion = validarArchivo(file);
      if (errorValidacion) {
        setErrorFoto(errorValidacion);
        continue;
      }

      try {
        const base64 = await convertirABase64(file);
        nuevasFotos.push(base64);
      } catch (err) {
        setErrorFoto("Error al procesar la imagen");
      }
    }

    if (nuevasFotos.length > 0) {
      onFotosChange([...publicacion.foto, ...nuevasFotos]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    procesarArchivos(e.target.files);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    procesarArchivos(e.dataTransfer.files);
  };

  const handleEliminarFoto = (index: number) => {
    const nuevasFotos = publicacion.foto.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
  };

  const handleClickZona = () => {
    if (!loading && publicacion.foto.length < MAX_FOTOS) {
      inputFileRef.current?.click();
    }
  };


  const handleDragStartFoto = (index: number) => {
    setArrastrandoFoto(index);
  };

  const handleDragOverFoto = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (arrastrándoFoto !== null && arrastrándoFoto !== index) {
      setSobreIndiceFoto(index);
    }
  };

  const handleDragLeaveFoto = () => {
    setSobreIndiceFoto(null);
  };

  const handleDropFoto = (e: React.DragEvent, indexDestino: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (arrastrándoFoto === null || arrastrándoFoto === indexDestino) {
      setArrastrandoFoto(null);
      setSobreIndiceFoto(null);
      return;
    }

    const nuevasFotos = [...publicacion.foto];
    const [fotoMovida] = nuevasFotos.splice(arrastrándoFoto, 1);
    nuevasFotos.splice(indexDestino, 0, fotoMovida);
    
    onFotosChange(nuevasFotos);
    setArrastrandoFoto(null);
    setSobreIndiceFoto(null);
  };

  const handleDragEndFoto = () => {
    setArrastrandoFoto(null);
    setSobreIndiceFoto(null);
  };

  const moverFotoAInicio = (index: number) => {
    if (index === 0) return;
    const nuevasFotos = [...publicacion.foto];
    const [fotoMovida] = nuevasFotos.splice(index, 1);
    nuevasFotos.unshift(fotoMovida);
    onFotosChange(nuevasFotos);
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

            {/* FOTOS - NUEVA VERSIÓN */}
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

                {/* Zona de subida con Drag & Drop */}
                <div
                  className={`border-2 border-dashed rounded p-4 mb-3 text-center ${
                    arrastrando ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
                  } ${loading || publicacion.foto.length >= MAX_FOTOS ? "opacity-50" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleClickZona}
                  style={{ 
                    cursor: loading || publicacion.foto.length >= MAX_FOTOS ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    disabled={loading || publicacion.foto.length >= MAX_FOTOS}
                  />
                  
                  <div style={{ fontSize: "3rem" }} className="mb-2">
                    {arrastrando ? "📂" : "📤"}
                  </div>
                  
                  <h6 className="mb-2">
                    {arrastrando
                      ? "¡Suelta las imágenes aquí!"
                      : "Arrastra imágenes o haz clic para seleccionar"}
                  </h6>
                  
                  <p className="text-muted small mb-0">
                    JPG, PNG o WebP • Máximo 5MB por imagen • Hasta {MAX_FOTOS} fotos
                  </p>
                  
                  {publicacion.foto.length > 0 && (
                    <p className="text-primary small mb-0 mt-2">
                      <strong>{publicacion.foto.length}/{MAX_FOTOS}</strong> fotos agregadas
                    </p>
                  )}
                </div>

                {/* Mensaje de error */}
                {errorFoto && (
                  <div className="alert alert-danger py-2 mb-3">
                    ⚠️ {errorFoto}
                  </div>
                )}

                {/* Botón alternativo */}
                <div className="d-grid mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => inputFileRef.current?.click()}
                    disabled={loading || publicacion.foto.length >= MAX_FOTOS}
                  >
                    📁 Seleccionar Archivos
                  </button>
                </div>

                {/* Vista previa de fotos */}
                {publicacion.foto.length > 0 ? (
                  <>
                    <div className="alert alert-success py-2 mb-3">
                      <small>
                        💡 <strong>Tip:</strong> Arrastra las fotos para cambiar el orden. La primera será la principal.
                      </small>
                    </div>
                    <div className="row g-3">
                      {publicacion.foto.map((foto, index) => (
                        <div key={index} className="col-sm-6 col-md-4">
                          <div 
                            className={`card h-100 shadow-sm ${
                              arrastrándoFoto === index ? "opacity-50 border-primary border-2" : ""
                            } ${
                              sobreIndiceFoto === index ? "border-success border-3" : "border-0"
                            }`}
                            draggable={!loading}
                            onDragStart={() => handleDragStartFoto(index)}
                            onDragOver={(e) => handleDragOverFoto(e, index)}
                            onDragLeave={handleDragLeaveFoto}
                            onDrop={(e) => handleDropFoto(e, index)}
                            onDragEnd={handleDragEndFoto}
                            style={{
                              cursor: loading ? "default" : "move",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div className="position-relative">
                              <img
                                src={foto}
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
                                  ⭐ Principal
                                </span>
                              )}
                              <span className="badge bg-dark position-absolute top-0 end-0 m-2">
                                #{index + 1}
                              </span>
                            </div>
                            <div className="card-body p-2">
                              <div className="d-grid gap-1">
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => moverFotoAInicio(index)}
                                    disabled={loading}
                                    title="Hacer principal"
                                  >
                                    ⭐ Hacer principal
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleEliminarFoto(index)}
                                  disabled={loading}
                                >
                                  🗑️ Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
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
  onChange={(e) => setReglasTexto(e.target.value)}
  rows={4}
  maxLength={500}
  disabled={loading}
  placeholder={`• No se permiten mascotas
• No fumar en espacios comunes
• Horario de silencio: 22:00 - 8:00`}
/>

                <div className="form-text">
                  Escribe una regla por línea. Máximo 500 caracteres.
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA LATERAL */}
          <div className="col-lg-4">
            {cargandoPerfil && (
                <div className="alert alert-info">
                  <span className="spinner-border spinner-border-sm me-2" />
                  Cargando tus datos del perfil...
                </div>
              )}
              
              {errorPerfil && (
                <div className="alert alert-warning">
                  No se pudieron cargar tus datos previos. Puedes seleccionarlos manualmente.
                </div>
              )}

              <SelectorHabitosPreferencias
                habitos={habitos}
                preferencias={preferencias}
                onHabitoChange={toggleHabito}
                onPreferenciaChange={togglePreferencia}
                disabled={loading}
                compact={false}
              />        
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
                    {loading
                      ? "Publicando..."
                      : modo === "crear"
                      ? "Publicar"
                      : "Guardar cambios"}
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
      </form>
    </div>
  );
};

export default FormularioPublicacion;