import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../../api/hoock/useLogin";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUsuario(email, password);

      // Guardar token y rol en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      navigate("/home"); // Redirige al home
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default LoginPage;
