import type React from "react";
import {
  OPCIONES_HABITOS,
  OPCIONES_PREFERENCIAS,
  LABELS_HABITOS,
  LABELS_PREFERENCIAS,
  type Genero,
  type HabitoKey,
  type PreferenciaKey
} from "../../../modelos/Usuario";


interface SegundoFormRegistroProps {
  edad: number;
  genero: Genero;
  descripcion: string;
  habitos: HabitoKey[];
  preferencias: PreferenciaKey[];
  setEdad: (value: number) => void;
  setGenero: (value: Genero) => void;
  setDescripcion: (value: string) => void;
  setHabitos: (value: HabitoKey[]) => void;
  setPreferencias: (value: PreferenciaKey[]) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancelar: () => void;
  loading?: boolean;
}

const SegundoFormRegistro: React.FC<SegundoFormRegistroProps> = ({
  edad,
  genero,
  descripcion,
  habitos,
  preferencias,
  setEdad,
  setGenero,
  setDescripcion,
  setHabitos,
  setPreferencias,
  handleSubmit,
  onCancelar,
  loading = false,
}) => {
  const toggleOpcionHabito = (opcion: HabitoKey) => {
    setHabitos(
      habitos.includes(opcion)
        ? habitos.filter(o => o !== opcion)
        : [...habitos, opcion]
    );
  };

  const toggleOpcionPreferencia = (opcion: PreferenciaKey) => {
    setPreferencias(
      preferencias.includes(opcion)
        ? preferencias.filter(o => o !== opcion)
        : [...preferencias, opcion]
    );
  };

  const MAX_DESCRIPCION = 500;
  const restantes = MAX_DESCRIPCION - descripcion.length;

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="form-container form-AZUL form-container-mas-ancho" >
        <h2 style={{ marginBottom: "1rem", color: "#333" }}>Completá tu perfil</h2>
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          Esta información ayuda a encontrar mejores compañeros
        </p>

        {/* Edad */}
        <div style={{ textAlign: "left" }}>
        <label style={{ textAlign: "left", display: "block", width: "100%" }}>Edad*</label>
          <input
            type="number"
            placeholder="Ej: 25"
            value={edad || ''}
            onChange={(e) => setEdad(Number(e.target.value))}
            required
            min={18}
            max={100}
            disabled={loading}
          />
        </div>

        {/* Género */}
      <div style={{ textAlign: "left" }}>
        <label style={{ textAlign: "left", display: "block", width: "100%" }}>Género</label>
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value as Genero)}
            disabled={loading}
          >
            <option value="Prefiero no decir">Prefiero no decir</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Descripción */}
      <div style={{ textAlign: "left" }}>
        <label style={{ textAlign: "left", display: "block", width: "100%" }}>Descripción</label>
          <textarea
            placeholder="Ej: Hola, soy Juan. Me gusta el deporte, la música y conocer nuevas personas..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={MAX_DESCRIPCION}
            rows={4}
            disabled={loading}
          />
          <small style={{ 
            color: restantes < 50 ? "#dc3545" : "#666", 
            fontSize: "12px", 
            display: "block", 
            textAlign: "right",
            marginTop: "-0.5rem",
            marginBottom: "1rem"
          }}>
            {restantes} caracteres restantes
          </small>
        </div>

        {/* Hábitos */}
        <div style={{ margin: "2rem 0" }}>
          <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>Tus hábitos</h4>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "1rem" }}>
            Seleccioná lo que realmente te describe
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
            {OPCIONES_HABITOS.map((op) => (
              <label
                key={op}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  border: `1px solid ${habitos.includes(op) ? "#007bff" : "#ccc"}`,
                  borderRadius: "0.5rem",
                  backgroundColor: habitos.includes(op) ? "#e7f1ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={habitos.includes(op)}
                  onChange={() => toggleOpcionHabito(op)}
                  disabled={loading}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#007bff"
                  }}
                />
                <span style={{ color: "#333", fontSize: "14px" }}>{LABELS_HABITOS[op]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferencias */}
        <div style={{ margin: "2rem 0" }}>
          <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>Tus preferencias</h4>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "1rem" }}>
            Seleccioná lo que aceptás en tu compañero
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
            {OPCIONES_PREFERENCIAS.map((op) => (
              <label
                key={op}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  border: `1px solid ${preferencias.includes(op) ? "#007bff" : "#ccc"}`,
                  borderRadius: "0.5rem",
                  backgroundColor: preferencias.includes(op) ? "#e7f1ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="checkbox"
                  checked={preferencias.includes(op)}
                  onChange={() => toggleOpcionPreferencia(op)}
                  disabled={loading}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#007bff"
                  }}
                />
                <span style={{ color: "#333", fontSize: "14px" }}>{LABELS_PREFERENCIAS[op]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* BOTONES */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="button"
            onClick={onCancelar}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f8f9fa",
              color: "#495057",
              border: "1px solid #ced4da",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600"
            }}
            disabled={loading}
          >
            Volver
          </button>

          <button
            type="submit"
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600"
            }}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Completar registro"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SegundoFormRegistro;