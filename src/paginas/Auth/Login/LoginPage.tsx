import FormularioLogin from "../../../componentes/FormAuth/FormularioLogin/FormularioLogin";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useLogin } from "../../../hooks/auth/useLogin";


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
  } = useLogin();

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