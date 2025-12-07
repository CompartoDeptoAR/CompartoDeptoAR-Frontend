import { useState, useEffect } from "react";
import type { HabitosUsuario, PreferenciasUsuario } from "../modelos/Usuario";
import apiUsuario from "../api/endpoints/usuario";



interface UseHabitosPreferenciasProps {
  habitosIniciales?: HabitosUsuario;
  preferenciasIniciales?: PreferenciasUsuario;
  cargarDesdePerfil?: boolean;
}

export const useHabitosPreferencias = ({
  habitosIniciales,
  preferenciasIniciales,
  cargarDesdePerfil = false,
}: UseHabitosPreferenciasProps = {}) => {
  const [habitos, setHabitos] = useState<HabitosUsuario>(habitosIniciales || {});
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario>(preferenciasIniciales || {});
  const [cargando, setCargando] = useState(cargarDesdePerfil);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (cargarDesdePerfil) {
      cargarDatosPerfil();

    }
  }, []);

  const cargarDatosPerfil = async () => {
    try {
      setCargando(true);
      setError(null);

    
      const data = await apiUsuario.usuario.obtener();
      console.log("desde useHP: "+data)
      if (data.habitos) setHabitos(data.habitos);
      if (data.preferencias) setPreferencias(data.preferencias);
    } catch (err: any) {
      console.error("Error cargando perfil:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  
  const toggleHabito = (key: keyof HabitosUsuario) => {
    setHabitos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePreferencia = (key: keyof PreferenciasUsuario) => {
    setPreferencias((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setHabitosCompletos = (nuevosHabitos: HabitosUsuario) => {
    setHabitos(nuevosHabitos);
  };

  const setPreferenciasCompletas = (nuevasPreferencias: PreferenciasUsuario) => {
    setPreferencias(nuevasPreferencias);
  };


  const resetear = () => {
    setHabitos({});
    setPreferencias({});
  };

  return {
    habitos,
    preferencias,
    toggleHabito,
    togglePreferencia,
    setHabitos: setHabitosCompletos,
    setPreferencias: setPreferenciasCompletas,
    resetear,
    cargando,
    error,
  };
};
