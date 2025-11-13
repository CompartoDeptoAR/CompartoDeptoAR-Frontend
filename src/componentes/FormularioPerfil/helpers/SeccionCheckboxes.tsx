
interface ConfigCheckbox<T> {
  key: keyof T;
  label: string;
}

interface SeccionCheckboxesProps<T> {
  titulo: string;
  config: ConfigCheckbox<T>[];
  datos: T | undefined;
  esSoloVista: boolean;
  onToggle: (key: keyof T) => void;
  textoVacio?: string;
}

function SeccionCheckboxes<T extends Record<string, boolean | undefined>>({
  titulo,
  config,
  datos,
  esSoloVista,
  onToggle,
  textoVacio = "Sin elementos especificados",
}: SeccionCheckboxesProps<T>) {
  const tieneAlgunValorTrue = datos && Object.values(datos).some((v) => v === true);

  return (
    <div className="mb-3">
      <fieldset className="border p-3 rounded">
        <legend className="fs-6">{titulo}</legend>
        {esSoloVista ? (
          <ul>
            {config.map(({ key, label }) =>
              datos?.[key] ? <li key={String(key)}>{label}</li> : null
            )}
            {!tieneAlgunValorTrue && <li>{textoVacio}</li>}
          </ul>
        ) : (
          <div className="row">
            {config.map(({ key, label }) => (
              <div key={String(key)} className="col-6 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={datos?.[key] || false}
                  onChange={() => onToggle(key)}
                />
                <label className="form-check-label">{label}</label>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}

export default SeccionCheckboxes;