import { useRef, useEffect } from "react";
import SelectorUbicacionArgentina from "../../../SelectorUbicacionArgentina/SelectorUbicacionArgentina";

interface UbicacionPrecioProps {
  provincia: string;
  localidad: string;
  direccion: string;
  precio: number;
  onProvinciaChange: (provincia: string) => void;
  onLocalidadChange: (localidad: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const UbicacionPrecio: React.FC<UbicacionPrecioProps> = ({
  provincia,
  localidad,
  direccion,
  precio,
  onProvinciaChange,
  onLocalidadChange,
  onChange,
  disabled = false,
}) => {
  const precioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputElement = precioInputRef.current;
    
    if (inputElement) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
      };

      inputElement.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        inputElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">📍 Ubicación y Precio</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <SelectorUbicacionArgentina
            provincia={provincia}
            localidad={localidad}
            onProvinciaChange={onProvinciaChange}
            onLocalidadChange={onLocalidadChange}
            disabled={disabled}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label fw-semibold">
            Dirección (opcional)
          </label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            name="direccion"
            value={direccion}
            onChange={onChange}
            placeholder="Ej: Av. Santa Fe 1234"
            disabled={disabled}
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
              ref={precioInputRef}
              type="number"
              className="form-control"
              id="precio"
              name="precio"
              value={precio === 0 ? "" : precio}
              onChange={onChange}
              min={0}
              step={1000}
              required
              disabled={disabled}
              placeholder="50000"
            />
            <span className="input-group-text bg-light">ARS / mes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbicacionPrecio;