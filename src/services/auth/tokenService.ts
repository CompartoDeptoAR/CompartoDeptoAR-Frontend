//import { LoginResponse } from "../../api/types/auth.types";
import type { Rol } from "../../modelos/Roles";
import { LocalStorageService, STORAGE_KEYS } from "../storage/localStorage.service";

export interface AuthData {
  ID: string;
  rol: Rol[] | String[];
  mail?: string;
  idToken: string;
}

export class TokenService {

  static saveAuthData(data: AuthData): void {
    LocalStorageService.set(STORAGE_KEYS.USER_ID, data.ID);
    LocalStorageService.setObject(STORAGE_KEYS.USER_ROL, data.rol);
    LocalStorageService.set(STORAGE_KEYS.USER_MAIL, data.mail || "");
    LocalStorageService.set(STORAGE_KEYS.TOKEN, data.idToken);
  }

  static getToken(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.TOKEN);
  }

  static getUserId(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.USER_ID);
  }

  static getUserRol(): Rol[] {
    return LocalStorageService.getObject<Rol[]>(STORAGE_KEYS.USER_ROL) || [];
  }

  static getUserEmail(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.USER_MAIL);
  }

  static getAuthData(): AuthData | null {
    const idToken = this.getToken();
    const ID = this.getUserId();
    const rol = this.getUserRol();

    if (!idToken || !ID || rol.length === 0) return null;

    return {
      idToken,
      ID,
      rol,
      mail: this.getUserEmail() || undefined,
    };
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static clearAuthData(): void {
    LocalStorageService.remove(STORAGE_KEYS.TOKEN);
    LocalStorageService.remove(STORAGE_KEYS.USER_ID);
    LocalStorageService.remove(STORAGE_KEYS.USER_ROL);
    LocalStorageService.remove(STORAGE_KEYS.USER_MAIL);
  }
}
