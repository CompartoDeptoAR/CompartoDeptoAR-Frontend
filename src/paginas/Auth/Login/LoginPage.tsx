import FormularioLogin from "../../../componentes/FormAuth/FormularioLogin/FormularioLogin";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useLogin } from "../../../hooks/auth/useLogin";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import apiAuth from "../../../api/endpoints/auth";
import { TokenService } from "../../../services/auth/tokenService";
import { Navegar } from "../../../navigation/navigationService";
import { useLoading } from "../../../contexts/LoadingContext";
import { useEffect } from "react";

const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
  const {
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
    setUsuario, 
  } = useLogin();
const { showLoader, hideLoader } = useLoading();
useEffect(() => {
      if (loading) showLoader();
      else hideLoader();
    }, [loading]);
  async function handleGoogleLogin() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const backendData = await apiAuth.auth.login({ idToken });

      const authData = {
        ID: backendData.ID,
        rol: backendData.rol,
        mail: result.user.email || "",
        uid: result.user.uid,
      };
      setUsuario(authData);
      TokenService.saveAuthData(authData, idToken);
      Navegar.home();

    } catch (error: any) {
      console.error("Error Google Login:", error);
      hideToast();
      setTimeout(() => {
        toast.show = true;
        toast.message = "Error al iniciar sesión con Google";
        toast.type = "error";
      }, 50);
    }
  }

  return (
    <>
      <FormularioLogin
        email={email}
        password={password}
        mostrarPassword={mostrarPassword}
        loading={loading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={togglePassword}
        onSubmit={handleLogin}
        onSwitch={onSwitch}
        onGoogleLogin={handleGoogleLogin}
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
