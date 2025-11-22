import { useState } from "react";
import apiAuth from "../../../api/endpoints/auth";
import type { LoginRequest } from "../../../api/types/auth.types";
import { TokenService } from "../../../services/auth/tokenService";
import { Navigation } from "../../../navigation/navigationService";
import { useToast } from "../../../componentes/ToastNotification/useToast";
import FormularioLogin from "../../../componentes/FormAuth/FormularioLogin/FormularioLogin";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";




const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { saveAuthData } = TokenService;
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const req: LoginRequest = { correo: email, contrasena: password };
      const data = await apiAuth.auth.login(req);

      saveAuthData(data);
      showSuccess("¡Inicio de sesión exitoso!");
      Navigation.home();
    } catch (err: any) {
      let errorMessage = "Error al iniciar sesión";
      if (err.response) {
        const backendError = err.response.data?.error || err.response.data?.message;
        const statusCode = err.response.status;
        errorMessage = `Error ${statusCode}: ${backendError || "No se pudo iniciar sesión"}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormularioLogin
        email={email}
        password={password}
        mostrarPassword={mostrarPassword}
        loading={loading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setMostrarPassword(!mostrarPassword)}
        onSubmit={handleLogin}
        onSwitch={onSwitch}
      />
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default LoginPage;