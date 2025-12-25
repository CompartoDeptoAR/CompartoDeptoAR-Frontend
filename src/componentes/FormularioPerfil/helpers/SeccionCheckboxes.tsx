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
  isMobile?: boolean; // Nueva prop para responsive
}

function SeccionCheckboxes<T>({
  titulo,
  config,
  datos,
  esSoloVista,
  onToggle,
  textoVacio = "Sin elementos especificados",
  isMobile = false,
}: SeccionCheckboxesProps<T>) {
  const tieneAlgunValorTrue = datos && Object.values(datos).some((v) => v === true);

  return (
    <div className="mb-3" style={{ marginBottom: isMobile ? "20px" : "25px" }}>
      <fieldset className="border p-3 rounded" style={{ 
        borderColor: "#dee2e6", 
        padding: isMobile ? "12px" : "16px",
        borderRadius: "8px"
      }}>
        <legend className="fs-6" style={{ 
          fontSize: isMobile ? "15px" : "16px", 
          fontWeight: "600", 
          color: "#495057",
          padding: "0 8px",
          width: "auto",
          float: "none",
          marginBottom: "10px"
        }}>
          {titulo}
        </legend>
        
        {esSoloVista ? (
          <ul style={{ 
            listStyleType: "none", 
            padding: 0, 
            margin: 0,
            columns: isMobile ? 1 : 2,
            columnGap: isMobile ? "0" : "20px"
          }}>
            {config.map(({ key, label }) =>
              datos?.[key] ? (
                <li key={String(key)} style={{ 
                  marginBottom: "6px",
                  paddingLeft: "20px",
                  position: "relative",
                  fontSize: isMobile ? "14px" : "15px",
                  color: "#495057"
                }}>
                  <span style={{
                    position: "absolute",
                    left: "0",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#28a745",
                    borderRadius: "50%",
                    display: "inline-block"
                  }}></span>
                  {label}
                </li>
              ) : null
            )}
            {!tieneAlgunValorTrue && (
              <li style={{ 
                fontSize: isMobile ? "14px" : "15px", 
                color: "#6c757d", 
                fontStyle: "italic",
                marginTop: "5px"
              }}>
                {textoVacio}
              </li>
            )}
          </ul>
        ) : (
          <div className="row g-2" style={{ 
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? "10px" : "12px",
            margin: "0"
          }}>
            {config.map(({ key, label }) => (
              <div key={String(key)} style={{ 
                display: "flex", 
                alignItems: "center",
                padding: isMobile ? "6px 0" : "8px 0"
              }}>
                <input
                  type="checkbox"
                  id={`checkbox-${String(key)}`}
                  className="form-check-input me-2 flex-shrink-0"
                  style={{ 
                    width: isMobile ? "18px" : "20px",
                    height: isMobile ? "18px" : "20px",
                    marginRight: "10px",
                    cursor: "pointer",
                    accentColor: "#28a745",
                    flexShrink: "0"
                  }}
                  checked={Boolean(datos?.[key])}
                  onChange={() => onToggle(key)}
                />
                <label 
                  htmlFor={`checkbox-${String(key)}`}
                  style={{ 
                    cursor: "pointer", 
                    userSelect: "none",
                    fontSize: isMobile ? "14px" : "15px",
                    color: "#495057",
                    margin: "0",
                    lineHeight: "1.4",
                    flex: "1"
                  }}
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}

export default SeccionCheckboxes;