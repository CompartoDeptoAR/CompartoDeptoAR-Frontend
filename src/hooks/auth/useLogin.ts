import { useState } from "react";
import { TokenService, AuthData } from "../../services/auth/tokenService";
import { useToast } from "../useToast";
import { Navegar } from "../../navigation/navigationService";
import apiAuth from "../../api/endpoints/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast, showSuccess, showError, hideToast } = useToast();
  const togglePassword = () => setMostrarPassword(p => !p);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const backendData = await apiAuth.auth.login({
        idToken,
        correo: "",
        contrasena: ""
      });

      const authData: AuthData = {
        ID: backendData.ID,
        rol: backendData.rol,
        mail: backendData.mail,
        idToken,
      };
      TokenService.saveAuthData(authData);

      showSuccess("¡Inicio de sesión exitoso!");
      Navegar.home();

    } catch (err: any) {
      console.error(err);

      let errorMessage = "Error al iniciar sesión";
      if (err.code) {
        const map: Record<string, string> = {
          "auth/user-not-found": "No existe un usuario con ese email",
          "auth/wrong-password": "Contraseña incorrecta",
          "auth/invalid-email": "Email inválido",
          "auth/user-disabled": "El usuario está deshabilitado",
        };
        errorMessage = map[err.code] || "Error al iniciar sesión";
      }
      if (err.response) {
        const backendError = err.response.data?.error || err.response.data?.message;
        errorMessage = backendError || errorMessage;
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
