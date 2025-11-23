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
    const nuevasOpciones = habitos.includes(opcion)
      ? habitos.filter(o => o !== opcion)
      : [...habitos, opcion];
    setHabitos(nuevasOpciones);
  };

  const toggleOpcionPreferencia = (opcion: PreferenciaKey) => {
    const nuevasOpciones = preferencias.includes(opcion)
      ? preferencias.filter(o => o !== opcion)
      : [...preferencias, opcion];
    setPreferencias(nuevasOpciones);
  };

  const MAX_DESCRIPCION = 500;
  const caracteresRestantes = MAX_DESCRIPCION - descripcion.length;

  return (
    <div className="form-container-segundo">
      <h2>Completá tu perfil</h2>
      <p className="form-subtitle">Esta información es opcional pero ayuda a encontrar mejores compañeros</p>
      
      <form onSubmit={handleSubmit}>
        {/* Edad */}
        <div className="form-group">
          <label htmlFor="edad">
            Edad <span className="required">*</span>
          </label>
          <input
            id="edad"
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
          <label htmlFor="genero">Género</label>
          <select
            id="genero"
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
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            placeholder="Ej: Hola, soy Juan. Estoy buscando compañero de alquiler en La Plata. Me gusta la música, soy ordenado y respetuoso..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={MAX_DESCRIPCION}
            rows={4}
            disabled={loading}
          />
          <small className={caracteresRestantes < 50 ? "warning" : ""}>
            {caracteresRestantes} caracteres restantes
          </small>
        </div>

        {/* Hábitos */}
        <div className="form-section">
          <h4>Tus hábitos</h4>
          <p className="section-description">
            Seleccioná solo lo que realmente hacés o te describe
          </p>
          <div className="opciones-grid">
            {OPCIONES_HABITOS.map((opcion) => (
              <label 
                key={opcion} 
                className={`opcion-item ${habitos.includes(opcion) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={habitos.includes(opcion)}
                  onChange={() => toggleOpcionHabito(opcion)}
                  disabled={loading}
                />
                <span>{LABELS_HABITOS[opcion]}</span>
              </label>
            ))}
          </div>
          {habitos.length > 0 && (
            <small className="selected-count">
              {habitos.length} {habitos.length === 1 ? 'hábito seleccionado' : 'hábitos seleccionados'}
            </small>
          )}
        </div>

        {/* Preferencias */}
        <div className="form-section">
          <h4>Tus preferencias</h4>
          <p className="section-description">
            Seleccioná las características que aceptás en tu compañero
          </p>
          <div className="opciones-grid">
            {OPCIONES_PREFERENCIAS.map((opcion) => (
              <label 
                key={opcion} 
                className={`opcion-item ${preferencias.includes(opcion) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={preferencias.includes(opcion)}
                  onChange={() => toggleOpcionPreferencia(opcion)}
                  disabled={loading}
                />
                <span>{LABELS_PREFERENCIAS[opcion]}</span>
              </label>
            ))}
          </div>
          {preferencias.length > 0 && (
            <small className="selected-count">
              {preferencias.length} {preferencias.length === 1 ? 'preferencia seleccionada' : 'preferencias seleccionadas'}
            </small>
          )}
        </div>

        {/* Botones */}
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