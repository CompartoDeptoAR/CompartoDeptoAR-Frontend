import React from "react";

interface CampoSelectProps {
  label: string;
  name: string;
  value: string|undefined;
  opciones: { value: string; label: string }[];
  esSoloVista: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  textoVacio?: string;
}

const CampoSelect: React.FC<CampoSelectProps> = ({
  label,
  name,
  value,
  opciones,
  esSoloVista,
  onChange,
  required = false,
  textoVacio = "No especificado",
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {esSoloVista ? (
        <p className="form-control-plaintext">{value || textoVacio}</p>
      ) : (
        <select
          name={name}
          className="form-select"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Seleccione una opción</option>
          {opciones.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CampoSelect;