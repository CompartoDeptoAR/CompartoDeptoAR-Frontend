import type { Rol } from "../../modelos/Roles";
import { LocalStorageService, STORAGE_KEYS } from "../storage/localStorage.service";

export interface AuthData {
  ID: string;
  rol: Rol[] | String[];
  mail?: string;
  uid: string;// es el firebaseUid del usuario
}

export class TokenService {

  static saveAuthData(data: AuthData, FToken: string): void {
    LocalStorageService.set(STORAGE_KEYS.USER_ID, data.ID);
    LocalStorageService.setObject(STORAGE_KEYS.USER_ROL, data.rol);
    LocalStorageService.set(STORAGE_KEYS.USER_MAIL, data.mail || "");
    LocalStorageService.set(STORAGE_KEYS.UID, data.uid);
    LocalStorageService.set(STORAGE_KEYS.FTOKEN, FToken);
  }

  static getUid(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.UID);
  }
  static getFToken(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.FTOKEN);
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
  static getTock(): string | null {
    return LocalStorageService.get(STORAGE_KEYS.UID);
  }
  static getAuthData(): AuthData | null {
    const uid = this.getUid();
    const ID = this.getUserId();
    const rol = this.getUserRol();

    if (!uid || !ID || rol.length === 0) return null;

    return {
      ID,
      rol,
      mail: this.getUserEmail() || undefined,
      uid,
    };
  }

  static isAuthenticated(): boolean {
    return this.getUid() !== null;
  }

  static clearAuthData(): void {
    LocalStorageService.remove(STORAGE_KEYS.UID);
    LocalStorageService.remove(STORAGE_KEYS.USER_ID);
    LocalStorageService.remove(STORAGE_KEYS.USER_ROL);
    LocalStorageService.remove(STORAGE_KEYS.USER_MAIL);
    LocalStorageService.remove(STORAGE_KEYS.FTOKEN);
  }
}
