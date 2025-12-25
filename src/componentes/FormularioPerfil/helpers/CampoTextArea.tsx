import React from "react";

interface CampoTextAreaProps {
  label: string;
  name: string;
  value: string;
  esSoloVista: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  textoVacio?: string;
  rows?: number;
}

const CampoTextArea: React.FC<CampoTextAreaProps> = ({
  label,
  name,
  value,
  esSoloVista,
  onChange,
  placeholder = "",
  textoVacio = "Sin descripción",
  rows = 3,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {esSoloVista ? (
        <p className="form-control-plaintext">{value || textoVacio}</p>
      ) : (
        <textarea
          name={name}
          className="form-control"
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </div>
  );
};

export default CampoTextArea;