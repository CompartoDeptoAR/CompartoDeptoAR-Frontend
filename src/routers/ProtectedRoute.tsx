import { Navigate, Route, Routes } from "react-router-dom";

import { TokenService } from "../services/auth/tokenService";
import { Rol } from "../modelos/Roles";
import { hasRole } from "../helpers/funcion";
import { Navegar } from "../navigation/navigationService";

import CrearPublicacion from "../paginas/Publicacion/Funcionalidades/CrearPublicacion";
import EditarPublicacion from "../paginas/Publicacion/Funcionalidades/EditarPublicacion";
import MisPublicaciones from "../paginas/Publicacion/Listar/MisPublicaciones";
import MisFavoritos from "../paginas/Publicacion/Listar/MisFavoritos";

import PerfilView from "../paginas/Perfil/PerfilView";
import PerfilEdit from "../paginas/Perfil/PerfilEdit";

import AdminPage from "../paginas/Admin/AdminPage";
import ReporteDetallePage from "../paginas/Admin/Reporte/ReporteDetallePage";

import Configuracion from "../paginas/Configuracion/Configuracion";
import DenunciaPage from "../paginas/Nosotros/DenunciaPage";
import { ChatCompleto } from "../paginas/Chat/ChatCompleto";

import { ADMIN_ROUTES, GENERAL, USER_ROUTES, ROUTE } from "./Routes";
import { NotFound } from "../paginas/system";
import VerPublicacionAdminPage from "@/paginas/Publicacion/Funcionalidades/VerPublicacioneAdminPage";


const ProtectedRouter = () => {
  const loggedIn = TokenService.getAuthData();

  if (!loggedIn) {
    return <Navigate to={GENERAL.RESTRICTED} replace />;
  }

  return (
    <Routes>

      {/* USER */}
      {hasRole(Rol.USUARIO) && (
        <>
          <Route path={USER_ROUTES.CREAR_PUBLICACION} element={<CrearPublicacion />} />
          <Route path={USER_ROUTES.MI_PERFIL} element={<PerfilView />} />
          <Route path={USER_ROUTES.EDITAR_PERFIL} element={<PerfilEdit />} />
          <Route path={USER_ROUTES.EDITAR_PUBLICACION()} element={<EditarPublicacion />} />
          <Route path={USER_ROUTES.MIS_FAVORITOS} element={<MisFavoritos />} />
          <Route path={USER_ROUTES.MIS_PUBLICACIONES} element={<MisPublicaciones />} />
        </>
      )}

      {/* ADMIN */}
      {hasRole(Rol.ADMIN) && (
        <>
          <Route path={ADMIN_ROUTES.PANEL} element={<AdminPage />} />
          <Route path={"/admin/reportes/:id"} element={<ReporteDetallePage />} />
          <Route path={"/admin/publicacion/:id"} element={<VerPublicacionAdminPage />}/>
        </>
      )}

      {/* OTROS PRIVADOS */}
      <Route path={"/denuncia/:id"} element={<DenunciaPage />} />
      <Route
        path={ROUTE.MENSAJE}
        element={
          <ChatCompleto
            idUsuario={TokenService.getUserId()!}
            onBack={Navegar.volverAtras}
          />
        }
      />
      <Route path={GENERAL.CONFIGURACION} element={<Configuracion />} />

      {/* 404 PRIVADO */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default ProtectedRouter;
