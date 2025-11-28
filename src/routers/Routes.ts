export const PUBLIC_ROUTES = {
  AUTH: "/auth",
  HOME: "/",
  CONTACTANOS: "/contactanos",
  NOSOTROS: "/nosotros",
  TODAS_PUBLICACIONES: "/todaslasPublicaciones",
  VIEW_PUBLICACION: (id: string | number = ":id") => `/publicacion/${id}`,
};

export const USER_ROUTES = {
  CREAR_PUBLICACION: "/crear-publicacion",
  EDITAR_PUBLICACION: (id: string | number = ":id") => `/editar-publicacion/${id}`,

  MI_PERFIL: "/mi-perfil",
  EDITAR_PERFIL: "/editar-perfil",

  MIS_PUBLICACIONES: "/mis-publicaciones",
  MIS_FAVORITOS: "/mis-favoritos",
};

export const ADMIN_ROUTES = {
  PANEL: "/admin",
};

export const GENERAL = {
  CONFIGURACION:"/configuracion",
  NOT_FOUND: "*",
};

