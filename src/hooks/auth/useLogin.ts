import { useState } from "react";
import { TokenService } from "../../services/auth/tokenService";
import { useToast } from "../useToast";
import type { LoginRequest } from "../../api/types/auth.types";
import apiAuth from "../../api/endpoints/auth";
import { Navegar } from "../../navigation/navigationService";


export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { saveAuthData } = TokenService;
  const { toast, showSuccess, showError, hideToast } = useToast();

  const togglePassword = () => setMostrarPassword(p => !p);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const req: LoginRequest = { correo: email, contrasena: password };
      const data = await apiAuth.auth.login(req);

      saveAuthData(data);
      showSuccess("¡Inicio de sesión exitoso!");
      Navegar.home();

    } catch (err: any) {
      let errorMessage = "Error al iniciar sesión";

      if (err.response) {
        const backendError = err.response.data?.error || err.response.data?.message;
        const statusCode = err.response.status;
        errorMessage = `Error ${statusCode}: ${backendError || "No se pudo iniciar sesión"}`;
      }

      showError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    mostrarPassword,
    loading,
    toast,
    setEmail,
    setPassword,
    togglePassword,
    handleLogin,
    hideToast,
  };
}
