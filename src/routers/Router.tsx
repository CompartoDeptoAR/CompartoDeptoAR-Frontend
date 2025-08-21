import { Routes, Route, Navigate } from "react-router-dom";
import RegistroPage from "../paginas/Registro/RegistroPage";
import ProtectedRouter from "./ProtectedRoute";
import LoginPage from "../paginas/Login/LoginPage";

const isLoggedIn = () => !!localStorage.getItem("token");

const Router: React.FC = () => {
  return (
     <Routes>
      {/* Ruta publica de registro */}
      <Route path="/registro" element={isLoggedIn() ? <Navigate to="/home" replace /> : <RegistroPage />} />
      <Route path="/login" element={isLoggedIn() ? <Navigate to="/home" replace /> : <LoginPage />} />

      {/* Rutas protegidas */}
      <Route path="/*" element={<ProtectedRouter />} />
      
      {/* Redirigir / al home o registro según el estado */}
      <Route path="/" element={isLoggedIn() ? <Navigate to="/home" replace /> : <Navigate to="/registro" replace />} />
    </Routes>
  );
};

export default Router;
