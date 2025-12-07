import { Rol } from "../modelos/Roles";
import { TokenService } from "../services/auth/tokenService";

export function hasRole(role: Rol): boolean {
  const userRoles = TokenService.getUserRol();

  if (!userRoles) return false;

  return Array.isArray(userRoles) && userRoles.includes(role);
}

export function hasAnyRole(roles: Rol[]): boolean {
  const userRoles = TokenService.getUserRol();

  if (!userRoles) return false;

  return roles.some(r => userRoles.includes(r));
}

export function isLoggedIn(): boolean {
  return !!TokenService.getAuthData();
}