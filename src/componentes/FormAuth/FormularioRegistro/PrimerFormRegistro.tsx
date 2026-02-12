import React from "react";

interface PrimerFormRegistroProps {
  nombreCompleto: string;
  correo: string;
  contraseña: string;
  mostrarPassword: boolean;
  setNombreCompleto: (value: string) => void;
  setCorreo: (value: string) => void;
  setContraseña: (value: string) => void;
  togglePassword: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
}

const PrimerFormRegistro: React.FC<PrimerFormRegistroProps> = ({
  nombreCompleto,
  correo,
  contraseña,
  mostrarPassword,
  setNombreCompleto,
  setCorreo,
  setContraseña,
  togglePassword,
  handleSubmit,
  onSwitch,
}) => {
  const [nombreFocused, setNombreFocused] = React.useState(false);
  const [correoFocused, setCorreoFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);

  // Validación de contraseña en tiempo real
  const passwordRequirements = {
    length: contraseña.length >= 8,
    uppercase: /[A-Z]/.test(contraseña),
    lowercase: /[a-z]/.test(contraseña),
    number: /\d/.test(contraseña),
  };

  const passwordStrength = Object.values(passwordRequirements).filter(Boolean).length;
  const strengthLabels = ['', 'Débil', 'Media', 'Buena', 'Fuerte'];
  const strengthColors = ['', '#dc3545', '#fd7e14', '#ffc107', '#28a745'];

  return (
    <form onSubmit={handleSubmit} className="form-container form-moderno">
      <div className="form-header">
        <h2 className="form-title">Crear tu cuenta</h2>
        <p className="form-subtitle">Paso 1 de 2 • Información básica</p>
      </div>

      <div className="stepper">
        <div className="step active">
          <div className="step-circle">1</div>
          <span className="step-label">Cuenta</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-circle">2</div>
          <span className="step-label">Perfil</span>
        </div>
      </div>

      <div className="form-body">
        {/* Nombre */}
        <div className={`form-group-modern ${nombreFocused ? 'focused' : ''} ${nombreCompleto ? 'filled' : ''}`}>
          <label className="floating-label">Nombre completo</label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Juan Pérez"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              onFocus={() => setNombreFocused(true)}
              onBlur={() => setNombreFocused(false)}
              required
              minLength={3}
              className="modern-input"
            />
            {nombreCompleto.length >= 3 && (
              <span className="input-check">✓</span>
            )}
          </div>
        </div>

        {/* Correo */}
        <div className={`form-group-modern ${correoFocused ? 'focused' : ''} ${correo ? 'filled' : ''}`}>
          <label className="floating-label">Correo electrónico</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onFocus={() => setCorreoFocused(true)}
              onBlur={() => setCorreoFocused(false)}
              required
              className="modern-input"
            />
            {correo.includes('@') && correo.includes('.') && (
              <span className="input-check">✓</span>
            )}
          </div>
        </div>

        {/* Contraseña */}
        <div className={`form-group-modern ${passwordFocused ? 'focused' : ''} ${contraseña ? 'filled' : ''}`}>
          <label className="floating-label">Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Creá una contraseña segura"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              minLength={8}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
              className="modern-input"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="toggle-password-modern"
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {/* Barra de fuerza de contraseña */}
          {contraseña && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill"
                  style={{ 
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: strengthColors[passwordStrength]
                  }}
                ></div>
              </div>
              <span 
                className="strength-label"
                style={{ color: strengthColors[passwordStrength] }}
              >
                {strengthLabels[passwordStrength]}
              </span>
            </div>
          )}

          {/* Requisitos de contraseña */}
          <div className="password-requirements">
            <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
              <span className="req-icon">{passwordRequirements.length ? '✓' : '○'}</span>
              Al menos 8 caracteres
            </div>
            <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
              <span className="req-icon">{passwordRequirements.uppercase ? '✓' : '○'}</span>
              Una mayúscula
            </div>
            <div className={`requirement ${passwordRequirements.lowercase ? 'met' : ''}`}>
              <span className="req-icon">{passwordRequirements.lowercase ? '✓' : '○'}</span>
              Una minúscula
            </div>
            <div className={`requirement ${passwordRequirements.number ? 'met' : ''}`}>
              <span className="req-icon">{passwordRequirements.number ? '✓' : '○'}</span>
              Un número
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary-modern"
        >
          <span>Continuar</span>
          <span className="btn-arrow">→</span>
        </button>


      </div>

      <div className="form-footer">
        <p>
          ¿Ya tenés cuenta?{" "}
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); onSwitch(); }}
            className="link-button"
          >
            Iniciá sesión
          </button>
        </p>
      </div>
    </form>
  );
};

export default PrimerFormRegistro;
