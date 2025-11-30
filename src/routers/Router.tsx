import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../componentes/Layout/Layout";
import ProtectedRouter from "./ProtectedRoute";
import AuthPage from "../paginas/Auth/AuthPage";
import HomePage from "../paginas/Home/HomePage";
import ContactanosPage from "../paginas/Nosotros/ContactanosPage";
import NosotrosPage from "../paginas/Nosotros/NosotosPage";
import TodasLasPublicaciones from "../paginas/Publicacion/Listar/TodasLasPublicaciones";
import {  PUBLIC_ROUTES, GENERAL } from "./Routes";

import { TokenService } from "../services/auth/tokenService";
import VerPublicacion from "../paginas/Publicacion/Funcionalidades/VerPublicacion";
import RestrictedAccess from "../paginas/Auth/RestrictedAccess";

const Router: React.FC = () => {
  const authData = TokenService.getAuthData();

  return (
    <Routes>

      <Route 
        path={PUBLIC_ROUTES.AUTH}
        element={!authData ? <AuthPage /> : <Navigate to={PUBLIC_ROUTES.HOME} replace />}
      />
      
      <Route element={<Layout />}>
        
        <Route path={PUBLIC_ROUTES.HOME} element={<HomePage />} />
        <Route path={PUBLIC_ROUTES.CONTACTANOS} element={<ContactanosPage />} />
        <Route path={PUBLIC_ROUTES.NOSOTROS} element={<NosotrosPage />} />
        <Route path={PUBLIC_ROUTES.TODAS_PUBLICACIONES} element={<TodasLasPublicaciones />} />
        <Route path={PUBLIC_ROUTES.VIEW_PUBLICACION()} element={<VerPublicacion />} />
     
        <Route path="/*" element={<ProtectedRouter />} />
      </Route>
      <Route path={GENERAL.RESTRICTED} element={<RestrictedAccess />} />
      <Route path={GENERAL.NOT_FOUND} element={<Navigate to={PUBLIC_ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default Router;
