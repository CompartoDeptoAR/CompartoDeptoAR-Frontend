import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../paginas/Home/HomePage";
import Publicacion from "../paginas/Publicacion/Publicacion";
import CrearPublicacion from "../paginas/Publicacion/CrearPublicacion";
import AdminPage from "../paginas/Admin/AdminPage";
import { useUser } from "../contexts/UsuarioContext";
import PerfilView from "../paginas/Perfil/PerfilView";

const ProtectedRouter = () => {
  const { loggedIn, rol: userRol } = useUser();
  
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      
      {userRol === "USER_ROLE" && (
        <>
          <Route path="publicacion" element={<Publicacion />} />
          <Route path="crear-publicacion" element={<CrearPublicacion />} />
          <Route path="mi-perfil" element={<PerfilView />} />
        </>
      )}

      {userRol === "ADMIN_ROLE" && (
        <Route path="admin" element={<AdminPage />} />
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ProtectedRouter;
