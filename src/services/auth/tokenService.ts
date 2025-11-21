import type { LoginResponse } from "../../api/types/auth.types";
import type { Rol } from "../../modelos/Roles";
import { LocalStorageService, STORAGE_KEYS } from "../storage/localStorage.service";



export interface AuthData extends LoginResponse{};

export class TokenService {

  static saveAuthData(data: AuthData): void {
    LocalStorageService.set(STORAGE_KEYS.TOKEN, data.token);
    LocalStorageService.set(STORAGE_KEYS.USER_ID, data.ID);
    LocalStorageService.setObject(STORAGE_KEYS.USER_ROL, data.rol);
    
    if (data.mail) {
      LocalStorageService.set(STORAGE_KEYS.USER_MAIL, data.mail);
    }
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
    const token = this.getToken();
    const ID = this.getUserId();
    const rol = this.getUserRol();

    if (!token || !ID || rol.length === 0) {
      return null;
    }

    return {
      token,
      ID,
      rol,
      mail: this.getUserEmail() || undefined,
    };
  }


  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }


  static isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
  
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;

      if (!exp) return false;

    
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error('Error verificando expiración del token:', error);
      return true;
    }
  }

 
  static clearAuthData(): void {
    LocalStorageService.remove(STORAGE_KEYS.TOKEN);
    LocalStorageService.remove(STORAGE_KEYS.USER_ID);
    LocalStorageService.remove(STORAGE_KEYS.USER_ROL);
    LocalStorageService.remove(STORAGE_KEYS.USER_MAIL);
    LocalStorageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
    LocalStorageService.remove(STORAGE_KEYS.PREFERENCES);
  }

 
  static updateToken(token: string): void {
    LocalStorageService.set(STORAGE_KEYS.TOKEN, token);
  }

  
  static saveRefreshToken(refreshToken: string): void {
    LocalStorageService.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  static getRefreshToken(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.REFRESH_TOKEN);
  }
}