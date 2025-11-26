import React, { useState, useRef } from "react";

interface SubidorFotosProps {
  fotos: string[];
  onFotosChange: (fotos: string[]) => void;
  loading?: boolean;
  maxFotos?: number;
}

export const SubidorFotos: React.FC<SubidorFotosProps> = ({
  fotos,
  onFotosChange,
  loading = false,
  maxFotos = 10,
}) => {
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const TAMANO_MAX = 5 * 1024 * 1024; // 5MB
  const TIPOS_PERMITIDOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

    setError("");

    const fotosActuales = fotos.length;
    const espacioDisponible = maxFotos - fotosActuales;

    if (espacioDisponible <= 0) {
      setError(`Ya alcanzaste el límite de ${maxFotos} fotos`);
      return;
    }

    const archivosArray = Array.from(files).slice(0, espacioDisponible);
    const nuevasFotos: string[] = [];

    for (const file of archivosArray) {
      const errorValidacion = validarArchivo(file);
      if (errorValidacion) {
        setError(errorValidacion);
        continue;
      }

      try {
        const base64 = await convertirABase64(file);
        nuevasFotos.push(base64);
      } catch (err) {
        setError("Error al procesar la imagen");
      }
    }

    if (nuevasFotos.length > 0) {
      onFotosChange([...fotos, ...nuevasFotos]);
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
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
  };

  const handleClickZona = () => {
    if (!loading && fotos.length < maxFotos) {
      inputFileRef.current?.click();
    }
  };

  return (
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

        {/* Zona de subida */}
        <div
          className={`border-2 border-dashed rounded p-4 mb-3 text-center ${
            arrastrando ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
          } ${loading || fotos.length >= maxFotos ? "opacity-50" : "cursor-pointer"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickZona}
          style={{ 
            cursor: loading || fotos.length >= maxFotos ? "not-allowed" : "pointer",
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
            disabled={loading || fotos.length >= maxFotos}
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
            JPG, PNG o WebP • Máximo 5MB por imagen • Hasta {maxFotos} fotos
          </p>
          
          {fotos.length > 0 && (
            <p className="text-primary small mb-0 mt-2">
              <strong>{fotos.length}/{maxFotos}</strong> fotos agregadas
            </p>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-danger py-2 mb-3">
            ⚠️ {error}
          </div>
        )}

        {/* Botón alternativo */}
        <div className="d-grid mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => inputFileRef.current?.click()}
            disabled={loading || fotos.length >= maxFotos}
          >
            📁 Seleccionar Archivos
          </button>
        </div>

        {/* Vista previa de fotos */}
        {fotos.length > 0 ? (
          <div className="row g-3">
            {fotos.map((foto, index) => (
              <div key={index} className="col-sm-6 col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="card-img-top"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                    {index === 0 && (
                      <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                        ⭐ Principal
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
  );
};
