import React from "react";

interface CampoTextAreaProps {
  label: string;
  name: string;
  value: string;
  esSoloVista: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  textoVacio?: string;
}

const CampoTextArea: React.FC<CampoTextAreaProps> = ({
  label,
  name,
  value,
  esSoloVista,
  onChange,
  placeholder = "",
  textoVacio = "Sin descripción",
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
        />
      )}
    </div>
  );
};

export default CampoTextArea;