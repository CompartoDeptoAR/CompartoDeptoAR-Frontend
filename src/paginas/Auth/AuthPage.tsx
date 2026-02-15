import { useEffect, useState } from "react";
import LoginPage from "./Login/LoginPage";
import RegistroPage from "./Registro/RegistroPage";
import '../../styles/auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwitch = () => {
    if (isAnimating) return; 
    setIsAnimating(true);
    setIsLogin(!isLogin);
    setTimeout(() => setIsAnimating(false), 600); 
  };
  
  useEffect(() => {
    setIsLogin(true);
  }, []);

return (
  <div className="auth-page-ciudad">

   {/* 
    <div className="auth-hero-text">
      Encontrá tu compañero ideal...
    </div>  
    */}
    <div className="auth-background">
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
    </div>

    <div className="auth-wrapper">


        <div className="auth-tabs">
          <button 
            className={`tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => !isLogin && handleSwitch()}
            disabled={isAnimating}
          >
            
            Iniciar sesión
          </button>
          <button 
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => isLogin && handleSwitch()}
            disabled={isAnimating}
          >
          
            Crear cuenta
          </button>
          <div className={`tab-indicator ${isLogin ? 'left' : 'right'}`}></div>
        </div>

        <div className={`auth-slider ${isLogin ? "show-login" : "show-register"}`}>
          <div className="panel-login">
            <LoginPage onSwitch={handleSwitch} />
          </div>

          <div className=" panel-register">
            <RegistroPage onSwitch={handleSwitch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
