import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAuth from "../../../api/api.auth";
import'../../../styles/auth.css'
import { useUser } from "../../../contexts/UsuarioContext";

const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { setUser } = useUser(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiAuth.auth.login(email, password);


      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("id", data.id);


      setUser({
        id: data.id,
        rol: data.rol,
        loggedIn: true,
      });

    
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };



 return (
  <form onSubmit={handleLogin} className="form-container page-transition">
    <h2 className="form-title">Iniciar sesión</h2>

    {/* Email */}
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

    {/* Contraseña */}
    <div>
      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
    </div>

    <button type="submit">
      Ingresar
    </button>

    <p>
      ¿No tenés cuenta? <a href="#" onClick={e => { e.preventDefault(); onSwitch(); }}>Registrate</a>
    </p>
  </form>
);

};

export default LoginPage;
