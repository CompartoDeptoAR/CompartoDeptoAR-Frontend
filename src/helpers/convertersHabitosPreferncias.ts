import { OPCIONES_HABITOS, OPCIONES_PREFERENCIAS, type HabitoKey, type HabitosUsuario, type PreferenciaKey, type PreferenciasUsuario } from "../modelos/Usuario";

/**
 * Convierte un array de strings a objeto de hábitos
 */
export const arrayToHabitos = (arr: string[]): HabitosUsuario => {
  const habitos: HabitosUsuario = {};
  arr.forEach(item => {
    if (OPCIONES_HABITOS.includes(item as HabitoKey)) {
      habitos[item as HabitoKey] = true;
    }
  });
  return habitos;
};

/**
 * Convierte objeto de hábitos a array de strings
 */
export const habitosToArray = (habitos?: HabitosUsuario): HabitoKey[] => {
  if (!habitos) return [];
  return Object.entries(habitos)
    .filter(([_, value]) => value === true)
    .map(([key]) => key as HabitoKey);
};

/**
 * Convierte un array de strings a objeto de preferencias
 */
export const arrayToPreferencias = (arr: string[]): PreferenciasUsuario => {
  const preferencias: PreferenciasUsuario = {};
  arr.forEach(item => {
    if (OPCIONES_PREFERENCIAS.includes(item as PreferenciaKey)) {
      preferencias[item as PreferenciaKey] = true;
    }
  });
  return preferencias;
};

/**
 * Convierte objeto de preferencias a array de strings
 */
export const preferenciasToArray = (preferencias?: PreferenciasUsuario): PreferenciaKey[] => {
  if (!preferencias) return [];
  return Object.entries(preferencias)
    .filter(([_, value]) => value === true)
    .map(([key]) => key as PreferenciaKey);
};