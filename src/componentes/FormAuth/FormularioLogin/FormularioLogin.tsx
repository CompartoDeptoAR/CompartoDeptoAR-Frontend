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
}) => (
  <form onSubmit={onSubmit} className="form-container page-transition">
    <h2 className="form-title">Iniciar sesión</h2>

    <div>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Email"
        required
        disabled={loading}
      />
    </div>

    <div>
      <label>Contraseña</label>

      {/* WRAPPER AGREGADO PARA PODER SEPARAR EL BOTÓN "VER/OCULTAR" */}
      <div className="password-wrapper">
        <input
          type={mostrarPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="********"
          required
          minLength={8}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
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

    <p>
      ¿No tenés cuenta?{" "}
      <button type="button" onClick={onSwitch} disabled={loading}>
        Registrate
      </button>
    </p>
  </form>
);

export default FormularioLogin;
