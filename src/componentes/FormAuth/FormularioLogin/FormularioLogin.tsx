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
}) => (
  <form onSubmit={onSubmit} className="form-container">
    <h2 className="form-title">Iniciar sesión</h2>

    <div className="form-group">
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Email"
        required
        disabled={loading}
        //pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$" //sacar si no podemos entrar
      />
    </div>

    <div className="form-group">
      <label>Contraseña</label>

      <div className="password-wrapper">
        <input
          type={mostrarPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="********"
          required
          minLength={8}
          title="La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un número"
          disabled={loading}
        />

        <button
          type="button"
          className="toggle-password"
          onClick={onTogglePassword}
          disabled={loading}
        >
          {mostrarPassword ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>

    <button type="submit" disabled={loading}>
      {loading ? "Ingresando..." : "Ingresar"}
    </button>

    <button
      type="button"
      onClick={onGoogleLogin}
      disabled={loading}
      className="google-button"
      style={{ marginTop: "10px" }}
    >
      Iniciar sesión con Google
    </button>

    <p className="switch-text">
      ¿No tenés cuenta?{" "}
      <button type="button" onClick={onSwitch} disabled={loading} className="switch-button">
        Registrate
      </button>
    </p>
  </form>
);

export default FormularioLogin;
