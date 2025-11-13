import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAuth from "../../../api/endpoints/auth";
import type { LoginRequest } from "../../../api/types/auth.types";
import { TokenService } from "../../../services/auth/tokenService";

const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const { saveAuthData }= TokenService;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const req: LoginRequest = { correo: email, contrasena: password };
      const data = await apiAuth.auth.login(req);

      saveAuthData( data );
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={handleLogin} className="form-container page-transition">
      <h2 className="form-title">Iniciar sesión</h2>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>

      <div>
        <label>Contraseña</label>
        <div>
          <input
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            minLength={8}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
            title="La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un número"
          />
          <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)}>
            {mostrarPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      <button type="submit">Ingresar</button>

      <p>
        ¿No tenés cuenta?
        <button type="button" onClick={onSwitch} >
          Registrate
        </button>
      </p>
      <p>
        ¿Olvidaste tu contraseña?
         <a href="#" onClick={e => { e.preventDefault(); onSwitch(); }}>
          Recuperar contraseña
        </a>
      </p>
    </form>
  );
};

export default LoginPage;
