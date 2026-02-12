import React from "react";
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
  const [edadFocused, setEdadFocused] = React.useState(false);
  const [descripcionFocused, setDescripcionFocused] = React.useState(false);

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
  const porcentajeUsado = ((descripcion.length / MAX_DESCRIPCION) * 100);


  const generoIconos: Record<Genero, string> = {
    "Masculino": "♂️",
    "Femenino": "♀️",
    "Prefiero no decir": "👤"
  };

  return (
    <form onSubmit={handleSubmit} className="form-container form-moderno form-perfil">
      <div className="form-header">
        <h2 className="form-title">Completá tu perfil</h2>
        <p className="form-subtitle">Paso 2 de 2 • Información personal</p>
      </div>

      {/* Stepper visual */}
      <div className="stepper">
        <div className="step completed">
          <div className="step-circle">✓</div>
          <span className="step-label">Cuenta</span>
        </div>
        <div className="step-line active"></div>
        <div className="step active">
          <div className="step-circle">2</div>
          <span className="step-label">Perfil</span>
        </div>
      </div>

      <div className="form-body">
        {/* Edad y Género en una fila */}
        <div className="form-row">
          <div className={`form-group-modern half ${edadFocused ? 'focused' : ''} ${edad ? 'filled' : ''}`}>
            <label className="floating-label">Edad</label>
            <div className="input-wrapper">
              <span className="input-icon">🎂</span>
              <input
                type="number"
                placeholder="25"
                value={edad || ''}
                onChange={(e) => setEdad(Number(e.target.value))}
                onFocus={() => setEdadFocused(true)}
                onBlur={() => setEdadFocused(false)}
                required
                min={18}
                max={100}
                disabled={loading}
                className="modern-input"
              />
            </div>
          </div>

          <div className={`form-group-modern half ${genero !== 'Prefiero no decir' ? 'filled' : ''}`}>
            <label className="floating-label">Género</label>
            <div className="input-wrapper">
              <span className="input-icon">{generoIconos[genero]}</span>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value as Genero)}
                disabled={loading}
                className="modern-select"
              >
                <option value="Prefiero no decir">Prefiero no decir</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>
        </div>


        <div className={`form-group-modern ${descripcionFocused ? 'focused' : ''} ${descripcion ? 'filled' : ''}`}>
          <label className="floating-label">Sobre vos (opcional)</label>
          <div className="textarea-wrapper">
            <textarea
              placeholder="Contanos un poco sobre vos, tus intereses, qué te gusta hacer..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onFocus={() => setDescripcionFocused(true)}
              onBlur={() => setDescripcionFocused(false)}
              maxLength={MAX_DESCRIPCION}
              rows={4}
              disabled={loading}
              className="modern-textarea"
            />
          </div>
          <div className="character-counter">
            <div className="counter-bar">
              <div 
                className="counter-fill"
                style={{ 
                  width: `${porcentajeUsado}%`,
                  backgroundColor: restantes < 50 ? '#dc3545' : restantes < 100 ? '#ffc107' : '#007bff'
                }}
              ></div>
            </div>
            <span className={`counter-text ${restantes < 50 ? 'warning' : ''}`}>
              {restantes} caracteres restantes
            </span>
          </div>
        </div>

        {/* Hábitos */}
        <div className="selection-section">
          <div className="section-header">
            <h3> Tus hábitos</h3>
            <p>Seleccioná lo que realmente te describe</p>
            <span className="selection-badge">{habitos.length} seleccionados</span>
          </div>

          <div className="options-grid">
            {OPCIONES_HABITOS.map((op) => (
              <label
                key={op}
                className={`option-card ${habitos.includes(op) ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={habitos.includes(op)}
                  onChange={() => toggleOpcionHabito(op)}
                  disabled={loading}
                  className="option-checkbox"
                />
                <span className="option-checkmark">
                  {habitos.includes(op) ? '✓' : '+'}
                </span>
                <span className="option-label">{LABELS_HABITOS[op]}</span>
                <div className="option-glow"></div>
              </label>
            ))}
          </div>
        </div>

        {/* Preferencias */}
        <div className="selection-section">
          <div className="section-header">
            <h3> Tus preferencias</h3>
            <p>¿Qué aceptás en tu compañero?</p>
            <span className="selection-badge">{preferencias.length} seleccionadas</span>
          </div>

          <div className="options-grid">
            {OPCIONES_PREFERENCIAS.map((op) => (
              <label
                key={op}
                className={`option-card ${preferencias.includes(op) ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={preferencias.includes(op)}
                  onChange={() => toggleOpcionPreferencia(op)}
                  disabled={loading}
                  className="option-checkbox"
                />
                <span className="option-checkmark">
                  {preferencias.includes(op) ? '✓' : '+'}
                </span>
                <span className="option-label">{LABELS_PREFERENCIAS[op]}</span>
                <div className="option-glow"></div>
              </label>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancelar}
            disabled={loading}
            className="btn-secondary-modern"
          >
            <span className="btn-arrow">←</span>
            <span>Volver</span>
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-modern btn-complete"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Registrando...
              </>
            ) : (
              <>
                <span>Completar registro</span>
                <span className="btn-arrow">✓</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SegundoFormRegistro;
