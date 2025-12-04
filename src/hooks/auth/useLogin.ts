import { useState } from "react";
import { useToast } from "../useToast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import apiAuth from "../../api/endpoints/auth";
import { AuthData, TokenService } from "../../services/auth/tokenService";
import { Navegar } from "../../navigation/navigationService";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usuario, setUsuario] = useState<AuthData | null>(null); // 🔥 agregado

  const { toast, showSuccess, showError, hideToast } = useToast();
  const togglePassword = () => setMostrarPassword((p) => !p);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const backendData = await apiAuth.auth.login({ idToken });

      const authData: AuthData = {
        ID: backendData.ID,
        rol: backendData.rol,
        mail: backendData.mail,
        uid: backendData.uid,
      };

      setUsuario(authData);
      TokenService.saveAuthData(authData, idToken);

      showSuccess("¡Inicio de sesión exitoso!");
      Navegar.home();

    } catch (err: any) {
      console.error("Error completo:", err);

      let errorMessage = "Error al iniciar sesión";
      if (err.code) {
        const map: Record<string, string> = {
          "auth/invalid-email": "Email inválido",
          "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
          "auth/user-not-found": "No existe una cuenta con este correo",
          "auth/wrong-password": "Contraseña incorrecta",
          "auth/too-many-requests": "Demasiados intentos. Intenta más tarde",
        };
        errorMessage = map[err.code] || `Error de Firebase: ${err.code}`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
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
    usuario,       
    setUsuario,       
    setEmail,
    setPassword,
    togglePassword,
    handleLogin,
    hideToast,
  };
}
