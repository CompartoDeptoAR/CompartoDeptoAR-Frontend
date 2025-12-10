import { useState, useEffect, useRef } from "react";
import type { HabitosUsuario, PreferenciasUsuario } from "../modelos/Usuario";
import apiUsuario from "../api/endpoints/usuario";

interface UseHabitosPreferenciasProps {
  habitosIniciales?: HabitosUsuario;
  preferenciasIniciales?: PreferenciasUsuario;
  cargarDesdePerfil?: boolean;
  guardarEnPerfil?: boolean;
}

export const useHabitosPreferencias = ({
  habitosIniciales,
  preferenciasIniciales,
  cargarDesdePerfil = false,
  guardarEnPerfil = false,
}: UseHabitosPreferenciasProps = {}) => {

  const [habitos, setHabitos] = useState<HabitosUsuario>(habitosIniciales || {});
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario>(preferenciasIniciales || {});
  const [cargando, setCargando] = useState(cargarDesdePerfil);
  const [error, setError] = useState<string | null>(null);

  // 🔥🔥🔥
  const yaCargoInicial = useRef(false);

  useEffect(() => {
    if (cargarDesdePerfil) {
      cargarDatosPerfil();
    } else {
      yaCargoInicial.current = true;
    }
  }, [cargarDesdePerfil]);

  const cargarDatosPerfil = async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await apiUsuario.usuario.obtener();

      if (data.habitos) setHabitos(data.habitos);
      if (data.preferencias) setPreferencias(data.preferencias);

      yaCargoInicial.current = true;
    } catch (err: any) {
      console.error("Error cargando perfil:", err);
      setError(err.message || "Error desconocido");
      yaCargoInicial.current = true;
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!guardarEnPerfil) return;
    if (cargando) return;
    if (!yaCargoInicial.current) return;

    const timeout = setTimeout(() => {
      apiUsuario.usuario
        .editarPerfil({
          habitos,
          preferencias,
        })
        .catch((err) => {
          console.error("Error guardando hábitos y preferencias:", err);
        });
    }, 400);

    return () => clearTimeout(timeout);
  }, [habitos, preferencias, guardarEnPerfil, cargando]);

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
    setHabitos({ ...nuevosHabitos });
  };

  const setPreferenciasCompletas = (nuevasPreferencias: PreferenciasUsuario) => {
    setPreferencias({ ...nuevasPreferencias });
  };

  const resetear = () => {
    console.log("🔄 Reseteando hábitos y preferencias");
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