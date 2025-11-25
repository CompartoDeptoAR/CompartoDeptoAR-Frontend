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
import "../../../styles/auth.css";

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
    <div className="form-container-segundo page-transition">
      <h2 className="form-title">Completá tu perfil</h2>
      <p className="form-subtitle">
        Esta información ayuda a encontrar mejores compañeros
      </p>

      <form onSubmit={handleSubmit}>
        {/* Edad */}
        <div className="form-group">
          <label>Edad *</label>
          <input
            type="number"
            placeholder="Ej: 25"
            value={edad}
            onChange={(e) => setEdad(Number(e.target.value))}
            required
            min={18}
            max={100}
            disabled={loading}
          />
        </div>

        {/* Género */}
        <div className="form-group">
          <label>Género</label>
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
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            placeholder="Ej: Hola, soy Juan..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={MAX_DESCRIPCION}
            rows={4}
            disabled={loading}
          />
          <small className={restantes < 50 ? "warning" : ""}>
            {restantes} caracteres restantes
          </small>
        </div>

        {/* Hábitos */}
        <div className="form-section">
          <h4>Tus hábitos</h4>
          <p className="section-description">Seleccioná lo que realmente te describe</p>

          <div className="opciones-grid">
            {OPCIONES_HABITOS.map((op) => (
              <label
                key={op}
                className={`opcion-item ${habitos.includes(op) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={habitos.includes(op)}
                  onChange={() => toggleOpcionHabito(op)}
                  disabled={loading}
                />
                <span>{LABELS_HABITOS[op]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferencias */}
        <div className="form-section">
          <h4>Tus preferencias</h4>
          <p className="section-description">Seleccioná lo que aceptás en tu compañero</p>

          <div className="opciones-grid">
            {OPCIONES_PREFERENCIAS.map((op) => (
              <label
                key={op}
                className={`opcion-item ${preferencias.includes(op) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={preferencias.includes(op)}
                  onChange={() => toggleOpcionPreferencia(op)}
                  disabled={loading}
                />
                <span>{LABELS_PREFERENCIAS[op]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* BOTONES */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancelar}
            className="btn-secondary"
            disabled={loading}
          >
            Volver
          </button>

          <button
            type="submit"
            className="btn-primary"
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
