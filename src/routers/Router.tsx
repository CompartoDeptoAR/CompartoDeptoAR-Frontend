import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../componentes/Layout/Layout";
import ProtectedRouter from "./ProtectedRoute";

import AuthPage from "../paginas/Auth/AuthPage";
import HomePage from "../paginas/Home/HomePage";
import ContactanosPage from "../paginas/Nosotros/ContactanosPage";
import NosotrosPage from "../paginas/Nosotros/NosotosPage";
import TodasLasPublicaciones from "../paginas/Publicacion/Listar/TodasLasPublicaciones";
import VerPublicacion from "../paginas/Publicacion/Funcionalidades/VerPublicacion";
import PerfilOtroUsuarioView from "../paginas/Perfil/PerfilOtroUsuarioView";

import { PUBLIC_ROUTES, GENERAL } from "./Routes";
import { TokenService } from "../services/auth/tokenService";
import {RestrictedAccess,EnConstruccion,NotFound,Error500} from "../paginas/system";

const Router: React.FC = () => {
  const authData = TokenService.getAuthData();

  return (
    <Routes>
      <Route element={<Layout />}>

        {/* AUTH */}
        <Route
          path={PUBLIC_ROUTES.AUTH}
          element={!authData ? <AuthPage /> : <Navigate to={PUBLIC_ROUTES.HOME} replace />}
        />

        {/* PUBLIC */}
        <Route path={PUBLIC_ROUTES.HOME} element={<HomePage />} />
        <Route path={PUBLIC_ROUTES.CONTACTANOS} element={<ContactanosPage />} />
        <Route path={PUBLIC_ROUTES.NOSOTROS} element={<NosotrosPage />} />
        <Route path={PUBLIC_ROUTES.TODAS_PUBLICACIONES} element={<TodasLasPublicaciones />} />
        <Route path={PUBLIC_ROUTES.VIEW_PUBLICACION()} element={<VerPublicacion />} />
        <Route path="/perfil/:id" element={<PerfilOtroUsuarioView />} />

        {/* SYSTEM */}
        <Route path={GENERAL.RESTRICTED} element={<RestrictedAccess />} />
        <Route path={GENERAL.EN_CONSTRUCCION} element={<EnConstruccion />} />

        {/* PRIVADAS */}
        <Route path="/*" element={<ProtectedRouter />} />
        {/*Error 500 */}
        <Route path="/Error500" element={<Error500 />} />

        {/* 404 FINAL */}
        <Route path="*" element={<NotFound />} />


      </Route>
    </Routes>
  );
};

export default Router;
