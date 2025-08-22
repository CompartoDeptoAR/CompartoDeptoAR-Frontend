import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAuth from "../../api/api.auth";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiAuth.auth.login(email,password)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.rol);

      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Iniciar sesion</h1>
      <h2>Email</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <h2>Contraseña</h2>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Ingresar</button>
      <p>
        ¿No tenes cuenta? <a href="/registro">Registrate</a>
      </p>
    </form>
  );
};

export default LoginPage;
