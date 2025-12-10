import React, { useMemo } from "react";
import { 
  LABELS_HABITOS, 
  LABELS_PREFERENCIAS, 
  OPCIONES_HABITOS, 
  OPCIONES_PREFERENCIAS, 
  type HabitosUsuario, 
  type PreferenciasUsuario 
} from '../../modelos/Usuario';

interface SelectorHabitosPreferenciasProps {
  habitos?: HabitosUsuario;
  preferencias?: PreferenciasUsuario;
  onHabitoChange: (key: keyof HabitosUsuario) => void;
  onPreferenciaChange: (key: keyof PreferenciasUsuario) => void;
  disabled?: boolean;
  mostrarTitulos?: boolean;
  compact?: boolean;
}

const normalizar = <T extends Record<string, boolean | undefined>>(
  obj: T | undefined,
  keys: readonly string[]
): Record<string, boolean> => 
  keys.reduce((acc, key) => {
    acc[key] = obj?.[key] ?? false;
    return acc;
  }, {} as Record<string, boolean>);

export const SelectorHabitosPreferencias: React.FC<SelectorHabitosPreferenciasProps> = ({
  habitos,
  preferencias,
  onHabitoChange,
  onPreferenciaChange,
  disabled = false,
  mostrarTitulos = true,
  compact = false,
}) => {

  // 🔥 Memoizar para evitar recalcular en cada render
  const habitosNorm = useMemo(
    () => normalizar(habitos, OPCIONES_HABITOS),
    [habitos]
  );

  const prefsNorm = useMemo(
    () => normalizar(preferencias, OPCIONES_PREFERENCIAS),
    [preferencias]
  );

  return (
    <>
      {/* HÁBITOS */}
      <div className={compact ? "mb-3" : "card shadow-sm mb-4"}>
        {mostrarTitulos && (
          compact ? (
            <h6 className="mb-2">🌟 Tus Hábitos</h6>
          ) : (
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">🌟 Tus Hábitos</h5>
            </div>
          )
        )}
        <div className={compact ? "" : "card-body"}>
          {!compact && (
            <p className="text-muted small mb-3">
              Describe tu estilo de vida para encontrar mejor match
            </p>
          )}
          <div className="d-flex flex-column gap-2">
            {OPCIONES_HABITOS.map((key) => (
              <div key={key} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`hab-${key}`}
                  checked={habitosNorm[key]}
                  onChange={() => onHabitoChange(key)}
                  disabled={disabled}
                />
                <label className="form-check-label" htmlFor={`hab-${key}`}>
                  {LABELS_HABITOS[key]}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREFERENCIAS */}
      <div className={compact ? "mb-3" : "card shadow-sm mb-4"}>
        {mostrarTitulos && (
          compact ? (
            <h6 className="mb-2">👤 Preferencias del Compañero</h6>
          ) : (
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">👤 Preferencias del Compañero</h5>
            </div>
          )
        )}
        <div className={compact ? "" : "card-body"}>
          {!compact && (
            <p className="text-muted small mb-3">
              Selecciona las características que buscas en tu compañero ideal
            </p>
          )}
          <div className="d-flex flex-column gap-2">
            {OPCIONES_PREFERENCIAS.map((key) => (
              <div key={key} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`pref-${key}`}
                  checked={prefsNorm[key]}
                  onChange={() => onPreferenciaChange(key)}
                  disabled={disabled}
                />
                <label className="form-check-label" htmlFor={`pref-${key}`}>
                  {LABELS_PREFERENCIAS[key]}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};