import { useState } from "react";
import LoginPage from "./Login/LoginPage";
import RegistroPage from "./Registro/RegistroPage";
import '../../styles/auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => setIsLogin(!isLogin);

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className={`auth-slider ${isLogin ? "show-login" : "show-register"}`}>
          
          <div className="auth-panel panel-login">
            <LoginPage onSwitch={handleSwitch} />
          </div>

          <div className="auth-panel panel-register">
            <RegistroPage onSwitch={handleSwitch} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
