export const STORAGE_KEYS = {
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
  USER_ROL: 'userRol',
  USER_MAIL: 'userEmail',
  UID: 'uid',
  IDTOKEN: 'idToken'
} as const;


export class LocalStorageService {

  static set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  static get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error leyendo localStorage:', error);
      return null;
    }
  }

  static setObject<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error guardando objeto en localStorage:', error);
    }
  }

  static getObject<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error parseando objeto de localStorage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}