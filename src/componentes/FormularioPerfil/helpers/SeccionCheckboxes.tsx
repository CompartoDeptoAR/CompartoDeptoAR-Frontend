
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

function SeccionCheckboxes<T>({
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
          <div className="row g-2">
            {config.map(({ key, label }) => (
              <div key={String(key)} className="col-12 col-md-6">
                <div className="form-check d-flex align-items-center">
                  <input
                    type="checkbox"
                    id={`checkbox-${String(key)}`}
                    className="form-check-input me-2 flex-shrink-0"
                    style={{ width: '20px', height: '20px' }}
                    checked={Boolean(datos?.[key])}
                    onChange={() => onToggle(key)}
                  />
                  <label 
                    htmlFor={`checkbox-${String(key)}`}
                    className="form-check-label mb-0"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    {label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}

export default SeccionCheckboxes;