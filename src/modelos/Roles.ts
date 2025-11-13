export const Rol = {
  ADMIN: "ADMIN_ROLE",
  USUARIO: "USER_ROLE",
} as const;

export type Rol = (typeof Rol)[keyof typeof Rol];
