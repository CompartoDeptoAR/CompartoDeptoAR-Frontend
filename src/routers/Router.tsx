import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../componentes/Layout/Layout";
import ProtectedRouter from "./ProtectedRoute";
import AuthPage from "../paginas/Auth/AuthPage";
import HomePage from "../paginas/Home/HomePage";
import { TokenService } from "../services/auth/tokenService";
import ContactarNosPage from "../paginas/Nosotros/ContactarNosPage";
import NosotrosPage from "../paginas/Nosotros/NosotosPage";
import TodasLasPublicaciones from "../paginas/Publicacion/Listar/TodasLasPublicaciones";



const Router: React.FC = () => {
  const authData = TokenService.getAuthData(); 
  
  return (
    <Routes>

      <Route path="/auth" element={!authData ? <AuthPage /> : <Navigate to="/" replace />}/>
      
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contactanos" element={<ContactarNosPage />}/>
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/todaslasPublicaciones" element={<TodasLasPublicaciones/>}/>
        <Route path="/*" element={<ProtectedRouter />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
