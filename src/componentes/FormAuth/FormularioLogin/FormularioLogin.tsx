import React from "react";

interface FormLoginProps {
  email: string;
  password: string;
  mostrarPassword: boolean;
  loading: boolean;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
  onGoogleLogin?: () => void;
}

const FormularioLogin: React.FC<FormLoginProps> = ({
  email,
  password,
  mostrarPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onSwitch,
  onGoogleLogin,
}) => {
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);

  return (
    <form onSubmit={onSubmit} className="form-container form-moderno">
      <div className="form-header">
        <h2 className="form-title">¡Bienvenido de nuevo!</h2>
        <p className="form-subtitle">Ingresá a tu cuenta para continuar</p>
      </div>

      <div className="form-body">
        {/* Email */}
        <div className={`form-group-modern ${emailFocused ? 'focused' : ''} ${email ? 'filled' : ''}`}>
          <label className="floating-label">Email</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="tucorreo@ejemplo.com"
              required
              disabled={loading}
              className="modern-input"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className={`form-group-modern ${passwordFocused ? 'focused' : ''} ${password ? 'filled' : ''}`}>
          <label className="floating-label">Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Ingresá tu contraseña"
              required
              minLength={8}
              disabled={loading}
              className="modern-input"
            />
            <button
              type="button"
              className="toggle-password-modern"
              onClick={onTogglePassword}
              disabled={loading}
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <small className="input-hint">Mínimo 8 caracteres</small>
        </div>

        {/* Botones */}
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary-modern"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Ingresando...
            </>
          ) : (
            <>
              <span>Ingresar</span>
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>

        <div className="divider">
          <span>o continuar con</span>
        </div>

        <button
          type="button"
          onClick={() => onGoogleLogin?.()}
          disabled={loading}
          className="btn-google-modern"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Google
        </button>
      </div>

      <div className="form-footer">
        <p>
          ¿No tenés cuenta?{" "}
          <button 
            type="button" 
            onClick={onSwitch} 
            disabled={loading} 
            className="link-button"
          >
            Registrate aquí
          </button>
        </p>
      </div>
    </form>
  );
};

export default FormularioLogin;
