import { Navigate, Route, Routes } from "react-router-dom";
import CrearPublicacion from "../paginas/Publicacion/Funcionalidades/CrearPublicacion";
import AdminPage from "../paginas/Admin/AdminPage";
import PerfilView from "../paginas/Perfil/PerfilView";
import { TokenService } from "../services/auth/tokenService";
import { Rol } from "../modelos/Roles";
import PerfilEdit from "../paginas/Perfil/PerfilEdit";
import EditarPublicacion from "../paginas/Publicacion/Funcionalidades/EditarPublicacion";
import MisPublicaciones from "../paginas/Publicacion/Listar/MisPublicaciones";
import MisFavoritos from "../paginas/Publicacion/Listar/MisFavoritos";
import Configuracion from "../paginas/Configuracion/Configuracion";
import VerPublicacion from "../paginas/Publicacion/Funcionalidades/VerPublicacion";
import { ADMIN_ROUTES, GENERAL, USER_ROUTES, PUBLIC_ROUTES } from "./Routes";

const ProtectedRouter = () => {
  const loggedIn = TokenService.getAuthData();
  const userRol = TokenService.getUserRol();
  
  // Si no está logueado, redirigir al login
  if (!loggedIn) {
    return <Navigate to={PUBLIC_ROUTES.AUTH} replace />;
  }
  
  const hasRole = (role: Rol) => 
    Array.isArray(userRol) && userRol.includes(role);
    
  return (
    <Routes>
      
      {hasRole(Rol.USUARIO) && (
        <>
          <Route path={USER_ROUTES.VIEW_PUBLICACION()} element={<VerPublicacion />} />
          <Route path={USER_ROUTES.CREAR_PUBLICACION} element={<CrearPublicacion />} />
          <Route path={USER_ROUTES.MI_PERFIL} element={<PerfilView />} />
          <Route path={USER_ROUTES.EDITAR_PERFIL} element={<PerfilEdit />} />
          <Route path={USER_ROUTES.EDITAR_PUBLICACION()} element={<EditarPublicacion/>}/>
          <Route path={USER_ROUTES.MIS_FAVORITOS} element={<MisFavoritos/>}/>
          <Route path={USER_ROUTES.MIS_PUBLICACIONES} element={<MisPublicaciones/>}/>
        </>
      )}

      {hasRole(Rol.ADMIN) && (
        <Route path={ADMIN_ROUTES.PANEL} element={<AdminPage />} />
      )}

      <Route path={GENERAL.CONFIGURACION} element={<Configuracion/>}/>
      <Route path={GENERAL.NOT_FOUND} element={<Navigate to={PUBLIC_ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default ProtectedRouter;