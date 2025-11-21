import { Navigate, Route, Routes } from "react-router-dom";
import Publicacion from "../paginas/Publicacion/VerPublicacion";
import CrearPublicacion from "../paginas/Publicacion/CrearPublicacion";
import AdminPage from "../paginas/Admin/AdminPage";
import PerfilView from "../paginas/Perfil/PerfilView";
import { TokenService } from "../services/auth/tokenService";
import { Rol } from "../modelos/Roles";
import PerfilEdit from "../paginas/Perfil/PerfilEdit";
import EditarPublicacion from "../paginas/Publicacion/EditarPublicacion";

const ProtectedRouter = () => {
  const  loggedIn = TokenService.getAuthData();
  const userRol = TokenService.getUserRol();
  
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }
  const hasRole = (role: Rol) => 
  Array.isArray(userRol) && userRol.includes(role);
  return (
    <Routes>
      
      {hasRole(Rol.USUARIO) && (
        <>
          <Route path="publicacion" element={<Publicacion />} />
          <Route path="crear-publicacion" element={<CrearPublicacion />} />
          <Route path="mi-perfil" element={<PerfilView />} />
          <Route path="editar-perfil" element={<PerfilEdit />} />
          <Route path="editar-publicacion" element={<EditarPublicacion/>}/>
          <Route path="favoritos" />
          <Route path="mis-publicaciones" />
        </>
      )}

      {hasRole(Rol.ADMIN) && (
        <Route path="admin" element={<AdminPage />} />
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ProtectedRouter;
