interface CampoTextoProps {
  label: string;
  name: string;
  value: string | number;
  type?: "text" | "number";
  esSoloVista: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
}

const CampoTexto: React.FC<CampoTextoProps> = ({
  label,
  name,
  value,
  type = "text",
  esSoloVista,
  onChange,
  required = false,
  min,
  max,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {esSoloVista ? (
        <p className="form-control-plaintext">{value}</p>
      ) : (
        <input
          type={type}
          name={name}
          className="form-control"
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
        />
      )}
    </div>
  );
};

export default CampoTexto;