import React, { useState } from "react";
import noimage from "../../../../assets/noimage.png";

interface GaleriaPublicacionProps {
  fotos: string[];
}

const GaleriaPublicacion: React.FC<GaleriaPublicacionProps> = ({ fotos }) => {
  const [fotoActual, setFotoActual] = useState(0);
  const esMobile = window.innerWidth < 992;

  if (!fotos || fotos.length === 0) {
    return <img src={noimage} className="img-fluid rounded mb-4" alt="Sin imagen" />;
  }

  return (
    <>
      {!esMobile && (
        <div className="fotos-ml-container">
          <div className="fotos-thumbs">
            {fotos.map((foto, index) => (
              <img
                key={index}
                src={foto}
                className={`thumb-img ${fotoActual === index ? "thumb-active" : ""}`}
                onClick={() => setFotoActual(index)}
                onError={(e) => (e.currentTarget.src = noimage)}
              />
            ))}
          </div>

          <div className="fotos-principal">
            <img
              src={fotos[fotoActual]}
              className="foto-grande"
              onError={(e) => (e.currentTarget.src = noimage)}
            />
          </div>
        </div>
      )}

      {esMobile && (
        <div className="position-relative">
          <img
            src={fotos[fotoActual]}
            className="img-fluid rounded"
            onError={(e) => (e.currentTarget.src = noimage)}
          />

          <div className="contador-fotos">
            {fotoActual + 1} / {fotos.length}
          </div>

          {fotoActual > 0 && (
            <button className="btn-nav left" onClick={() => setFotoActual(fotoActual - 1)}>
              ‹
            </button>
          )}

          {fotoActual < fotos.length - 1 && (
            <button className="btn-nav right" onClick={() => setFotoActual(fotoActual + 1)}>
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default GaleriaPublicacion;
