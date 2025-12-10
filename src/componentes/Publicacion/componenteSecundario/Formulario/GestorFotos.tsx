import useGestionFotos from "../../../../hooks/componente/publicacion/useGestionFotos";

interface GestorFotosProps {
  fotos: string[];
  onFotosChange: (fotos: string[]) => void;
  disabled?: boolean;
  titulo?: string; // <- nuevo prop opcional para el título
}

const GestorFotos: React.FC<GestorFotosProps> = ({ fotos, onFotosChange, disabled = false, titulo }) => {
  const {
    arrastrando,
    errorFoto,
    arrastrándoFoto,
    sobreIndiceFoto,
    inputFileRef,
    MAX_FOTOS,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleEliminarFoto,
    moverFotoAInicio,
    handleDragStartFoto,
    handleDragOverFoto,
    handleDragLeaveFoto,
    handleDropFoto,
    handleDragEndFoto,
  } = useGestionFotos(fotos, onFotosChange);

  const handleClickZona = () => {
    if (!disabled && fotos.length < MAX_FOTOS) {
      inputFileRef.current?.click();
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">{titulo || "📸 Fotos de la Propiedad"}</h5>
      </div>
      <div className="card-body">
        <div
          className={`border-2 border-dashed rounded p-4 mb-3 text-center ${
            arrastrando ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
          } ${disabled || fotos.length >= MAX_FOTOS ? "opacity-50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickZona}
          style={{
            cursor: disabled || fotos.length >= MAX_FOTOS ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <input
            ref={inputFileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={disabled || fotos.length >= MAX_FOTOS}
          />

          <div style={{ fontSize: "3rem" }} className="mb-2">
            {arrastrando ? "📂" : "📤"}
          </div>

          <h6 className="mb-2">
            {arrastrando ? "¡Suelta las imágenes aquí!" : "Arrastra imágenes o haz clic para seleccionar"}
          </h6>

          <p className="text-muted small mb-0">
            JPG, PNG o WebP • Máximo 5MB por imagen • Hasta {MAX_FOTOS} fotos
          </p>

          {fotos.length > 0 && (
            <p className="text-primary small mb-0 mt-2">
              <strong>{fotos.length}/{MAX_FOTOS}</strong> fotos agregadas
            </p>
          )}
        </div>

        {errorFoto && (
          <div className="alert alert-danger py-2 mb-3">⚠️ {errorFoto}</div>
        )}

        <div className="d-grid mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => inputFileRef.current?.click()}
            disabled={disabled || fotos.length >= MAX_FOTOS}
          >
            📁 Seleccionar Archivos
          </button>
        </div>

        {fotos.length > 0 ? (
          <>
            <div className="alert alert-success py-2 mb-3">
              <small>
                💡 <strong>Tip:</strong> Arrastra las fotos para cambiar el orden. La primera será la principal.
              </small>
            </div>
            <div className="row g-3">
              {fotos.map((foto, index) => (
                <div key={index} className="col-sm-6 col-md-4">
                  <div
                    className={`card h-100 shadow-sm ${
                      arrastrándoFoto === index ? "opacity-50 border-primary border-2" : ""
                    } ${sobreIndiceFoto === index ? "border-success border-3" : "border-0"}`}
                    draggable={!disabled}
                    onDragStart={() => handleDragStartFoto(index)}
                    onDragOver={(e) => handleDragOverFoto(e, index)}
                    onDragLeave={handleDragLeaveFoto}
                    onDrop={(e) => handleDropFoto(e, index)}
                    onDragEnd={handleDragEndFoto}
                    style={{
                      cursor: disabled ? "default" : "move",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div className="position-relative">
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
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
                            disabled={disabled}
                            title="Hacer principal"
                          >
                            ⭐ Hacer principal
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEliminarFoto(index)}
                          disabled={disabled}
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
            <p className="mb-0 text-muted">Aún no has agregado fotos. ¡Agrega al menos una!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestorFotos;
