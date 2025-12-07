import type { NavigateFunction } from "react-router-dom";
import { PUBLIC_ROUTES, USER_ROUTES, ADMIN_ROUTES, GENERAL, ROUTE } from "../routers/Routes";


let navigator: NavigateFunction;


export const setNavigator = (nav: NavigateFunction) => {
  navigator = nav;
};


const go = (path: string) => {
  if (!navigator) {
    console.error("❌ Navigator no inicializado");
    return;
  }
  navigator(path);
};


export const Navegar = {
    home: () => go(PUBLIC_ROUTES.HOME),
    auth: () => go(PUBLIC_ROUTES.AUTH),
    contactanos: () => go(PUBLIC_ROUTES.CONTACTANOS),
    nosotros: () => go(PUBLIC_ROUTES.NOSOTROS),
    verPublicacion: (id: string) => go(PUBLIC_ROUTES.VIEW_PUBLICACION(id)),

    crearPublicacion: () => go(USER_ROUTES.CREAR_PUBLICACION),
    editarPublicacion: (id: string) => go(USER_ROUTES.EDITAR_PUBLICACION(id)),
    miPerfil: () => go(USER_ROUTES.MI_PERFIL),
    editarPerfil: () => go(USER_ROUTES.EDITAR_PERFIL),
    misPublicaciones: () => go(USER_ROUTES.MIS_PUBLICACIONES),
    misFavoritos: () => go(USER_ROUTES.MIS_FAVORITOS),
   
    chat: (id: string) => go(ROUTE.CHAT(id)),
    chatCompleto: () => go(ROUTE.MENSAJE) ,
    notificaciones: () => go("aun no existe"),
    denunciaConId: (id: string) => go(ROUTE.DENUNCIA(id)) ,
    contactos: () => go("aun no existe"),
    usuarioPerfil: (id: string) => go(ROUTE.OTRO_PERFIL(id)),
    admin: () => go(ADMIN_ROUTES.PANEL),
    verReporte:(id:string)=> go(ADMIN_ROUTES.REPORTE_DETALLE(id)),
    

    volverAtras: () => go(-1 as any),
    configuracion: () => go(GENERAL.CONFIGURACION),
    notFound: () => go("*"),
};
